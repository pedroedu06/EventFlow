from flask import Blueprint, jsonify, request, current_app
import smtplib 
from email.message import EmailMessage
import mysql.connector
from datetime import datetime, timezone, timedelta
import random

reset_pass_bp = Blueprint('reset_pass', __name__, url_prefix='/reset_pass')

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="Eventflow"
)

if db.is_connected():
    print("Conectado ao banco de dados")

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

        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user: 
            return jsonify({"error": "Usuario nao encontrado"}), 404
        
        code, expiration = code_generate()

        reset_password(code, email)

        return jsonify({"message": "Codigo de redefinição enviado para o email"}), 200
    except Exception as e:
        print(f"Erro ao processar a solicitação: {e}")
        return jsonify({"error": "Erro ao processar a solicitação"}), 500


