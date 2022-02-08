-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-02-2022 a las 20:04:41
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
-- Estructura de tabla para la tabla `capacity_parking`
--

CREATE TABLE `capacity_parking` (
  `id` int(15) NOT NULL,
  `name` varchar(125) NOT NULL,
  `description` varchar(250) NOT NULL,
  `currentCapacity` int(15) NOT NULL,
  `maxCapacity` int(15) NOT NULL,
  `address` varchar(250) NOT NULL,
  `userId` int(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `capacity_parking`
--

INSERT INTO `capacity_parking` (`id`, `name`, `description`, `currentCapacity`, `maxCapacity`, `address`, `userId`) VALUES
(1, 'p1', 'd1', 15, 50, '', 68),
(2, 'n2', 'd2', 25, 75, '', 68),
(3, 'n3', 'd3', 35, 80, '', 68),
(4, 'n4', 'd4', 50, 90, '', 68),
(5, 'n5', 'd5', 60, 120, '', 68);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `capacity_parking`
--
ALTER TABLE `capacity_parking`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `capacity_parking`
--
ALTER TABLE `capacity_parking`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
