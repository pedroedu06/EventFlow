import mysql.connector 
from mysql.connector import Error
from flask_cors import CORS
from flask import Flask, request, jsonify

app = Flask(__name__)
app(CORS)

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

@app.route("/registroevento", methods="POST")
def criarEvento():
      mydbConnection = get_dbConnection()

      if mydbConnection is None:
            return jsonify({"Error", "Erro ao connectar ao banco de dados"}), 500

    try:
        dados = request.get_json()
        nome = dados['']
