import mysql.connector
from mysql.connector import Error
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import re
import os
from flask.json.provider import DefaultJSONProvider
from datetime import datetime, time, timedelta, timezone
import jwt

from functools import wraps


app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])


def get_connection():
    try:
        return mysql.connector.connect(    
            host="localhost",
            user="root",
            password="",
            database="EventFlow"
        )
    except mysql.connector.Error as Error:
        print(f"Error ao conectar: {Error}")
        return None

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'troque_por_um_segredo_forte')
app.config['JWT_ALGORITHM'] = 'HS256'
app.config['ACCESS_TOKEN_EXPIRES_MINUTES'] = 15

def generateAcessToken(id: int, role: str) -> str:
    payload = {
        'sub': id,
        'role': role,
        'iat': datetime.now(timezone.utc),
        'exp': datetime.now(timezone.utc) + timedelta(minutes=app.config['ACCESS_TOKEN_EXPIRES_MINUTES']),
    }

    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm=app.config['JWT_ALGORITHM'])

    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('access_token')
        if not token:
            return jsonify({'message': 'Token ausente'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=[app.config['JWT_ALGORITHM']])
            request.user = {'id': data.get('sub'), 'role': data.get('role')}
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/register', methods=['POST'])
def registar_usuarios():
    mydb = get_connection()
    if mydb is None:
        return jsonify({"error": "erro ao conectar"}), 500

    try:
        dados = request.get_json()
        email = dados['email']
        username = dados['username']
        data_nasc = dados['birthdate']
        password = dados['password']

        mydb = get_connection()
        cursor = mydb.cursor()
        cursor.execute("INSERT INTO usuarios (email, username, data_nasc, password) VALUES (%s, %s, %s, %s)", (email, username, data_nasc, password))
        mydb.commit()
        mydb.close()

        return jsonify({"message": "Usuario registrado"})
    
    except mysql.connector.Error as Error:
        print(f"Erro no registro {Error}")
        return jsonify ({"error": "erro ao registrar"}), 500
    finally:
        if cursor in locals():
            cursor.close()
        if mydb and mydb.is_connected():
            mydb.close()    

@app.route('/usuarios', methods=['GET']) 
def listar_usuarios():
    mydb = get_connection()
    if mydb is None:
        return jsonify({"error": "erro ao conectar"}), 500

    try:
        cursor = mydb.cursor(dictionary=True)
        cursor.execute("SELECT email, username FROM usuarios")
        usuarios = cursor.fetchall()
        return jsonify(usuarios)

    except mysql.connector.Error as Error:
        print(f"Erro ao listar usuários: {Error}")
        return jsonify({"error": "erro ao listar usuários"}), 500
    finally:
        if cursor in locals():
            cursor.close()
        if mydb and mydb.is_connected():
            mydb.close()

@app.route("/login", methods=["POST"])
def login():

    dados = request.get_json()
    login = dados['login']
    password = dados['password']

    isemail = re.match(r"[^@]+@[^@]+\.[^@]+", login) is not None

    try:
        mydb = get_connection()
        cursor = mydb.cursor(dictionary=True)

        if isemail:
            cursor.execute("SELECT * FROM usuarios WHERE email = %s", (login,))
        else:
            cursor.execute("SELECT * FROM usuarios WHERE username = %s", (login,))

        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'Usuario nao encontrado'}), 404
        if user["password"] != password:
            return jsonify({"error": 'Senha incorreta'})    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if mydb and mydb.is_connected():
            mydb.close()
    
    token = generateAcessToken(user['id'], user['role'])

    return jsonify({'token': token, 'role': user['role']})

@app.route('/DashbordEvent', methods=['GET'])
@token_required
def protected_admin():
		user = getattr(request, 'user', None)
		if not user or user.get('role') != 'admin':
				return jsonify({'message': 'Acesso negado: admin required'}), 403
		return jsonify({'message': f"Bem-vindo, admin {user.get('id')}"})


@app.route('/logout', methods=['POST'])
def logout():
		"""Remove o cookie do access token no cliente."""
		resp = make_response(jsonify({'message': 'Desconectado'}))
		resp.set_cookie('access_token', '', expires=0)
		return resp







"""


adm dashboard
para criar eventos e etc


"""



class CustomJSONEncoder(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, (datetime, time)):
            return obj.isoformat()
        if isinstance(obj, timedelta):
            return str(obj)
        return super().default(obj)   

app.json = CustomJSONEncoder(app);

def get_dbConnection():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="EventFlow"
        )
    except mysql.connector.Error as Error:
            print(f"deu certo nao pai", {Error})
            return None

#local de criar evento

@app.route("/registroevento", methods=["POST"])
def criarEvento():
    mydbConnection = get_dbConnection()

    if mydbConnection is None:
        return jsonify({"Error": "Erro ao connectar ao banco de dados"}), 500

    try:
        dados = request.get_json()
        nome = dados['name']
        dataInicio = dados['dataInicio']    
        dataFim = dados['dataFim']
        horarioEvent = dados['horarioEvent']
        local = dados['local']
        description = dados['description']
        optionValue = dados['optionValue']

        mydb = get_dbConnection()
        cursor = mydb.cursor()
        cursor.execute("INSERT INTO eventos (nome, dataInicio, dataFim, horarioEvent, local, description, role) VALUES (%s, %s, %s, %s, %s, %s, %s)", (nome, dataInicio, dataFim, horarioEvent, local, description, optionValue))
        mydb.commit()
        mydb.close()
  
        return jsonify({"Sucesso": "evento registrado com sucesso!"})

    except mysql.connector.Error as Error:
        print(f'erro ao conectar', {Error})
        return jsonify({"Error": "Erro ao registrar o evento"})
    finally: 
        if cursor in locals():
            cursor.close()
        if mydb and mydb.is_connected():
            mydb.close()


UPLOAD_FOLDER = "uploads";
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def uploadFiles():
    if 'file' not in request.files:
        return jsonify({'Error': 'nao tem arquivos'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nome de arquivo vazio'}), 400
    
    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(save_path)

    return jsonify({'mensage': f'Arquivo salvo com sucesso!'})


@app.route('/getEvents/<int:event_id>', methods=['GET'])
def getEventos(event_id):
    mydb = get_dbConnection()
    if mydb is None:
        return jsonify({'Error': "nao conectou ao banco"}), 500
    
    cursor = mydb.cursor(dictionary=True)

    quary = ("SELECT * FROM eventos WHERE id_eventos = %s")

    cursor.execute(quary, (event_id,))
    evento = cursor.fetchone()

    cursor.close()
    mydb.close()

    if evento is None:
        return jsonify({"error": "evento nao encontrado"}), 404
    else:
       return jsonify(evento)


@app.route('/getEvent_MIN', methods=['GET'])
def getEvent_MIN():
    conn = get_dbConnection();
    cursor = conn.cursor(dictionary=True);

    cursor.execute("SELECT id_eventos, nome FROM eventos")
    eventos = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(eventos);

@app.route('/deleteEvent/<int:evento_id>', methods=['DELETE'])
def deleteEvent(evento_id):
    conn = get_dbConnection()
    cursor = conn.cursor()

    quary = "DELETE FROM eventos WHERE id_eventos = %s"
    cursor.execute(quary, (evento_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"mensagem": f"evento deletado com sucesso"})

@app.route('/admEdit/<int:evento_id>', methods=['PUT'])
def editEvent(evento_id):

    try:
        dados = request.get_json()
        nome = dados['name']
        dataInicio = dados['dataInicio']    
        dataFim = dados['dataFinal']
        horarioEvent = dados['horarioEvent']
        local = dados['local']
        description = dados['description']
        optionValue = dados['optionValue']
        print(dados)

        conn = get_dbConnection()
        cursor = conn.cursor()

        quary= """
            UPDATE eventos
            SET nome = %s, dataInicio = %s, dataFim = %s, horarioEvent = %s, local = %s, description = %s, role = %s
            WHERE id_eventos = %s
        """
        
        cursor.execute(quary, (nome, dataInicio, dataFim, horarioEvent, local, description, optionValue, evento_id))
        conn.commit()

        return jsonify({"Sucesso": f"Evento atualizado com sucesso: {evento_id}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()


if __name__ == "__main__":
    app.run(port=5000, debug=True)