<?php

function get_juegos($conn, $id_propietario)
{
    $stmt = $conn->prepare('SELECT * FROM juegos WHERE id_propietario=?');
    $stmt->bind_param('i', $id_propietario);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $datos = $resultado->fetch_all(MYSQLI_ASSOC);
    return $datos;
}

function get_juego($conn, $id)
{
    $stmt = $conn->prepare('SELECT * FROM juegos WHERE id=?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $datos = $resultado->fetch_assoc();
    return $datos;
}


function crear_juego($conn, $datos_juego, $id_propietario)
{
    $stmt = $conn->prepare('INSERT INTO juegos (nombre, genero, estado, portada_url, hrs_finalizacion, fecha_lanzamiento, clasificacion, steam_url, calificacion_igdb, calificacion_personal, id_propietario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('ssssdsssiii', $datos_juego['nombre'], $datos_juego['genero'], $datos_juego['estado'], $datos_juego['portada_url'], $datos_juego['hrs_finalizacion'], $datos_juego['fecha_lanzamiento'], $datos_juego['clasificacion'], $datos_juego['steam_url'], $datos_juego['calificacion_igdb'], $datos_juego['calificacion_personal'], $id_propietario);
    $stmt->execute();
    $conn->commit();
    return;
}

function actualizar_juego($conn, $id_juego, $datos_juego)
{
    $stmt = $conn->prepare('UPDATE juegos SET nombre=?, genero=?, estado=?, portada_url=?, hrs_finalizacion=?, fecha_lanzamiento=?, clasificacion=?, steam_url=?, calificacion_igdb=?, calificacion_personal=? WHERE id=?');
    $stmt->bind_param('ssssdsssiii', $datos_juego['nombre'], $datos_juego['genero'], $datos_juego['estado'], $datos_juego['portada_url'], $datos_juego['hrs_finalizacion'], $datos_juego['fecha_lanzamiento'], $datos_juego['clasificacion'], $datos_juego['steam_url'], $datos_juego['calificacion_igdb'], $datos_juego['calificacion_personal'], $id_juego);
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

