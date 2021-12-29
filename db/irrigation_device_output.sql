-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-12-2021 a las 15:28:23
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
-- Estructura de tabla para la tabla `irrigation_device_output`
--

CREATE TABLE `irrigation_device_output` (
  `id` int(16) NOT NULL,
  `irrigationDeviceId` int(16) NOT NULL,
  `sensorId` int(16) NOT NULL,
  `sensorIndex` int(16) NOT NULL,
  `intervals` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `irrigation_device_output`
--

INSERT INTO `irrigation_device_output` (`id`, `irrigationDeviceId`, `sensorId`, `sensorIndex`, `intervals`, `status`) VALUES
(1, 1, 256, 1, '[12:00-15:30]', 1),
(2, 9, 769, 2, '[13:00-14:30]', 1),
(3, 1, 256, 2, '[11:00-13:00]', 1),
(4, 9, 769, 1, '[16:00-18:45]', 0),
(7, 1, 256, 1, 'a', 1),
(8, 1, 256, 999, '[19:00-21:45]', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `irrigation_device_output`
--
ALTER TABLE `irrigation_device_output`
  ADD PRIMARY KEY (`id`),
  ADD KEY `irregation_device_output_irregation_device_id_fk` (`irrigationDeviceId`),
  ADD KEY `irregation_device_output_sensor_id_fk` (`sensorId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `irrigation_device_output`
--
ALTER TABLE `irrigation_device_output`
  MODIFY `id` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `irrigation_device_output`
--
ALTER TABLE `irrigation_device_output`
  ADD CONSTRAINT `irregation_device_output_irregation_device_id_fk` FOREIGN KEY (`irrigationDeviceId`) REFERENCES `irrigation_device` (`id`),
  ADD CONSTRAINT `irregation_device_output_sensor_id_fk` FOREIGN KEY (`sensorId`) REFERENCES `sensor_info` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
