-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-12-2021 a las 15:28:19
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
-- Estructura de tabla para la tabla `irrigation_device_input`
--

CREATE TABLE `irrigation_device_input` (
  `id` int(16) NOT NULL,
  `irrigationDeviceId` int(16) NOT NULL,
  `sensorId` int(16) NOT NULL,
  `lastHumidity` varchar(255) NOT NULL,
  `lastTemperature` varchar(255) NOT NULL,
  `sensorIndex` int(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `irrigation_device_input`
--

INSERT INTO `irrigation_device_input` (`id`, `irrigationDeviceId`, `sensorId`, `lastHumidity`, `lastTemperature`, `sensorIndex`) VALUES
(1, 1, 256, '14.3', '1.5', 666);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `irrigation_device_input`
--
ALTER TABLE `irrigation_device_input`
  ADD PRIMARY KEY (`id`),
  ADD KEY `irregation_device_input_irregation_device_id_fk` (`irrigationDeviceId`),
  ADD KEY `irregation_device_input_sensor_id_fk` (`sensorId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `irrigation_device_input`
--
ALTER TABLE `irrigation_device_input`
  MODIFY `id` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `irrigation_device_input`
--
ALTER TABLE `irrigation_device_input`
  ADD CONSTRAINT `irregation_device_input_irregation_device_id_fk` FOREIGN KEY (`irrigationDeviceId`) REFERENCES `irrigation_device` (`id`),
  ADD CONSTRAINT `irregation_device_input_sensor_id_fk` FOREIGN KEY (`sensorId`) REFERENCES `sensor_info` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
