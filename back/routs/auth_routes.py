import mysql.connector
from mysql.connector import Error
from flask import Flask, request, jsonify, make_response, Blueprint, current_app

import re
import os
from flask.json.provider import DefaultJSONProvider
from datetime import datetime, time, timedelta, timezone
import jwt
from functools import wraps


auth_bp = Blueprint('auth', __name__, url_prefix='/login')

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

def generateAcessToken(id: int, role: str) -> str:
    payload = {
        'sub': id,
        'role': role,
        'iat': datetime.now(timezone.utc),
        'exp': datetime.now(timezone.utc) + timedelta(minutes=current_app.config['ACCESS_TOKEN_EXPIRES_MINUTES']),
    }

    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm=current_app.config['JWT_ALGORITHM'])

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
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=[current_app.config['JWT_ALGORITHM']])
            request.user = {'id': data.get('sub'), 'role': data.get('role')}
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401
        return f(*args, **kwargs)
    return decorated

@auth_bp.route('/register', methods=['POST'])
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

@auth_bp.route('/usuarios', methods=['GET'])
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

@auth_bp.route("/login", methods=["POST"])
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

@auth_bp.route('/DashbordEvent', methods=['GET'])
@token_required
def protected_admin():
		user = getattr(request, 'user', None)
		if not user or user.get('role') != 'admin':
				return jsonify({'message': 'Acesso negado: admin required'}), 403
		return jsonify({'message': f"Bem-vindo, admin {user.get('id')}"})


@auth_bp.route('/logout', methods=['POST'])
def logout():
		resp = make_response(jsonify({'message': 'Desconectado'}))
		resp.set_cookie('access_token', '', expires=0)
		return resp
