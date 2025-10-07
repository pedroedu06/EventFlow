import mysql.connector
from mysql.connector import Error

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="EventFlow"
)

if mydb.is_connected():
    print("conectado com sucesso")
else: 
    print("erro ao conectar")


mydb.close()
