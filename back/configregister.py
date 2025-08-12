import mysql.connector
from mysql.connector import Error
from flask import Flask, request, jsonify
from flask_cors import CORS

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
        birthdate = dados['birthdate']
        password = dados['password']

        mydb = get_connection()
        print(dados)
        cursor = mydb.cursor()
        cursor.execute("INSERT INTO usuarios (email, username, birthdate, password) VALUES (%s, %s, %s, %s)", (email, username, birthdate, password))
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

if __name__ == "__main__":
    app.run(port=5000, debug=True)