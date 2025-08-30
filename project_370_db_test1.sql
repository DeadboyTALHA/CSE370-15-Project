-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 30, 2025 at 09:56 AM
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
-- Database: `project_370_db_test1`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `Code` varchar(20) NOT NULL,
  `UserID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`Code`, `UserID`) VALUES
('7939', '22201680'),
('2522', '23201390');

-- --------------------------------------------------------

--
-- Table structure for table `allergy`
--

CREATE TABLE `allergy` (
  `AllergyID` int(11) NOT NULL,
  `UserID` varchar(20) DEFAULT NULL,
  `AllergyName` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `allergy`
--

INSERT INTO `allergy` (`AllergyID`, `UserID`, `AllergyName`) VALUES
(1, '123123', 'Nut'),
(2, '22201680', 'Peanut'),
(3, 'S2', 'Nut'),
(4, '5555555', 'Chicken'),
(6, '999999', 'Nut'),
(7, '999999', 'Chicken'),
(8, '444444', 'Sugar'),
(9, '444444', 'Spices');

-- --------------------------------------------------------

--
-- Table structure for table `counterno`
--

CREATE TABLE `counterno` (
  `F_Name` varchar(100) NOT NULL,
  `CounterNo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `counterno`
--

INSERT INTO `counterno` (`F_Name`, `CounterNo`) VALUES
('Beef Burger', '1'),
('Beef Burger', '3'),
('Beef Steak', '2'),
('Beef Steak', '4'),
('Cheese Pizza', '1'),
('Cheese Pizza', '3'),
('Chicken Biryani', '2'),
('Chicken Biryani', '4'),
('Chicken Sandwich', '1'),
('Chicken Sandwich', '3'),
('Chicken Wings', '2'),
('Chicken Wings', '4'),
('Chocolate Cake', '1'),
('Chocolate Cake', '3'),
('Coffee', '1'),
('Coffee', '2'),
('Coffee', '3'),
('Fish Curry', '2'),
('Fish Curry', '4'),
('French Fries', '1'),
('French Fries', '3'),
('Fruit Juice', '1'),
('Fruit Juice', '2'),
('Fruit Juice', '3'),
('Fruit Salad', '1'),
('Fruit Salad', '3'),
('Grilled Chicken', '2'),
('Grilled Chicken', '4'),
('Ice Cream', '1'),
('Ice Cream', '3'),
('Mango Shake', '1'),
('Mango Shake', '2'),
('Mango Shake', '3'),
('Pasta Alfredo', '2'),
('Pasta Alfredo', '4'),
('Tea', '1'),
('Tea', '2'),
('Tea', '3'),
('Vegetable Fried Rice', '2'),
('Vegetable Fried Rice', '4'),
('Vegetable Soup', '2'),
('Vegetable Soup', '4'),
('Vegetable Spring Rolls', '2'),
('Vegetable Spring Rolls', '4');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `FeedbackID` int(11) NOT NULL,
  `UserID` varchar(20) DEFAULT NULL,
  `FeedbackText` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`FeedbackID`, `UserID`, `FeedbackText`) VALUES
(1, '23201390', 'Testing 1'),
(2, '123123', 'Testing 2');

-- --------------------------------------------------------

--
-- Table structure for table `finance`
--

CREATE TABLE `finance` (
  `F_Date` date NOT NULL DEFAULT curdate(),
  `F_Name` varchar(100) DEFAULT NULL,
  `Sold_Quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `finance`
--

INSERT INTO `finance` (`F_Date`, `F_Name`, `Sold_Quantity`) VALUES
('2025-08-29', 'Cheese Pizza', 8),
('2025-08-30', 'Beef Burger', 8);

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE `food` (
  `F_Name` varchar(100) NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `Expiry_Date` date DEFAULT NULL,
  `Availability_Status` enum('Available','Not Available','Low Quantity') NOT NULL,
  `Available_Quantity` int(11) DEFAULT NULL,
  `Basic_Ingredients` varchar(50) DEFAULT NULL,
  `Category` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`F_Name`, `Price`, `Expiry_Date`, `Availability_Status`, `Available_Quantity`, `Basic_Ingredients`, `Category`) VALUES
('Beef Burger', 150.00, '2025-08-27', 'Available', 30, 'Beef Patty, Bun, Lettuce, Tomato, Cheese', 'Fast Food'),
('Beef Steak', 220.00, '2025-08-27', 'Not Available', 0, 'Beef, Butter, Herbs, Pepper', 'Main Course'),
('Cheese Pizza', 160.00, '2025-08-27', 'Available', 24, 'Flour, Cheese, Tomato Sauce, Herbs', 'Fast Food'),
('Chicken Biryani', 120.00, '2025-08-27', 'Available', 15, 'Chicken, Rice, Spices, Yogurt, Onions', 'Main Course'),
('Chicken Sandwich', 110.00, '2025-08-27', 'Available', 17, 'Chicken, Bread, Lettuce, Mayo', 'Fast Food'),
('Chicken Wings', 140.00, '2025-08-29', 'Low Quantity', 6, 'Chicken, Spices, Sauce, Oil', 'Appetizer'),
('Chocolate Cake', 80.00, '2025-08-29', 'Available', 15, 'Flour, Sugar, Cocoa, Eggs, Butter', 'Dessert'),
('Coffee', 40.00, '2025-08-27', 'Available', 25, 'Coffee, Water, Sugar, Milk', 'Beverage'),
('Fish Curry', 130.00, '2025-08-28', 'Low Quantity', 4, 'Fish, Coconut Milk, Spices, Onions', 'Main Course'),
('French Fries', 60.00, '2025-08-27', 'Not Available', 0, 'Potatoes, Salt, Oil', 'Fast Food'),
('Fruit Juice', 55.00, '2025-08-28', 'Available', 16, 'Mixed Fruits, Water, Sugar', 'Beverage'),
('Fruit Salad', 65.00, '2025-08-27', 'Available', 12, 'Mixed Fruits, Yogurt, Honey', 'Dessert'),
('Grilled Chicken', 180.00, '2025-08-29', 'Available', 10, 'Chicken, Lemon, Spices, Oil', 'Main Course'),
('Ice Cream', 65.00, '2025-08-27', 'Available', 27, 'Milk, Sugar, Cream, Flavoring', 'Dessert'),
('Mango Shake', 75.00, '2025-08-27', 'Available', 20, 'Mango, Milk, Sugar, Ice', 'Beverage'),
('Pasta Alfredo', 125.00, '2025-08-27', 'Available', 18, 'Pasta, Cream, Cheese, Butter', 'Main Course'),
('Tea', 30.00, '2025-08-27', 'Available', 30, 'Tea, Water, Sugar, Milk', 'Beverage'),
('Vegetable Fried Rice', 90.00, '2025-08-27', 'Available', 28, 'Rice, Mixed Vegetables, Soy Sauce, Eggs', 'Main Course'),
('Vegetable Soup', 70.00, '2025-08-27', 'Low Quantity', 5, 'Mixed Vegetables, Water, Salt, Spices', 'Appetizer'),
('Vegetable Spring Rolls', 85.00, '2025-08-27', 'Available', 14, 'Mixed Vegetables, Flour, Oil, Spices', 'Appetizer');

--
-- Triggers `food`
--
DELIMITER $$
CREATE TRIGGER `set_initial_availability_status` BEFORE INSERT ON `food` FOR EACH ROW BEGIN
    IF NEW.Available_Quantity = 0 THEN
        SET NEW.Availability_Status = 'Not Available';
    ELSEIF NEW.Available_Quantity >= 10 THEN
        SET NEW.Availability_Status = 'Available';
    ELSE
        SET NEW.Availability_Status = 'Low Quantity';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_availability_status` BEFORE UPDATE ON `food` FOR EACH ROW BEGIN
    IF NEW.Available_Quantity = 0 THEN
        SET NEW.Availability_Status = 'Not Available';
    ELSEIF NEW.Available_Quantity >= 10 THEN
        SET NEW.Availability_Status = 'Available';
    ELSE
        SET NEW.Availability_Status = 'Low Quantity';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `serving_time`
--

CREATE TABLE `serving_time` (
  `F_Name` varchar(100) NOT NULL,
  `ServingTime` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `serving_time`
--

INSERT INTO `serving_time` (`F_Name`, `ServingTime`) VALUES
('Beef Burger', '8:00 AM - 6:00 PM'),
('Beef Steak', '12:00 PM - 4:00 PM'),
('Cheese Pizza', '8:00 AM - 6:00 PM'),
('Chicken Biryani', '12:00 PM - 4:00 PM'),
('Chicken Sandwich', '8:00 AM - 6:00 PM'),
('Chicken Wings', '12:00 PM - 4:00 PM'),
('Chocolate Cake', '8:00 AM - 6:00 PM'),
('Coffee', '8:00 AM - 6:00 PM'),
('Fish Curry', '12:00 PM - 4:00 PM'),
('French Fries', '8:00 AM - 6:00 PM'),
('Fruit Juice', '8:00 AM - 6:00 PM'),
('Fruit Salad', '8:00 AM - 6:00 PM'),
('Grilled Chicken', '12:00 PM - 4:00 PM'),
('Ice Cream', '8:00 AM - 6:00 PM'),
('Mango Shake', '8:00 AM - 6:00 PM'),
('Pasta Alfredo', '12:00 PM - 4:00 PM'),
('Tea', '8:00 AM - 6:00 PM'),
('Vegetable Fried Rice', '12:00 PM - 4:00 PM'),
('Vegetable Soup', '12:00 PM - 4:00 PM'),
('Vegetable Spring Rolls', '12:00 PM - 4:00 PM');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` varchar(20) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(100) NOT NULL CHECK (`Email` like '%@g.bracu.ac.bd'),
  `FullName` varchar(100) DEFAULT NULL,
  `Category` enum('student','staff','vendor','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `Username`, `Password`, `Email`, `FullName`, `Category`) VALUES
('121212', 'test2test2', '$2y$10$erfKYhUPVraW/qDEt1OJRe7z1/XOfpWJyf6WITLyP16G7SatZlOPy', 'test2@g.bracu.ac.bd', 'test2', 'student'),
('123123', 'test1test1', '$2y$10$XZ7k31ZSRcy2YOlKfPjcM.pZNQiNj6UJJdYZhNZFlCTL1Qd8jEyGC', 'test1@g.bracu.ac.bd', 'test1', 'student'),
('22201680', 'jamshed_xyz', '$2y$10$GLPvhWedBsEmXh.FFzkKjuI4rtmlj45oms7f9JCfhWKxjgXOh05Xy', 'jamshedulalam.khan.hridoy@g.bracu.ac.bd', 'Jamshedul Alam Khan', 'admin'),
('23201390', 'deadboy_talha', '$2y$10$84EAmO093iEqaCGyfo8hGuYLFdlrOIyPBq/Md9PRVFXoRDJ4.YBmW', 'md.minhazul.mowla@g.bracu.ac.bd', 'Md. Minhazul Mowla', 'admin'),
('444444', 'test5', '$2y$10$xcwO.S7mHc5lqljtvHEkKuJ8dVAa3lmuATGS6JAdOwgSpEiy9JJXa', 'test5@g.bracu.ac.bd', 'test5', 'student'),
('5555555', 'test3', '$2y$10$uoOZMiGywV2f7QBv4VdDt.XdAZOWrJ1b4HVRt7NsdV7oN.P63mGuq', 'test3@g.bracu.ac.bd', 'Test3', 'student'),
('999999', 'test4', '$2y$10$1f0BjHzG0PeAlpw5ojeZpeYfq5UlbrzG9yfC5zEU8eBtUgGgGZguS', 'test4@g.bracu.ac.bd', 'test4', 'student'),
('S1', 'rahim1', '$2y$10$jFdfgCi888Gm7u/CRbFUH.VbstFXjdapVt6ZIGZK8qw8hQ8s2DVgK', 'rahimmia@g.bracu.ac.bd', 'Rahim Mia', 'staff'),
('S2', 'rahim2', '$2y$10$Rh0U7pC/hozH05nCpKtdXOx7YQ6HHh1LQAxpJ6BU0X9I9oIfo2MGe', 'rahim2@g.bracu.ac.bd', 'Rahim Test', 'staff'),
('V1', 'khabar_dabar', '$2y$10$sntn.hSMFlHtLw5LACKBQOj25x.z6cW1tbjV9PXCd8sG.C6KZYjdO', 'khabar.dabar@g.bracu.ac.bd', 'Khabar Dabar', 'vendor'),
('V2', 'polar', '$2y$10$gCMJP3qlWxqflxI01q1oW.5dBbkVDKK3c1eAgM6bc97pChm7cQW.O', 'polar@g.bracu.ac.bd', 'Polar', 'vendor');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `after_user_delete_vendor` AFTER DELETE ON `users` FOR EACH ROW BEGIN
    IF OLD.Category = 'vendor' THEN
        DELETE FROM Vendor WHERE UserID = OLD.UserID;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_user_insert_vendor` AFTER INSERT ON `users` FOR EACH ROW BEGIN
    IF NEW.Category = 'vendor' THEN
        INSERT INTO Vendor (V_Name, UserID) VALUES (NEW.FullName, NEW.UserID);
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_user_update_vendor` AFTER UPDATE ON `users` FOR EACH ROW BEGIN
    IF OLD.Category != 'vendor' AND NEW.Category = 'vendor' THEN
        -- User category changed to vendor, insert into Vendor table
        INSERT INTO Vendor (V_Name, UserID) VALUES (NEW.FullName, NEW.UserID);
    ELSEIF OLD.Category = 'vendor' AND NEW.Category != 'vendor' THEN
        -- User category changed from vendor, remove from Vendor table
        DELETE FROM Vendor WHERE UserID = OLD.UserID;
    ELSEIF NEW.Category = 'vendor' AND (OLD.FullName != NEW.FullName) THEN
        -- Vendor's name changed, update Vendor table
        UPDATE Vendor SET V_Name = NEW.FullName WHERE UserID = NEW.UserID;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `vending_history`
--

CREATE TABLE `vending_history` (
  `VH_ID` int(11) NOT NULL,
  `V_Name` varchar(50) DEFAULT NULL,
  `V_History` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vending_history`
--

INSERT INTO `vending_history` (`VH_ID`, `V_Name`, `V_History`) VALUES
(1, 'Polar', 'Ice Cream - 5'),
(2, 'Khabar Dabar', 'Beef Burger - 5'),
(3, 'Khabar Dabar', 'Vegetable Fried Rice - 20'),
(4, 'Khabar Dabar', 'Cheese Pizza - 10'),
(5, 'Khabar Dabar', 'Cheese Pizza - 11');

-- --------------------------------------------------------

--
-- Table structure for table `vendor`
--

CREATE TABLE `vendor` (
  `V_Name` varchar(50) NOT NULL,
  `UserID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendor`
--

INSERT INTO `vendor` (`V_Name`, `UserID`) VALUES
('Khabar Dabar', 'V1'),
('Polar', 'V2');

-- --------------------------------------------------------

--
-- Table structure for table `waste`
--

CREATE TABLE `waste` (
  `W_date` date NOT NULL DEFAULT curdate(),
  `W_amount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `waste`
--

INSERT INTO `waste` (`W_date`, `W_amount`) VALUES
('2025-08-28', 10),
('2025-08-29', 8),
('2025-08-30', 30);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`Code`),
  ADD UNIQUE KEY `UserID` (`UserID`);

--
-- Indexes for table `allergy`
--
ALTER TABLE `allergy`
  ADD PRIMARY KEY (`AllergyID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `counterno`
--
ALTER TABLE `counterno`
  ADD PRIMARY KEY (`F_Name`,`CounterNo`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`FeedbackID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `finance`
--
ALTER TABLE `finance`
  ADD PRIMARY KEY (`F_Date`),
  ADD KEY `F_Name` (`F_Name`);

--
-- Indexes for table `food`
--
ALTER TABLE `food`
  ADD PRIMARY KEY (`F_Name`);

--
-- Indexes for table `serving_time`
--
ALTER TABLE `serving_time`
  ADD PRIMARY KEY (`F_Name`,`ServingTime`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `vending_history`
--
ALTER TABLE `vending_history`
  ADD PRIMARY KEY (`VH_ID`),
  ADD KEY `V_Name` (`V_Name`);

--
-- Indexes for table `vendor`
--
ALTER TABLE `vendor`
  ADD PRIMARY KEY (`V_Name`),
  ADD UNIQUE KEY `UserID` (`UserID`);

--
-- Indexes for table `waste`
--
ALTER TABLE `waste`
  ADD PRIMARY KEY (`W_date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `allergy`
--
ALTER TABLE `allergy`
  MODIFY `AllergyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `FeedbackID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `vending_history`
--
ALTER TABLE `vending_history`
  MODIFY `VH_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `allergy`
--
ALTER TABLE `allergy`
  ADD CONSTRAINT `allergy_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `counterno`
--
ALTER TABLE `counterno`
  ADD CONSTRAINT `counterno_ibfk_1` FOREIGN KEY (`F_Name`) REFERENCES `food` (`F_Name`) ON DELETE CASCADE;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `finance`
--
ALTER TABLE `finance`
  ADD CONSTRAINT `finance_ibfk_1` FOREIGN KEY (`F_Name`) REFERENCES `food` (`F_Name`) ON DELETE CASCADE;

--
-- Constraints for table `serving_time`
--
ALTER TABLE `serving_time`
  ADD CONSTRAINT `serving_time_ibfk_1` FOREIGN KEY (`F_Name`) REFERENCES `food` (`F_Name`) ON DELETE CASCADE;

--
-- Constraints for table `vending_history`
--
ALTER TABLE `vending_history`
  ADD CONSTRAINT `vending_history_ibfk_1` FOREIGN KEY (`V_Name`) REFERENCES `vendor` (`V_Name`) ON DELETE CASCADE;

--
-- Constraints for table `vendor`
--
ALTER TABLE `vendor`
  ADD CONSTRAINT `vendor_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
