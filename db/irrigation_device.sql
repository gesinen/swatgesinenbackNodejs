-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-12-2021 a las 15:28:10
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
-- Estructura de tabla para la tabla `irrigation_device`
--

CREATE TABLE `irrigation_device` (
  `id` int(16) NOT NULL,
  `description` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `nameSentilo` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `status` tinyint(1) NOT NULL,
  `deviceTypeId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `irrigation_device`
--

INSERT INTO `irrigation_device` (`id`, `description`, `name`, `nameSentilo`, `userId`, `latitude`, `longitude`, `status`, `deviceTypeId`) VALUES
(1, 'a', 'a', 'a', 63, 12.3, 5.7, 1, 1),
(8, 'deviceEUIPUT', 'namePUT', 'nameSentiloPUT', 63, 26.7, 1.35, 1, 1),
(9, 'deviceEUIPOST', 'namePOST', 'nameSentiloPOST', 63, 26.7, 1.35, 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `irrigation_device`
--
ALTER TABLE `irrigation_device`
  ADD PRIMARY KEY (`id`),
  ADD KEY `irregation_device_user_id_fk` (`userId`),
  ADD KEY `irregation_device_device_type_id_fk` (`deviceTypeId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `irrigation_device`
--
ALTER TABLE `irrigation_device`
  MODIFY `id` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `irrigation_device`
--
ALTER TABLE `irrigation_device`
  ADD CONSTRAINT `irregation_device_device_type_id_fk` FOREIGN KEY (`deviceTypeId`) REFERENCES `irrigation_device_type` (`id`),
  ADD CONSTRAINT `irregation_device_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
