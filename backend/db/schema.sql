CREATE TABLE `juegos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Juego sin nombre',
  `genero` text,
  `estado` enum('COMPLETADO','POR_JUGAR') NOT NULL DEFAULT 'POR_JUGAR',
  `portada_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `hrs_finalizacion` decimal(10,2) DEFAULT NULL,
  `fecha_lanzamiento` datetime DEFAULT NULL,
  `fecha_agregado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `clasificacion` text,
  `steam_url` text,
  `id_propietario` int NOT NULL,
  `calificacion_igdb` int DEFAULT NULL,
  `calificacion_personal` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `propietario_FK` (`id_propietario`),
  CONSTRAINT `propietario_FK` FOREIGN KEY (`id_propietario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_unique` (`nombre`),
  UNIQUE KEY `correo_unique` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
