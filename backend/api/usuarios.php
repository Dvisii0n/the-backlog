<?php

include './../consultas/consultasUsuarios.php';
include './../auth.php';
include './../db/conexion.php';


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$metodo = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true);
$headers = getallheaders();


$key = $_ENV['JWT_SECRET'];
$auth = new Auth($conn, $key, $headers);
$MYSQLI_ENTRADA_DUPLICADA = 1062;


try {

    switch ($metodo) {
        case 'GET':
            $auth->protegerRuta();
            if (isset($_GET['id'])) {
                $datos = get_usuario($conn, $_GET['id']);
            } else {
                $datos = get_usuarios($conn);
            }
            echo json_encode($datos);
            break;
        case 'POST':
            try {

                registrar_usuario($conn, $body);
                echo json_encode(['msg' => 'Usuario registrado', 'codigo' => 'EXITO']);

            } catch (mysqli_sql_exception $mysqli_err) {
                if ($mysqli_err->getCode() == $MYSQLI_ENTRADA_DUPLICADA) {
                    echo json_encode(['msg' => 'El usuario ya existe']);
                }

            }
            break;
        case 'PUT':
            $auth->protegerRuta();
            if (isset($_GET['id'])) {
                actualizar_usuario($conn, $_GET['id'], $body);
                echo json_encode(['msg' => 'Usuario actualizado']);
            }
            break;
        case 'DELETE':
            $auth->protegerRuta();
            if (isset($_GET['id'])) {
                borrar_usuario($conn, $_GET['id']);
                echo json_encode(['msg' => 'Usuario borrado']);
            }
            break;
        default:
            echo json_encode(['msg' => 'Metodo de peticion invalido']);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['msg' => 'Error en el servidor']);
    throw $e;
}