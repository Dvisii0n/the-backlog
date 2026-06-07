<?php

include '../dotenvLoader.php';
$conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], $_ENV['DB_NAME']);

if ($conn->connect_error) {
    die('Conexion fallida: ' . $conn->connect_error);
}