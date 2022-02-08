-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-02-2022 a las 20:04:47
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
-- Estructura de tabla para la tabla `capacity_ribbon_devices`
--

CREATE TABLE `capacity_ribbon_devices` (
  `id` int(11) NOT NULL,
  `device_id` int(11) NOT NULL,
  `parking_number` int(11) DEFAULT NULL,
  `parking_poster_sensor` int(11) DEFAULT NULL,
  `p1` int(11) DEFAULT NULL,
  `p2` int(11) DEFAULT NULL,
  `p3` int(11) DEFAULT NULL,
  `p1_max` int(11) DEFAULT NULL,
  `p2_max` int(11) DEFAULT NULL,
  `p3_max` int(11) DEFAULT NULL,
  `input_number` int(11) DEFAULT NULL,
  `input1_type` enum('input','output','bidirectional') DEFAULT NULL,
  `input1_sensor` int(11) DEFAULT NULL,
  `input1_parking` enum('P1','P2','P3') DEFAULT NULL,
  `input2_type` enum('input','output','bidirectional') DEFAULT NULL,
  `input2_sensor` int(11) DEFAULT NULL,
  `input2_parking` enum('P1','P2','P3') DEFAULT NULL,
  `input3_type` enum('input','output','bidirectional') DEFAULT NULL,
  `input3_sensor` int(11) DEFAULT NULL,
  `input3_parking` enum('P1','P2','P3') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `capacity_ribbon_devices`
--

INSERT INTO `capacity_ribbon_devices` (`id`, `device_id`, `parking_number`, `parking_poster_sensor`, `p1`, `p2`, `p3`, `p1_max`, `p2_max`, `p3_max`, `input_number`, `input1_type`, `input1_sensor`, `input1_parking`, `input2_type`, `input2_sensor`, `input2_parking`, `input3_type`, `input3_sensor`, `input3_parking`) VALUES
(1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 'input', 1, 'P3', 'input', 1, 'P3', 'input', 1, 'P1'),
(2, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 'input', 1, 'P3', 'input', 1, 'P3', 'input', 1, 'P1'),
(3, 2, 1, 2, 0, 0, 0, 2, 2, 2, 2, 'output', 2, 'P2', 'output', 2, 'P2', 'output', 2, 'P2');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `capacity_ribbon_devices`
--
ALTER TABLE `capacity_ribbon_devices`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `capacity_ribbon_devices`
--
ALTER TABLE `capacity_ribbon_devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
