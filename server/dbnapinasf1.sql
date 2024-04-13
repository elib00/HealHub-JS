-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 04, 2024 at 02:47 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbnapinasf1`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbluseraccount`
--

CREATE TABLE `tbluseraccount` (
  `account_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `user_type` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbluseraccount`
--

INSERT INTO `tbluseraccount` (`account_id`, `user_id`, `email`, `username`, `password`, `user_type`) VALUES
(2, 3, 'joshuanapinas@gmail.com', 'Osh19', '$2y$10$IK7rk/fwDXTbsLy8.on8b.oXTUZMMnXiQtfljFScNwQS0xMliLeK6', 0),
(3, 4, 'aiman@gmail.com', 'aiman123', '$2y$10$6SC8HMVJySuNYhqUtYXAl.5OdWeLhk/eQNsayFsM0OGW59L/kwzEW', 0),
(4, 5, 'fria@gmail.com', 'priyami', '$2y$10$5PYGTcn75o43OZV0Hz3q0OQD5HUOparvGFqWnVbnsyn571Hm24l5i', 0),
(5, 6, 'theanapinas@gmail.com', 'Yangyang', '$2y$10$9JYmPnnD1K/YfJ/ti6RBWeHaM5WWCKXPiFojDS6XJRnEBjvSfyhzy', 0),
(11, 12, 'tedted@gmail.com', 'tedted', '$2y$10$BgT9z7/LUCbNqpm4FtnkvuXdso8yXYcWDkE7Mv56EeyIF8qc.pVHK', 0),
(15, 17, 'test@gmail.com', 'Test', '$2y$10$aaS/Jg0morV7ejBaAJPWU.1vX7TPJ6L0fmiyKsLOTaUTQya9nVPRe', 0),
(16, 18, 'dean@gmail.com', 'Deanz', '$2y$10$SoW6a5fp/TEAE368GVPbtOBpBxzarCqvWc3Kt49g/0xA4fi85tbgS', 0),
(17, 19, 'ryan@gmail.com', 'Darkry', '$2y$10$8cwDZlxqSkAIrtAnyUvwp.6YExuWG0vUKvNxv/eE9w3wqVXWgZKlC', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbluserprofile`
--

CREATE TABLE `tbluserprofile` (
  `user_id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `gender` varchar(100) NOT NULL,
  `birthdate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbluserprofile`
--

INSERT INTO `tbluserprofile` (`user_id`, `firstname`, `lastname`, `gender`, `birthdate`) VALUES
(3, 'Joshua', 'Napinas', 'Male', '2003-10-19'),
(4, 'Aiman', 'Almagro', 'Male', '2005-01-05'),
(5, 'Fria Mae', 'Gwapa', 'Female', '2004-04-15'),
(6, 'Thea', 'Napinas', 'Female', '2010-07-21'),
(12, 'Zhazted', 'Valles', 'Male', '2024-03-17'),
(17, 'Test', 'Test', 'Male', '2014-08-17'),
(18, 'Dean', 'Clyde', 'Male', '2024-03-17'),
(19, 'John', 'Ryan', 'Male', '2024-03-17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbluseraccount`
--
ALTER TABLE `tbluseraccount`
  ADD PRIMARY KEY (`account_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tbluserprofile`
--
ALTER TABLE `tbluserprofile`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbluseraccount`
--
ALTER TABLE `tbluseraccount`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tbluserprofile`
--
ALTER TABLE `tbluserprofile`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbluseraccount`
--
ALTER TABLE `tbluseraccount`
  ADD CONSTRAINT `tbluseraccount_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbluserprofile` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
