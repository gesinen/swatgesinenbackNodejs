-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-02-2022 a las 20:04:33
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
-- Estructura de tabla para la tabla `capacity_devices`
--

CREATE TABLE `capacity_devices` (
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
-- Volcado de datos para la tabla `capacity_devices`
--

INSERT INTO `capacity_devices` (`id`, `sensorId`, `name`, `description`, `latitude`, `longitude`, `authToken`, `provider`, `userId`) VALUES
(1, 1, 'n1', 'd1', 1, 1, 'a2', 'p2', 68),
(2, 2, 'n2', 'd2', 2, 2, 'a2', 'p2', 68),
(3, 3, 'n3', 'd3', 3, 3, 'a3', 'p3', 68),
(4, 4, 'n4', 'd4', 4, 4, 'a4', 'p4', 68),
(5, 5, 'n5', 'd5', 5, 5, 'a5', 'p5', 68);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `capacity_devices`
--
ALTER TABLE `capacity_devices`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `capacity_devices`
--
ALTER TABLE `capacity_devices`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
