-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 08, 2025 at 12:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pokoparty`
--

-- --------------------------------------------------------

--
-- Table structure for table `raid_boss`
--

CREATE TABLE `raid_boss` (
  `id` int(11) NOT NULL,
  `pokemon_id` int(11) NOT NULL,
  `boss_name` varchar(200) NOT NULL,
  `boss_tier` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `raid_boss`
--

INSERT INTO `raid_boss` (`id`, `pokemon_id`, `boss_name`, `boss_tier`, `start_date`, `end_date`) VALUES
(1, 6, 'Charizard', 5, '2025-07-04', '2025-07-31'),
(2, 9, 'Blastoise', 4, '2025-07-04', '2025-07-31'),
(3, 3, 'Venusaur', 3, '2025-07-04', '2025-07-31'),
(4, 18, 'Pidgeot', 2, '2025-07-04', '2025-07-31');

-- --------------------------------------------------------

--
-- Table structure for table `raid_rooms`
--

CREATE TABLE `raid_rooms` (
  `id` int(11) NOT NULL,
  `boss_id` int(11) NOT NULL,
  `boss_name` varchar(100) NOT NULL,
  `boss_tier` int(10) DEFAULT NULL,
  `boss_img` varchar(255) DEFAULT NULL,
  `time_slot` varchar(20) NOT NULL,
  `people_count` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `status` varchar(20) DEFAULT 'open',
  `invite` enum('true','false') NOT NULL DEFAULT 'false',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `raid_rooms`
--

INSERT INTO `raid_rooms` (`id`, `boss_id`, `boss_name`, `boss_tier`, `boss_img`, `time_slot`, `people_count`, `created_by`, `status`, `invite`, `created_at`) VALUES
(47, 1, 'Charizard', 5, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', '12:50', 3, 23, 'open', 'false', '2025-07-08 00:46:37'),
(48, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '13:00', 6, 22, 'open', 'true', '2025-07-08 00:50:07'),
(49, 1, 'Charizard', 5, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', '14:10', 1, 22, 'open', 'false', '2025-07-08 01:24:55'),
(50, 2, 'Blastoise', 4, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png', '14:10', 3, 24, 'open', 'false', '2025-07-08 01:58:16'),
(51, 3, 'Venusaur', 3, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png', '15:00', 5, 22, 'open', 'false', '2025-07-08 02:57:14'),
(52, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '15:00', 5, 22, 'open', 'false', '2025-07-08 03:00:00'),
(53, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '15:10', 5, 22, 'open', 'true', '2025-07-08 03:19:10'),
(54, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '15:10', 5, 22, 'open', 'true', '2025-07-08 03:19:53'),
(55, 2, 'Blastoise', 4, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png', '15:30', 5, 22, 'open', 'true', '2025-07-08 03:22:51'),
(56, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '15:30', 1, 22, 'open', 'true', '2025-07-08 03:32:53'),
(57, 1, 'Charizard', 5, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', '15:40', 1, 22, 'open', 'true', '2025-07-08 03:38:02'),
(58, 1, 'Charizard', 5, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', '15:40', 5, 22, 'open', 'false', '2025-07-08 03:40:33'),
(59, 1, 'Charizard', 5, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', '15:40', 1, 22, 'open', 'true', '2025-07-08 03:40:37'),
(60, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '15:40', 1, 22, 'open', 'true', '2025-07-08 03:43:43'),
(61, 2, 'Blastoise', 4, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png', '15:50', 1, 22, 'open', 'false', '2025-07-08 03:45:43'),
(62, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '16:00', 1, 22, 'open', 'false', '2025-07-08 03:53:39'),
(63, 3, 'Venusaur', 3, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png', '16:10', 1, 22, 'open', 'true', '2025-07-08 04:00:27'),
(64, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '16:00', 1, 22, 'open', 'true', '2025-07-08 04:03:46'),
(65, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '16:10', 1, 24, 'open', 'true', '2025-07-08 04:06:31'),
(66, 3, 'Venusaur', 3, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png', '16:20', 2, 24, 'open', 'false', '2025-07-08 04:09:15'),
(67, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '17:00', 5, 22, 'open', 'false', '2025-07-08 04:17:33'),
(68, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '16:20', 5, 22, 'open', 'false', '2025-07-08 04:24:46'),
(69, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '17:30', 2, 22, 'open', 'false', '2025-07-08 05:03:39'),
(70, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '17:20', 1, 23, 'open', 'true', '2025-07-08 05:13:43'),
(71, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '17:30', 5, 22, 'open', 'false', '2025-07-08 05:21:37'),
(72, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '18:00', 5, 22, 'open', 'false', '2025-07-08 05:21:52'),
(73, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '17:20', 5, 23, 'open', 'false', '2025-07-08 05:32:16'),
(74, 4, 'Pidgeot', 2, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png', '17:50', 5, 23, 'open', 'false', '2025-07-08 05:32:21'),
(75, 1, 'Charizard', 5, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', '17:50', 1, 22, 'open', 'false', '2025-07-08 05:43:32');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(64) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `user_id`, `created_at`, `expires_at`) VALUES
('7b35efbf42be0868fd4209d4b68476b045574d6299747bbd5fdb1e4e337cc63e', 23, '2025-07-08 05:22:27', '0000-00-00 00:00:00'),
('9a7bdfc60e311978b2b4df44d677f20c5f4b53aeb5dd492a4ed1d3a2fa81f644', 24, '2025-07-08 01:46:43', '0000-00-00 00:00:00'),
('e7133d2d4bd41687ac89913ba8498025e86e79001c95283e409675068324be3d', 22, '2025-07-08 05:43:14', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `trainer_name` varchar(50) DEFAULT NULL,
  `friend_code` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `team` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `trainer_name`, `friend_code`, `level`, `team`, `created_at`) VALUES
(22, 'kensaohin@gmail.com', '$2y$10$hyfVq.I2/.f09qPewQrQguAMZHxK1DE0YaAn/Khaj1x5tW/VxAe1e', 'AvenderMasterTH', '393486148074', 46, 'mystic', '2025-07-08 05:43:18'),
(23, 'kenzanaqq@gmail.com', '$2y$10$xz9.S794BqqQGgj.WgzZdO/ePXk9bG4PJp2f5wOmFbVg73PXL8c0i', 'AkenzaMasterTH', '577493721629', 31, 'instinct', '2025-07-08 05:45:50'),
(24, 'test@gmail.com', '$2y$10$FvIP8y0Cc6Bb1B9EEY5cNO3yBGMyTIgOoAyX6Pbl40qWjwt1nQGsG', 'Test', '253468467879', 10, 'mystic', '2025-07-08 06:32:19');

-- --------------------------------------------------------

--
-- Table structure for table `user_raid_rooms`
--

CREATE TABLE `user_raid_rooms` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `raid_rooms_id` int(11) NOT NULL,
  `status` enum('false','true') NOT NULL DEFAULT 'false',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_raid_rooms`
--

INSERT INTO `user_raid_rooms` (`id`, `user_id`, `raid_rooms_id`, `status`, `created_at`) VALUES
(132, 24, 56, 'true', '2025-07-08 08:36:32'),
(135, 24, 57, 'true', '2025-07-08 08:38:33'),
(136, 24, 59, 'true', '2025-07-08 08:40:40'),
(137, 24, 60, 'true', '2025-07-08 08:43:48'),
(138, 24, 61, 'true', '2025-07-08 08:45:51'),
(140, 24, 62, 'true', '2025-07-08 08:55:56'),
(145, 22, 65, 'true', '2025-07-08 09:06:34'),
(149, 23, 68, 'true', '2025-07-08 09:38:01'),
(150, 23, 67, 'true', '2025-07-08 09:38:16'),
(153, 23, 75, 'true', '2025-07-08 10:43:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `raid_boss`
--
ALTER TABLE `raid_boss`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `raid_rooms`
--
ALTER TABLE `raid_rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_raid_boss` (`boss_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_raid_rooms`
--
ALTER TABLE `user_raid_rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `raid_rooms_id` (`raid_rooms_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `raid_boss`
--
ALTER TABLE `raid_boss`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `raid_rooms`
--
ALTER TABLE `raid_rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `user_raid_rooms`
--
ALTER TABLE `user_raid_rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `raid_rooms`
--
ALTER TABLE `raid_rooms`
  ADD CONSTRAINT `fk_raid_boss` FOREIGN KEY (`boss_id`) REFERENCES `raid_boss` (`id`);

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_raid_rooms`
--
ALTER TABLE `user_raid_rooms`
  ADD CONSTRAINT `user_raid_rooms_ibfk_1` FOREIGN KEY (`raid_rooms_id`) REFERENCES `raid_rooms` (`id`),
  ADD CONSTRAINT `user_raid_rooms_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
