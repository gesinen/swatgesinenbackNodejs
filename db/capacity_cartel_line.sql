-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-02-2022 a las 20:04:21
-- Versión del servidor: 10.4.20-MariaDB
-- Versión de PHP: 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `swat_gesinen`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `capacity_cartel_line`
--

CREATE TABLE `capacity_cartel_line` (
  `id` int(15) NOT NULL,
  `cartelId` int(15) NOT NULL,
  `parkingId` int(15) DEFAULT NULL,
  `lineNum` int(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `capacity_cartel_line`
--

INSERT INTO `capacity_cartel_line` (`id`, `cartelId`, `parkingId`, `lineNum`) VALUES
(1, 1, NULL, 1),
(2, 1, NULL, 2),
(3, 1, NULL, 3),
(4, 2, 2, 1),
(5, 2, 3, 2),
(6, 2, 4, 3),
(7, 3, NULL, 1),
(8, 3, 3, 2),
(9, 3, 2, 3),
(10, 4, NULL, 1),
(11, 4, NULL, 2),
(12, 4, 2, 3),
(13, 5, 1, 1),
(14, 5, NULL, 2),
(15, 5, NULL, 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `capacity_cartel_line`
--
ALTER TABLE `capacity_cartel_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cartelIdFkFromCartelLine` (`cartelId`),
  ADD KEY `parkingIdFkFromCartelLine` (`parkingId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `capacity_cartel_line`
--
ALTER TABLE `capacity_cartel_line`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `capacity_cartel_line`
--
ALTER TABLE `capacity_cartel_line`
  ADD CONSTRAINT `cartelIdFkFromCartelLine` FOREIGN KEY (`cartelId`) REFERENCES `capacity_cartel` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `parkingIdFkFromCartelLine` FOREIGN KEY (`parkingId`) REFERENCES `capacity_parking` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
