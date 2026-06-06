<?php


include './../consultas/consultasJuegos.php';
include './../auth.php';
include './../db/conexion.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$metodo = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true);
$headers = getallheaders();

$key = $_ENV['JWT_SECRET'];

$auth = new Auth($conn, $key, $headers);
$usuarioAutenticado = $auth->verificarJWT($key);

if (!$usuarioAutenticado) {
    http_response_code(403);
    echo json_encode(['msg' => 'Usuario no autenticado']);
    exit();
}

switch ($metodo) {
    case 'GET':
        if (isset($_GET['id'])) {
            $datos = get_juego($conn, $_GET['id']);

        } else {
            $datos = get_juegos($conn);
        }
        echo json_encode($datos);
        break;

    case 'POST':
        crear_juego($conn, $body);
        echo json_encode(["msg" => 'Juego creado']);
        break;

    case 'PUT':
        if (isset($_GET['id'])) {
            actualizar_juego($conn, $_GET['id'], $body);
            echo json_encode(["msg" => 'Datos de juego actualizados']);
        }
        break;
    case 'DELETE':
        if (isset($_GET['id'])) {
            borrar_juego($conn, $_GET['id']);
            echo json_encode(['msg' => 'Juego borrado']);
        }
        break;

    default:
        echo json_encode(['msg' => 'Metodo de peticion invalido']);
        break;
}