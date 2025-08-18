import mysql.connector 
from mysql.connector import Error
from flask_cors import CORS
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)

def dbconnect():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="registroeventos"
        )
    
    except mysql.connector.Error as Error:
        print(f"erro ao conectar, {Error}")
        return None;

@app.route('/getEvents', methods=['GET'])
def getEventos():
    mydb = dbconnect()

    
