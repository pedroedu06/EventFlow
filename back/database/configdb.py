import mysql.connector
from mysql.connector import Error
from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import os
from flask.json.provider import DefaultJSONProvider
from datetime import datetime, time, timedelta


app = Flask(__name__);
CORS(app);


def get_connection():
    try:
        return mysql.connector.connect(    
            host="localhost",
            user="root",
            password="",
            database="registro-de-usuarios"
        )
    except mysql.connector.Error as Error:
        print(f"Error ao conectar: {Error}")
        return None

@app.route('/register', methods=['POST'])
def registar_usuarios():
    mydb = get_connection()
    if mydb is None:
        return jsonify({"error": "erro ao conectar"}), 500

    try:
        dados = request.get_json()
        email = dados['email']
        username = dados['username']
        data = dados['birthdate']
        password = dados['password']

        mydb = get_connection()
        cursor = mydb.cursor()
        cursor.execute("INSERT INTO usuarios (email, username, data, password) VALUES (%s, %s, %s, %s)", (email, username, data, password))
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
    loginForm = dados['loginForm']
    password = dados['password']

    isemail = re.match(r"[^@]+@[^@]+\.[^@]+", loginForm) is not None

    try:
        mydb = get_connection()
        cursor = mydb.cursor(dictionary=True)

        if isemail:
            cursor.execute("SELECT * FROM usuarios WHERE email = %s", (loginForm,))
        else:
            cursor.execute("SELECT * FROM usuarios WHERE username = %s", (loginForm,))

        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'Usuario nao encontrado'}), 404
        if user["password"] != password:
            return jsonify({"error": 'Senha incorreta'})
        
        return jsonify({'message': "login bem sucedido", "user": user})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if mydb and mydb.is_connected():
            mydb.close()


# adm dashbord

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
            database="registroeventos"
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
        cursor.execute("INSERT INTO eventos (nome, dataInicio, dataFinal, horario, local, description, role) VALUES (%s, %s, %s, %s, %s, %s, %s)", (nome, dataInicio, dataFim, horarioEvent, local, description, optionValue))
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


@app.route('/getEvents', methods=['GET'])
def getEventos():
    mydb = get_dbConnection()
    if mydb is None:
        return jsonify({'Error': "nao conectou ao banco"}), 500
    
    cursor = mydb.cursor(dictionary=True)

    quary = ("SELECT * FROM eventos")

    cursor.execute(quary)

    eventos = cursor.fetchall()
    return jsonify(eventos)

@app.route('/getEvent_MIN', methods=['GET'])
def getEvent_MIN():
    conn = get_dbConnection();
    cursor = conn.cursor(dictionary=True);

    cursor.execute("SELECT id, nome FROM eventos")
    eventos = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(eventos);

@app.route('/deleteEvent/<int:evento_id>', methods=['DELETE'])
def deleteEvent(evento_id):
    conn = get_dbConnection()
    cursor = conn.cursor()

    quary = "DELETE FROM eventos WHERE id = %s"
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
        dataFim = dados['dataFim']
        horarioEvent = dados['horarioEvent']
        local = dados['local']
        description = dados['description']
        optionValue = dados['optionValue']

        conn = get_dbConnection()
        cursor = conn.cursor()

        quary= """
            UPDATE eventos
            SET nome = %s, dataInicio = %s, dataFinal = %s, horario = %s, local = %s, description = %s, role = %s
            WHERE id = &s
        """
        
        cursor.execute(quary, (nome, dataInicio, dataFim, horarioEvent, local, description, optionValue))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"Sucesso": f"Evento atualizado com sucesso: {evento_id}"}), 400
    except Exception as e: 
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)