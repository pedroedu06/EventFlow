from flask import Blueprint, jsonify, request
import smtplib 
from email.message import EmailMessage
import mysql.connector
from datetime import datetime, timezone, timedelta
import random
import jwt
from functools import wraps


reset_pass_bp = Blueprint('reset_pass', __name__, url_prefix='/reset_pass')

ALGORITHM = "HS256"
SECRET_KEY = "CHAVE_SECRETA"

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="Eventflow"
)

def get_db():
    global db
    if not db.is_connected():
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="Eventflow"
        )
    return db    

def code_generate():
    code = random.randint(100000, 999999)
    expiration = datetime.now(timezone.utc) + timedelta(minutes=10)

    return str(code), expiration


def reset_password(code, email): 
    try:
        remetente = "pedro.nascimento182501@gmail.com"
        destinatario = email
        assunto = "Redefinição de Senha"
        senha = "yywt flov eyik snaj"
        mensagem = f"""
        Olá, redefina sua senha clicando no link abaixo:
        {code}
        caso nao foi voce que pediu a redefinição de senha, ignore este email.
        """

        msg = EmailMessage()
        msg['From'] = remetente
        msg['To'] = destinatario
        msg['Subject'] = assunto
        msg.set_content(mensagem)

        try:
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
                smtp.login(remetente, senha)
                smtp.send_message(msg)
                print("email enviado")
        except Exception as e:
            print(f"Erro ao enviar email: {e}")
    except Exception as e:
        print(f"Erro ao preparar o email: {e}")

@reset_pass_bp.route('/send_Reset', methods=['POST'])
def send_reset_token():
    try:
        data = request.get_json()
        email = data.get("email")

        cursor1 = get_db().cursor(dictionary=True)
        cursor1.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
        user = cursor1.fetchone()
        cursor1.close()

        code, expiration = code_generate()
        
        if user:
            cursor2 = get_db().cursor(dictionary=True)
            cursor2.execute(
                "INSERT INTO resetSenhaTokens(email, code, expiration)VALUES (%s, %s, %s)",
                (email, code, expiration)
            )
            get_db().commit()
            cursor2.close()

        reset_password(code, email)

        return jsonify({"message": "Codigo de redefinição enviado para o email"}), 200
    except Exception as e:
        print(f"Erro ao processar a solicitação: {e}")
        return jsonify({"error": "Erro ao processar a solicitação"}), 500


@reset_pass_bp.route('/verify_token', methods=['POST'])
def verify_token(): 
    try: 
        data = request.get_json()
        email = data.get('email')
        code = data.get('code')

        cursor = get_db().cursor(dictionary=True)
        cursor.execute("SELECT * FROM resetSenhaTokens WHERE email = %s", (email,))
        token_entry = cursor.fetchone()
        cursor.close()

        if not token_entry:
            return jsonify({"error": "Nenhum codigo encontrado"}), 404
        
        if token_entry["code"] != code:
            return jsonify({"error": "Codigo invalido"}), 400
        
        if datetime.now() > token_entry['expiration']:
            return jsonify({"error": "Codigo expirado"}), 400

        return jsonify({"sucesso": "Token validado com sucesso!", "email": email}), 200
    
    except Exception as e:
        print("error ao validadar tudo", e)
        return jsonify({"error": "erro no banco ou internamente"})



@reset_pass_bp.route("/changePass", methods=['POST'])
def change_pass():
    try:
        data = request.get_json()
        newPassword = data.get('newPass')
        email = data.get('email')

        if not email or not newPassword:
            return jsonify({'error': 'senha esta errada'}), 400

        get_db().reset_session()
        cursor = get_db().cursor()
        cursor.execute("UPDATE usuarios SET password = %s WHERE email = %s", (newPassword, email))
        get_db().commit()
        cursor.close()

        return jsonify({"message": "Senha alterada com sucesso"}), 200

    except Exception as e:
        print(f"Erro ao alterar senha: {e}")
        return jsonify({"error": "Erro interno no servidor"}), 500   