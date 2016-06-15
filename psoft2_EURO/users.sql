-- --------------------------------------------------------
-- Host:                         gubuntu.duckdns.org
-- Server version:               5.5.49-0ubuntu0.14.04.1 - (Ubuntu)
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             9.3.0.5077
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table psoft2_EURO.users
CREATE TABLE IF NOT EXISTS `users` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `avatar_image` varchar(255) NOT NULL,
  `auth_key` varchar(255) NOT NULL,
  `points` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

-- Dumping data for table psoft2_EURO.users: ~17 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`userID`, `name`, `email`, `password`, `avatar_image`, `auth_key`, `points`) VALUES
	(10, 'G', 'grv2k6@gmail.com', '8727a900abb1a2aba6930e86ade29605', '', '22dde0be6555a744532195df2e46739d', 21),
	(11, 'Sandeep Sharma', 'sandeepsharma36@gmail.com', '35c10c6d44c223987b9055ab5a3fe809', '', 'e9a8a60adc3f60ec6f4a102200f6ab40', 18),
	(12, 'Paras Pradhan', 'pradhanparas@gmail.com', 'dd00101a6962b75767b23429f64fa765', '', 'db2cb61b67c510007d68c04e51a182b9', 21),
	(13, 'Deepointing Pandey', 'myemail.dipu@gmail.com', '69e0f71f25ece4351e4d73af430bec43', '', 'e4030976ff799394b19d4c6b1bfca2b6', 21),
	(14, 'Kshitiz Baral', 'tejdhar@gmail.com', '6c8a9f121ea4ac6ba3a686856c7aac43', '', 'bb22ea545b06e634d81533af27c342a0', 0),
	(15, 'Satya Thapa', 'satyakiranthapa@yahoo.com', '67ac195870d36794b2117ac261d755db', '', '7e548209cd785af8bf16f10980cd1aa1', 18),
	(16, 'sammy sammy', 'omailodai@gmail.com', '23cee63246ce3c28d90598a06c5f4be3', '', '0804b82e57463ec329c1a711605793f9', 21),
	(17, 'Najindra maharjan', 'najindra@hotmail.com', 'b8b280cdd1803acf80d251955c08df0b', '', 'fb7b27f6b2de925766914de6ed619634', 21),
	(18, 'KPL', 'kishorkapil@gmail.com', '1711319e40343575c7f32006e897fc0e', '', '1f3b98e9cb165fbd9f93e6f282399c1c', 24),
	(19, 'Praveen Basnet', 'praveensnehi@gmail.com', '97f8166b1ccd95cd5fc20028067ed064', '', '82bbec7b62eed705e8d142908e84462e', 15),
	(20, 'Don Neupane', 'bhooshanrn@hotmail.com', '7a1c07ff60f9c07ffe8da34ecbf4edc2', '', 'd8c670bb7d21e63085182427b252fe8e', 21),
	(21, 'Amit Shrestha', 'sthamit7@gmail.com', 'b3209d8ac1ffa5f3d1dbdb2f1603c8d5', '', 'cfe41c8424fcf34553084cb5ef42c5df', 18),
	(22, 'kabir', 'kabir.basnyat@gmail.com', '26a1229e55143f6d8cf6002311d66472', '', '9a6bd72b73c74bd5d765bf4eb40f3e24', 15),
	(23, 'Nepal', 'prajesh607@yahoo.com', '3b9fa726ef062de3a9a7e84fb6935952', '', 'f9eae5f9e23e3cedac9e65089b3c54da', 15),
	(24, 'Surya Lamichhane', 'lamchhanesurya@hotmail.com', 'e3274d6d4e50aad0ee3e31e29fa5f4dd', '', '26ad3543acb83c57be9dd1042f2e3501', 21),
	(25, 'Deepak rana', 'deepak_72712@yahoo.com', 'c13db2e0771b34b3031bb9fae15eb29b', '', '2a4f8a9e7e1e2ce5fa96a68bac6646c1', 21),
	(27, 'Suraj', 'scorpixsuraj@gmail.com', '41fa6491ef249317d78cf333a1412f9c', '', 'f4e0889e793d1cbdb61a0f66e374e68b', 15);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
