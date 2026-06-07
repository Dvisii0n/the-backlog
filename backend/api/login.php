<?php

use Firebase\JWT\JWT;

include '../dotenvLoader.php';
include './../db/conexion.php';
include './../consultas/consultasUsuarios.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");


$metodo = $_SERVER['REQUEST_METHOD'];
$key = $_ENV['JWT_SECRET'];

if ($metodo !== 'POST') {
    http_response_code(405);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if ($data === null) {
    http_response_code(400);
    echo json_encode(['msg' => 'Datos JSON invalidos']);
    exit();
}


$usuario = get_usuario_por_nombre($conn, $data['nombre']);

if ($usuario === null) {
    http_response_code(403);
    echo json_encode(['msg' => 'Usuario no valido']);
    exit();
}

$password_hash = $usuario['password'];
$password_texto = $data['password'];
$match = password_verify($password_texto, $password_hash);

if ($match) {
    $payload = $usuario;
    $jwt = JWT::encode($payload, $key, 'HS256');
    http_response_code(200);
    echo json_encode(['msg' => 'Sesion iniciada con exito', 'codigo' => 'EXITO', 'token' => $jwt]);

} else {
    http_response_code(403);
    echo json_encode(['msg' => 'Password incorrecta']);
}



