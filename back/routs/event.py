
import mysql.connector
from mysql.connector import Error
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
import re
import os

event_bp = Blueprint('event', __name__, url_prefix='/auth')


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

@event_bp.route("/registroevento", methods=["POST"])
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

@event_bp.route('/upload', methods=['POST'])
def uploadFiles():
    if 'file' not in request.files:
        return jsonify({'Error': 'nao tem arquivos'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nome de arquivo vazio'}), 400
    
    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(save_path)

    return jsonify({'mensage': f'Arquivo salvo com sucesso!'})


@event_bp.route('/getEvents/<int:event_id>', methods=['GET'])
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


@event_bp.route('/getEvent_MIN', methods=['GET'])
def getEvent_MIN():
    conn = get_dbConnection();
    cursor = conn.cursor(dictionary=True);

    cursor.execute("SELECT id_eventos, nome FROM eventos")
    eventos = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(eventos);

@event_bp.route('/deleteEvent/<int:evento_id>', methods=['DELETE'])
def deleteEvent(evento_id):
    conn = get_dbConnection()
    cursor = conn.cursor()

    quary = "DELETE FROM eventos WHERE id_eventos = %s"
    cursor.execute(quary, (evento_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"mensagem": f"evento deletado com sucesso"})

@event_bp.route('/admEdit/<int:evento_id>', methods=['PUT'])
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
