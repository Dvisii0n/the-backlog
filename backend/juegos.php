<?php

include 'db/conexion.php';
header("Content-Type: application/json");

$metodo = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true);

function get_juego($conn, $id)
{
    $stmt = $conn->prepare('SELECT * FROM juegos WHERE id=?');
    $stmt->bind_param('i', $_GET['id']);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $datos = $resultado->fetch_assoc();
    return $datos;
}

function get_juegos($conn)
{
    $resultado = $conn->query('SELECT * FROM juegos');
    $datos = $resultado->fetch_all(MYSQLI_ASSOC);
    return $datos;
}

function crear_juego($conn, $datos_juego)
{
    $stmt = $conn->prepare('INSERT INTO juegos (nombre, genero, estado, portada_url, hrs_finalizacion, fecha_lanzamiento, clasificacion, steam_url, calificacion_igdb, calificacion_personal, id_propietario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('ssssdsssiii', $datos_juego['nombre'], $datos_juego['genero'], $datos_juego['estado'], $datos_juego['portada_url'], $datos_juego['hrs_finalizacion'], $datos_juego['fecha_lanzamiento'], $datos_juego['clasificacion'], $datos_juego['steam_url'], $datos_juego['calificacion_igdb'], $datos_juego['calificacion_personal'], $datos_juego['id_propietario']);
    $stmt->execute();
    $conn->commit();
    return;
}

function actualizar_juego($conn, $id_juego, $datos_juego)
{
    $stmt = $conn->prepare('UPDATE juegos SET nombre=?, genero=?, estado=?, portada_url=?, hrs_finalizacion=?, fecha_lanzamiento=?, clasificacion=?, steam_url=?, calificacion_igdb=?, calificacion_personal=? WHERE id_propietario=? AND id=?');
    $stmt->bind_param('ssssdsssiiii', $datos_juego['nombre'], $datos_juego['genero'], $datos_juego['estado'], $datos_juego['portada_url'], $datos_juego['hrs_finalizacion'], $datos_juego['fecha_lanzamiento'], $datos_juego['clasificacion'], $datos_juego['steam_url'], $datos_juego['calificacion_igdb'], $datos_juego['calificacion_personal'], $datos_juego['id_propietario'], $id_juego);
    $stmt->execute();
    $conn->commit();
    return;
}

function borrar_juego($conn, $id_juego)
{
    $stmt = $conn->prepare('DELETE FROM juegos WHERE id=?');
    $stmt->bind_param('i', $id_juego);
    $stmt->execute();
    $conn->commit();
    return;
}

switch ($metodo) {
    case 'GET':
        if (isset($_GET['id'])) {
            $datos = get_juego($conn, $_GET['id']);
            echo json_encode($datos);

        } else {
            $datos = get_juegos($conn);
            echo json_encode($datos);
        }
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
