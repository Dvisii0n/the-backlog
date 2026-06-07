<?php


include './../auth.php';
include './../dotenvLoader.php';
include './../db/conexion.php';
include './../igdbRequests.php';

$origin = $_SERVER['HTTP_ORIGIN'];
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Content-Type: application/json");


$metodo = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true);
$headers = getallheaders();

$key = $_ENV['JWT_SECRET'];

$auth = new Auth($conn, $key, $headers);


$igdb_req = new IGDBRequests($_ENV['IGDB_CLIENT_ID'], $_ENV['IGDB_ACCESS_TOKEN']);


try {
    switch ($metodo) {
        case 'GET':
            $auth->protegerRuta();
            if (isset($_GET['nombre'])) {
                $juegos = $igdb_req->getJuegos($_GET['nombre']);


                echo json_encode(['juegos' => $juegos]);

            } elseif (isset($_GET['id'])) {
                $tiempo_fin = $igdb_req->getTiemposFinalizacion($_GET['id']);
                $tiempo_hrs = round($tiempo_fin[0]['normally'] / 3600, 2) . 'h';

                echo json_encode(['tiempo' => $tiempo_hrs]);


            } else {
                echo json_encode(['msg' => 'Juego no especificado']);
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