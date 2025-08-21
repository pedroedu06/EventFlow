import mysql.connector
from mysql.connector import Error
from flask import Flask, request, jsonify
from flask_cors import CORS
import re

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

if __name__ == "__main__":
    app.run(port=5000, debug=True)