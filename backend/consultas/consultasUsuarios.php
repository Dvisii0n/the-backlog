<?php

function get_usuarios($conn)
{
    $resultado = $conn->query('SELECT * FROM usuarios');
    $datos = $resultado->fetch_all(MYSQLI_ASSOC);
    return $datos;
}

function get_usuario($conn, $id)
{
    $stmt = $conn->prepare('SELECT * FROM usuarios WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $datos = $resultado->fetch_assoc();
    return $datos;
}


function get_usuario_por_nombre($conn, $nombre)
{
    $stmt = $conn->prepare('SELECT * FROM usuarios WHERE nombre = ?');
    $stmt->bind_param('s', $nombre);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $datos = $resultado->fetch_assoc();
    return $datos;
}



function registrar_usuario($conn, $datos_usuario)
{
    $password_texto = $datos_usuario['password'];
    $hash = password_hash($password_texto, PASSWORD_BCRYPT);
    $stmt = $conn->prepare('INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)');
    $stmt->bind_param('sss', $datos_usuario['nombre'], $datos_usuario['correo'], $hash);
    $stmt->execute();
    $conn->commit();
}

function actualizar_usuario($conn, $id, $datos_usuario)
{
    $stmt = $conn->prepare('UPDATE usuarios SET nombre=?, correo=? WHERE id=?');
    $stmt->bind_param('ssi', $datos_usuario['nombre'], $datos_usuario['correo'], $id);
    $stmt->execute();
    $conn->commit();
}

function borrar_usuario($conn, $id)
{
    $stmt = $conn->prepare('DELETE FROM usuarios WHERE id=?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $conn->commit();
}
