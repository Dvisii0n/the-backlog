<?php

use Firebase\JWT\Key;
use Firebase\JWT\JWT;

class Auth
{
    private $key;
    private $token;
    private $conn;
    function __construct($conn, $key, $headers)
    {
        $this->key = $key;
        $this->token = $this->getTokenFromHeader($headers);
        $this->conn = $conn;
    }

    private function getTokenFromHeader($headers)
    {
        $authHeader = $headers['Authorization'];
        $strArr = explode(" ", $authHeader);
        return $strArr[1];
    }

    public function verificarJWT(string $key)
    {
        if ($this->token === null) {
            return false;
        }

        $headers = new stdClass();
        $decodificado = JWT::decode($this->token, new Key($key, 'HS256'), $headers);
        $decodificado_arr = (array) $decodificado;

        $stmt = $this->conn->prepare('SELECT * FROM usuarios WHERE nombre = ?');
        $stmt->bind_param('s', $decodificado_arr['nombre']);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $usuario = $resultado->fetch_assoc();


        if ($usuario === null) {
            http_response_code(403);
            return false;
        }

        return true;
    }


    public function protegerRuta()
    {
        $usuarioAutenticado = $this->verificarJWT($this->key);
        if (!$usuarioAutenticado) {
            http_response_code(403);
            echo json_encode(['msg' => 'Usuario no autenticado']);
            exit();
        }
    }
}

