import mysql.connector 
from mysql.connector import Error
from flask_cors import CORS
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app);

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
        local = dados['local']
        description = dados['description']
        optionValue = dados['optionValue']

        mydb = get_dbConnection()
        cursor = mydb.cursor()
        cursor.execute("INSERT INTO eventos (nome, dataInicio, dataFinal, local, description, role) VALUES (%s, %s, %s, %s, %s, %s)", (nome, dataInicio, dataFim, local, description, optionValue))
        mydb.commit()
        mydb.close()

        return jsonify({"mensagem": "Evento registrado com sucesso"})

    except mysql.connector.Error as Error:
        print(f'erro ao conectar', {Error})
        return jsonify({"Error": "Erro ao registrar o evento"})
    finally: 
        if cursor in locals():
            cursor.close()
        if mydb and mydb.is_connected():
            mydb.close()


if __name__ == "__main__":
    app.run(port=5000, debug=True);