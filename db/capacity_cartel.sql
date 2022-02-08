-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-02-2022 a las 20:04:10
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
-- Estructura de tabla para la tabla `capacity_cartel`
--

CREATE TABLE `capacity_cartel` (
  `id` int(15) NOT NULL,
  `sensorId` int(15) NOT NULL,
  `name` varchar(125) NOT NULL,
  `description` varchar(250) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `authToken` varchar(250) NOT NULL,
  `provider` varchar(125) NOT NULL,
  `userId` int(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `capacity_cartel`
--

INSERT INTO `capacity_cartel` (`id`, `sensorId`, `name`, `description`, `latitude`, `longitude`, `authToken`, `provider`, `userId`) VALUES
(1, 15, 'c1', 'd1', 1, 1, 'a1', 'p1', 68),
(2, 16, 'n2', 'd2', 2, 2, 'a2', 'p2', 68),
(3, 17, 'n3', 'd3', 3, 3, 'a3', 'p3', 68),
(4, 18, 'n4', 'd4', 4, 4, 'a4', 'p4', 68),
(5, 19, 'n5', 'd5', 5, 5, 'a5', 'p5', 68);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `capacity_cartel`
--
ALTER TABLE `capacity_cartel`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `capacity_cartel`
--
ALTER TABLE `capacity_cartel`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
