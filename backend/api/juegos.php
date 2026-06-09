<?php


include './../consultas/consultasJuegos.php';
include './../auth.php';

include '../dotenvLoader.php';
include './../db/conexion.php';

$origin = $_SERVER['HTTP_ORIGIN'];
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");



$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$body = json_decode(file_get_contents('php://input'), true);
$headers = getallheaders();

$key = $_ENV['JWT_SECRET'];

$auth = new Auth($conn, $key, $headers);


try {
    switch ($metodo) {
        case 'GET':
            $auth->protegerRuta();
            $usuario = $auth->getDatosJWT($key);
            if (isset($_GET['id'])) {
                $datos = get_juego($conn, $_GET['id']);

            } else {
                $datos = get_juegos($conn, $usuario['id']);
            }
            echo json_encode(['msg' => 'Juegos del usuario encontrados', 'juegos' => $datos, 'codigo' => 'EXITO']);
            break;

        case 'POST':
            $auth->protegerRuta();
            $usuario = $auth->getDatosJWT($key);
            try {
                crear_juego($conn, $body, $usuario['id']);
                echo json_encode(["msg" => 'Juego creado', "codigo" => "EXITO"]);
            } catch (mysqli_sql_exception $mysqli_err) {
                echo json_encode((['msg' => 'Error de MySQL', 'codigo' => "MYSQL_ERR"]));
            }
            break;

        case 'PUT':
            $auth->protegerRuta();
            if (isset($_GET['id'])) {
                actualizar_juego($conn, $_GET['id'], $body);
                echo json_encode(["msg" => 'Datos de juego actualizados', 'codigo' => 'EXITO']);
            }
            break;
        case 'DELETE':
            $auth->protegerRuta();
            if (isset($_GET['id'])) {
                borrar_juego($conn, $_GET['id']);
                echo json_encode(['msg' => 'Juego borrado', 'codigo' => 'EXITO']);
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