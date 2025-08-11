<?php 

    $dbHost = "localhost";
    $dbUser = "root";
    $dbPass = "";
    $dbName = "login-usuarios";

    $connect = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

    if ($connect->connect_errno){
        echo "Erro ao conectar";
    }
    else {
        echo "Conectado com sucesso";
    }
?>