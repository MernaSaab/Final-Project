-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 02, 2025 at 01:03 PM
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
-- Database: `healthylifestyle`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `user_type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `first_name`, `last_name`, `address`, `phone`, `email`, `user_type`) VALUES
(1, 'Admin', 'One', '123 Admin St', '0501234567', 'admin@example.com', 'admin'),
(2, 'Mirna', 'Client', '456 User Rd', '0509876543', 'mirna@example.com', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'ארוחות בוקר בריאות'),
(2, 'סלטים טריים'),
(3, 'שייקים טבעיים'),
(4, 'מנות דלות קלוריות'),
(5, 'מנות טבעוניות'),
(6, 'מרקים בריאים');

-- --------------------------------------------------------

--
-- Table structure for table `category_meal`
--

CREATE TABLE `category_meal` (
  `category_id` int(11) NOT NULL,
  `meal_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category_meal`
--

INSERT INTO `category_meal` (`category_id`, `meal_id`) VALUES
(1, 1),
(1, 3),
(2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meals`
--

CREATE TABLE `meals` (
  `meal_id` int(11) NOT NULL,
  `meal_name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `price` decimal(6,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `calories` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meals`
--

INSERT INTO `meals` (`meal_id`, `meal_name`, `description`, `image_url`, `price`, `quantity`, `calories`) VALUES
(1, 'שקשוקה בריאה', 'שקשוקה עם עגבניות טריות ופלפל חריף קלוי', 'image-1753739749039-774341182.jpg', 20.00, 20, 350),
(2, 'סלט קינואה', 'קינואה, ירקות טריים, גרגרי חומוס ורוטב לימון', 'image-1753739836091-711466299.jpg', 26.50, 20, 150),
(3, 'מרק עדשים כתומות', 'מרק עשיר בלב עדשים וירקות שורש', 'image-1750448936218-661436144.jpeg', 35.00, 95, 99),
(4, 'שייק ירוק', 'תרד, מלפפון, תפוח ירוק ומיץ לימון טרי', 'image-1750448965183-549597767.jpeg', 20.00, 50, 25),
(1234, 'קינוח בריא', 'תות, שיבולת שועל, דבש, חלב, בננה ופיצוחים', 'image-1750602666528-630139155.jpg', 29.00, 20, 200);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `order_date` date DEFAULT NULL,
  `status` varchar(30) DEFAULT NULL,
  `user_id` varchar(10) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(150) NOT NULL,
  `id_number` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `order_date`, `status`, `user_id`, `first_name`, `last_name`, `phone`, `email`, `id_number`, `address`) VALUES
(11, '2025-07-27', 'pending', NULL, '', '', '', '', '', ''),
(14, '2025-07-27', 'pending', NULL, '', '', '', '', '', ''),
(15, '2025-07-27', 'pending', NULL, '', '', '', '', '', ''),
(16, '2025-07-27', 'pending', NULL, '', '', '', '', '', ''),
(17, '2025-07-28', 'pending', NULL, '', '', '', '', '', ''),
(18, '2025-07-28', 'pending', NULL, '', '', '', '', '', ''),
(19, '2025-07-28', 'pending', NULL, '', '', '', '', '', ''),
(20, '2025-07-29', 'pending', NULL, '', '', '', '', '', ''),
(21, '2025-07-30', 'pending', NULL, '', '', '', '', '', ''),
(22, '2025-07-30', 'pending', NULL, '', '', '', '', '', ''),
(23, '2025-07-30', 'pending', NULL, '', '', '', '', '', ''),
(24, '2025-07-30', 'pending', NULL, '', '', '', '', '', ''),
(26, '2025-07-30', 'pending', NULL, '', '', '', '', '', ''),
(27, '2025-07-30', 'pending', NULL, '', '', '', '', '', ''),
(29, '2025-07-30', 'pending', NULL, '', '', '', '', '', ''),
(31, '2025-08-01', 'canceled', 'u617533', '', '', '', '', '', ''),
(32, '2025-08-01', 'processing', 'u617533', 'nancy', 'azzam', '0536218486', 'nancyazzam3@gmail.com', '216345789', 'אבוסנאן, חיליים משוחררים'),
(33, '2025-08-02', 'delivered', 'u617533', 'merna', 'saab', '0509902301', 'mernasa44@gmail.com', '325466399', 'אבוסנאן,רחוב עבדאללה חיר');

-- --------------------------------------------------------

--
-- Table structure for table `order_meal`
--

CREATE TABLE `order_meal` (
  `order_id` int(11) NOT NULL,
  `meal_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_meal`
--

INSERT INTO `order_meal` (`order_id`, `meal_id`, `quantity`) VALUES
(14, 3, 2),
(15, 3, 2),
(16, 3, 1),
(16, 4, 1),
(16, 1234, 1),
(17, 4, 1),
(18, 2, 1),
(19, 4, 1),
(19, 1234, 1),
(20, 1, 1),
(21, 1, 1),
(21, 3, 1),
(22, 1, 3),
(23, 1, 1),
(24, 1, 1),
(24, 2, 1),
(26, 1, 1),
(27, 1, 1),
(29, 1, 2),
(31, 1, 3),
(31, 3, 1),
(31, 4, 1),
(32, 1, 1),
(33, 1, 2),
(33, 3, 1),
(33, 4, 2);

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL,
  `setting_name` varchar(50) DEFAULT NULL,
  `setting_value` decimal(5,4) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `setting_name`, `setting_value`, `description`, `created_at`, `updated_at`) VALUES
(1, 'vat_rate', 0.1700, 'VAT rate for food products in Israel', '2025-08-01 23:12:42', '2025-08-01 23:12:42');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(10) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `age` varchar(3) DEFAULT NULL,
  `user_type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `address`, `phone`, `email`, `password`, `age`, `user_type`) VALUES
('u001', 'מירנא', 'סעב', 'רחוב הבריאות 1', '0502222222', 'mirna@example.com', '$2a$12$W/TUExG8TnnAC12pa4ruS.VcuiOQnDOSeei0oLf4TcbgeVRA6WWA6', '21', 'user'),
('u102341', 'lanaNehol', 'nabwani', NULL, '0503238384', 'lanaNehol123@gmail.com', '$2a$12$bvViTtf7Q9./MJrTtBeDZ.wPQLg8l3gftDKgoVkWXYsZzLQmqW1ay', '17', 'admin'),
('u176876', 'lana', 'nabwani', NULL, '0503238384', 'lananabwani1233@gmail.com', '$2b$10$WX6nPTBxg0ziApbqLUfrPuJPabh5zWK0EJpz0lSlpd0h5Eph8VOIu', '20', 'user'),
('u343786', 'merna', 'saab', 'גולס', '0502567789', 'merna@test.com', '$2b$10$QSKAw8fmp788HehQacB2WeYEILFkmymrsO2NSvfIyj6RdDh9l.FPG', '19', 'admin'),
('u400145', 'merna', 'saab', NULL, '0509902301', 'mernasa@gmail.com', '$2b$10$bCz/t7wOkzrlXr41hwum/OTfxhdrSTXJ3Rb75/r28FJK7cs3AKOpu', '22', 'user'),
('u617533', 'merna', 'saab', '', '0509902301', 'mernasa44@gmail.com', '$2b$10$jirACS1cc672CW1ZGa0HkOQSXlMshiPioz810pDoKj5qg1WIRDzhG', '22', 'user'),
('u952492', 'lana', 'nabwaaniii', NULL, '0503238384', 'llll@gmail.com', '$2b$10$ow2sn4U02EXEyD21lLDtq.sl4LepkC3A3dUqFJdZmKLW1vGmI0JW.', '20', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `user_physicaldata`
--

CREATE TABLE `user_physicaldata` (
  `user_id` varchar(10) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `activity_level` varchar(20) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_physicaldata`
--

INSERT INTO `user_physicaldata` (`user_id`, `age`, `weight`, `height`, `activity_level`, `gender`) VALUES
('u001', 24, 60.50, 165.00, 'בינונית', 'נקבה');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `category_meal`
--
ALTER TABLE `category_meal`
  ADD PRIMARY KEY (`category_id`,`meal_id`),
  ADD KEY `meal_id` (`meal_id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `meals`
--
ALTER TABLE `meals`
  ADD PRIMARY KEY (`meal_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_meal`
--
ALTER TABLE `order_meal`
  ADD PRIMARY KEY (`order_id`,`meal_id`),
  ADD KEY `meal_id` (`meal_id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_name` (`setting_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_physicaldata`
--
ALTER TABLE `user_physicaldata`
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meals`
--
ALTER TABLE `meals`
  MODIFY `meal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=327677;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `category_meal`
--
ALTER TABLE `category_meal`
  ADD CONSTRAINT `category_meal_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `category_meal_ibfk_2` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`meal_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `order_meal`
--
ALTER TABLE `order_meal`
  ADD CONSTRAINT `order_meal_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `order_meal_ibfk_2` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`meal_id`);

--
-- Constraints for table `user_physicaldata`
--
ALTER TABLE `user_physicaldata`
  ADD CONSTRAINT `user_physicaldata_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
