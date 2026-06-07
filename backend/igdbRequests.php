<?php

class IGDBRequests
{

    private $igdb_url;
    private $igdb_ttb_url;
    private $clientId;
    private $igdb_access_token;

    function __construct($clientId, $igdb_access_token)
    {
        $this->igdb_url = "https://api.igdb.com/v4/games";
        $this->igdb_ttb_url = "https://api.igdb.com/v4/game_time_to_beats";
        $this->clientId = $clientId;
        $this->igdb_access_token = $igdb_access_token;

    }

    public function getJuegos($nombre)
    {

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $this->igdb_url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Client-ID: ' . $this->clientId,
                'Authorization: Bearer ' . $this->igdb_access_token
            ],
            CURLOPT_POSTFIELDS => 'search "' . "$nombre" . '";' . 'fields name, genres.name, game_modes.name, rating, first_release_date, cover.url, age_ratings.rating_category.rating, age_ratings.rating_category.organization.name, websites.url, websites.type; limit 100;'
        ]);
        $response = curl_exec($ch);
        $juegos = json_decode($response, true);


        foreach ($juegos as &$juego) {
            $juego = [
                "id" => $juego['id'],
                "nombre" => $juego['name'],
                "fecha_lanzamiento" => date('Y-m-d', $juego['first_release_date']),
                "genero" => $juego['genres'][0]['name'],
                "portada_url" => str_replace("t_thumb", "t_cover_big", $juego['cover']['url']),
                "calificacion_igdb" => number_format($juego['rating'], 0),
                "clasificacion" => $this->getESRBRating($juego),
                "steam_url" => $this->getSteamUrl($juego)
            ];
        }
        unset($juego);

        return $juegos;
    }


    public function getTiemposFinalizacion($idJuego)
    {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $this->igdb_ttb_url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Client-ID: ' . $this->clientId,
                'Authorization: Bearer ' . $this->igdb_access_token
            ],
            CURLOPT_POSTFIELDS => "fields normally; where game_id = $idJuego;"
        ]);


        $response = curl_exec($ch);
        $tiempos = json_decode($response, true);

        return $tiempos;
    }

    private function getESRBRating($juego)
    {
        $ratings = $juego['age_ratings'];
        foreach ($ratings as &$rating) {
            if ($rating['rating_category']['organization']['name'] === 'ESRB') {
                return $rating['rating_category']['rating'];
            }

        }
        unset($rating);


    }

    private function getSteamUrl($juego)
    {
        $websites = $juego['websites'];
        foreach ($websites as &$website) {
            if ($website['type'] === 13) {
                return $website['url'];
            }


        }
        unset($website);
    }
}