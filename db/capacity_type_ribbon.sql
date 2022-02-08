-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-02-2022 a las 20:04:53
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
-- Estructura de tabla para la tabla `capacity_type_ribbon`
--

CREATE TABLE `capacity_type_ribbon` (
  `id` int(15) NOT NULL,
  `capacityDeviceId` int(15) NOT NULL,
  `parkingId` int(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `capacity_type_ribbon`
--

INSERT INTO `capacity_type_ribbon` (`id`, `capacityDeviceId`, `parkingId`) VALUES
(1, 5, 1),
(2, 1, 2),
(3, 2, 3),
(4, 3, 4),
(5, 4, 5);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `capacity_type_ribbon`
--
ALTER TABLE `capacity_type_ribbon`
  ADD PRIMARY KEY (`id`),
  ADD KEY `capacityDeviceIdFkFromRibbon` (`capacityDeviceId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `capacity_type_ribbon`
--
ALTER TABLE `capacity_type_ribbon`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `capacity_type_ribbon`
--
ALTER TABLE `capacity_type_ribbon`
  ADD CONSTRAINT `capacityDeviceIdFkFromRibbon` FOREIGN KEY (`capacityDeviceId`) REFERENCES `capacity_devices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
