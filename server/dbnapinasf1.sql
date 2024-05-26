-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 26, 2024 at 11:46 AM
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
-- Table structure for table `tblappointment`
--

CREATE TABLE `tblappointment` (
  `appointment_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblappointment`
--

INSERT INTO `tblappointment` (`appointment_id`, `patient_id`, `doctor_id`, `schedule_id`) VALUES
(34, 23, 25, 20),
(35, 23, 25, 32);

-- --------------------------------------------------------

--
-- Table structure for table `tblappointmentrequest`
--

CREATE TABLE `tblappointmentrequest` (
  `request_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbldoctor`
--

CREATE TABLE `tbldoctor` (
  `doctor_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `specialization` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbldoctor`
--

INSERT INTO `tbldoctor` (`doctor_id`, `account_id`, `specialization`) VALUES
(25, 2, ' Pediatrics'),
(26, 21, ' Pediatrics');

-- --------------------------------------------------------

--
-- Table structure for table `tblschedule`
--

CREATE TABLE `tblschedule` (
  `schedule_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `is_available` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblschedule`
--

INSERT INTO `tblschedule` (`schedule_id`, `doctor_id`, `date`, `is_available`) VALUES
(7, 26, '2024-04-27', 1),
(20, 25, '2024-05-30', 0),
(23, 25, '2024-04-30', 0),
(28, 25, '2024-05-29', 0),
(29, 25, '2024-05-27', 1),
(30, 25, '2024-04-12', 1),
(31, 25, '2024-05-30', 1),
(32, 25, '2024-05-12', 0),
(33, 25, '2024-05-23', 1),
(34, 25, '2024-05-21', 0),
(35, 25, '2024-05-06', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblupgraderequest`
--

CREATE TABLE `tblupgraderequest` (
  `request_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `specialization` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(2, 3, 'joshuanapinas@gmail.com', 'Osh19', '$2y$10$IK7rk/fwDXTbsLy8.on8b.oXTUZMMnXiQtfljFScNwQS0xMliLeK6', 1),
(3, 4, 'aiman@gmail.com', 'aiman123', '$2y$10$6SC8HMVJySuNYhqUtYXAl.5OdWeLhk/eQNsayFsM0OGW59L/kwzEW', 0),
(4, 5, 'fria@gmail.com', 'priyami', '$2y$10$5PYGTcn75o43OZV0Hz3q0OQD5HUOparvGFqWnVbnsyn571Hm24l5i', 0),
(5, 6, 'theanapinas@gmail.com', 'Yangyang', '$2y$10$9JYmPnnD1K/YfJ/ti6RBWeHaM5WWCKXPiFojDS6XJRnEBjvSfyhzy', 0),
(11, 12, 'tedted@gmail.com', 'tedted', '$2y$10$BgT9z7/LUCbNqpm4FtnkvuXdso8yXYcWDkE7Mv56EeyIF8qc.pVHK', 0),
(15, 17, 'test@gmail.com', 'Test', '$2y$10$aaS/Jg0morV7ejBaAJPWU.1vX7TPJ6L0fmiyKsLOTaUTQya9nVPRe', 0),
(16, 18, 'dean@gmail.com', 'Deanz', '$2y$10$SoW6a5fp/TEAE368GVPbtOBpBxzarCqvWc3Kt49g/0xA4fi85tbgS', 0),
(17, 19, 'ryan@gmail.com', 'Darkry', '$2y$10$8cwDZlxqSkAIrtAnyUvwp.6YExuWG0vUKvNxv/eE9w3wqVXWgZKlC', 0),
(18, 20, 'abigil@gmail.com', 'gilgil', '$2y$10$fj5yjfw8fA9oT57wg62xj.CBhlWKb/MX32YA9oZOCisMOBhJymYt.', 0),
(19, 21, 'osh@gmail.com', 'Oshh19', '$2y$10$w/vNLxRRfqDNnLeQ5WZ2A.JR1f4AWPNOe/wvDzTSF.5BH4CWT4URi', 0),
(20, 22, 'admin@gmail.com', 'admin', '$2y$10$uOwDEZdq0B9OA0xELVEQoe/mz5ZRNy4mNfwtEhkFj80L6I7JQH2ja', 2),
(21, 23, 'test3@gmail.com', 'test3', '$2y$10$Ytbr2ZuV/7j2itVj2KNO2eKqjOTNh2895rAUp8Q7F3j5WKstYCTQW', 1),
(22, 24, 'john@gmail.com', 'janjan', '$2y$10$SbA5C5JPUkW1aYjj.fMRI.Gre7DpJetdwTDnrZdG37ZqOryUxmRS6', 0),
(23, 25, 'test2@gmail.com', 'test2', '$2y$10$SM0.ZMccCg.1GIjQxHwfpemcCzB79SQ7SB7Gq/uGcAL0s3njA2Mvu', 0),
(24, 26, 'cha@gmail.com', 'cha', '$2y$10$9rC4JaoNmsuaeVwvb.zKaOUY7xxbJk8rWQiszQJI31zGa.hDrOzDa', 0),
(25, 27, 'e@gmail.com', 'e', '$2y$10$7gHf9mqarKEpdgY9Oqhv/eKEiIzsRtsU57OQlM0REdH2JS8Uv66zG', 0);

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
(19, 'John', 'Ryan', 'Male', '2024-03-17'),
(20, 'Abegaeil', 'Navarrete', 'Female', '2024-04-13'),
(21, 'Osh', 'Kosh', 'Male', '2024-04-13'),
(22, 'admin', 'admin', 'Male', '2003-10-19'),
(23, 'Test', 'Test', 'Male', '2024-04-13'),
(24, 'John', 'Doe', 'Male', '2024-04-18'),
(25, 'test2', 'test2', 'Male', '2024-05-01'),
(26, 'Charish', 'Libre', 'Female', '2003-11-14'),
(27, 'Eira', 'Nuez', 'Female', '2024-10-14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tblappointment`
--
ALTER TABLE `tblappointment`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `schedule_id` (`schedule_id`);

--
-- Indexes for table `tblappointmentrequest`
--
ALTER TABLE `tblappointmentrequest`
  ADD PRIMARY KEY (`request_id`);

--
-- Indexes for table `tbldoctor`
--
ALTER TABLE `tbldoctor`
  ADD PRIMARY KEY (`doctor_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `tblschedule`
--
ALTER TABLE `tblschedule`
  ADD PRIMARY KEY (`schedule_id`);

--
-- Indexes for table `tblupgraderequest`
--
ALTER TABLE `tblupgraderequest`
  ADD PRIMARY KEY (`request_id`);

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
-- AUTO_INCREMENT for table `tblappointment`
--
ALTER TABLE `tblappointment`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `tblappointmentrequest`
--
ALTER TABLE `tblappointmentrequest`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `tbldoctor`
--
ALTER TABLE `tbldoctor`
  MODIFY `doctor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `tblschedule`
--
ALTER TABLE `tblschedule`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `tblupgraderequest`
--
ALTER TABLE `tblupgraderequest`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tbluseraccount`
--
ALTER TABLE `tbluseraccount`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `tbluserprofile`
--
ALTER TABLE `tbluserprofile`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tblappointment`
--
ALTER TABLE `tblappointment`
  ADD CONSTRAINT `tblappointment_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `tblschedule` (`schedule_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbldoctor`
--
ALTER TABLE `tbldoctor`
  ADD CONSTRAINT `tbldoctor_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `tbluseraccount` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbluseraccount`
--
ALTER TABLE `tbluseraccount`
  ADD CONSTRAINT `tbluseraccount_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbluserprofile` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
