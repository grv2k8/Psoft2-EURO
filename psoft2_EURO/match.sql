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

-- Dumping structure for table psoft2_EURO.match
CREATE TABLE IF NOT EXISTS `match` (
  `matchID` int(11) NOT NULL AUTO_INCREMENT,
  `isActive` int(11) DEFAULT '0' COMMENT 'For deciding the next upcoming matches',
  `isHidden` int(11) DEFAULT '0' COMMENT 'For deciding if predictions need to be hidden',
  `isLocked` int(1) DEFAULT NULL COMMENT 'For deciding if user is allowed to vote or not',
  `pointsDelta` tinyint(4) NOT NULL DEFAULT '3' COMMENT 'Increment to winning points after match',
  `Team1ID` int(11) NOT NULL,
  `Team2ID` int(11) NOT NULL,
  `MatchDate` datetime DEFAULT NULL,
  `WinningTeamID` int(11) DEFAULT NULL COMMENT 'Can be null for matches that have not been decided yet',
  PRIMARY KEY (`matchID`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=latin1;

-- Dumping data for table psoft2_EURO.match: ~51 rows (approximately)
/*!40000 ALTER TABLE `match` DISABLE KEYS */;
INSERT INTO `match` (`matchID`, `isActive`, `isHidden`, `isLocked`, `pointsDelta`, `Team1ID`, `Team2ID`, `MatchDate`, `WinningTeamID`) VALUES
	(1, 0, 0, 1, 3, 1, 2, '2016-06-10 14:00:00', 1),
	(2, 0, 0, 1, 3, 3, 4, '2016-06-11 08:00:00', 4),
	(3, 0, 0, 1, 3, 5, 6, '2016-06-11 11:00:00', 5),
	(4, 0, 0, 1, 3, 7, 8, '2016-06-11 14:00:00', 50),
	(5, 0, 0, 1, 3, 13, 14, '2016-06-12 08:00:00', 14),
	(6, 0, 0, 1, 3, 9, 10, '2016-06-12 11:00:00', 9),
	(7, 0, 0, 1, 3, 12, 11, '2016-06-12 14:00:00', 12),
	(8, 0, 0, 1, 3, 15, 16, '2016-06-13 08:00:00', 15),
	(9, 0, 0, 1, 3, 17, 18, '2016-06-13 11:00:00', 50),
	(10, 0, 0, 1, 3, 19, 20, '2016-06-13 14:00:00', 20),
	(11, 0, 0, 1, 3, 21, 22, '2016-06-14 11:00:00', 22),
	(12, 0, 0, 1, 3, 23, 24, '2016-06-14 14:00:00', 50),
	(13, 1, 0, 0, 3, 8, 6, '2016-06-15 08:00:00', NULL),
	(14, 1, 0, 0, 3, 2, 4, '2016-06-15 11:00:00', NULL),
	(15, 1, 0, 0, 3, 1, 3, '2016-06-15 14:00:00', NULL),
	(16, 0, 0, 0, 3, 7, 5, '2016-06-16 08:00:00', NULL),
	(17, 0, 0, 0, 3, 11, 10, '2016-06-16 11:00:00', NULL),
	(18, 0, 0, 0, 3, 12, 9, '2016-06-16 14:00:00', NULL),
	(19, 0, 0, 0, 3, 20, 18, '2016-06-17 08:00:00', NULL),
	(20, 0, 0, 0, 3, 16, 14, '2016-06-17 11:00:00', NULL),
	(21, 0, 0, 0, 3, 15, 13, '2016-06-17 14:00:00', NULL),
	(22, 0, 0, 0, 3, 19, 17, '2016-06-18 08:00:00', NULL),
	(23, 0, 0, 0, 3, 24, 22, '2016-06-18 11:00:00', NULL),
	(24, 0, 0, 0, 3, 23, 21, '2016-06-18 14:00:00', NULL),
	(25, 0, 0, 0, 3, 2, 3, '2016-06-19 14:00:00', NULL),
	(26, 0, 0, 0, 3, 4, 1, '2016-06-19 14:00:00', NULL),
	(27, 0, 0, 0, 3, 6, 7, '2016-06-20 14:00:00', NULL),
	(28, 0, 0, 0, 3, 8, 5, '2016-06-20 14:00:00', NULL),
	(29, 0, 0, 0, 3, 11, 9, '2016-06-21 11:00:00', NULL),
	(30, 0, 0, 0, 3, 10, 12, '2016-06-21 11:00:00', NULL),
	(31, 0, 0, 0, 3, 16, 13, '2016-06-21 14:00:00', NULL),
	(32, 0, 0, 0, 3, 14, 15, '2016-06-21 14:00:00', NULL),
	(33, 0, 0, 0, 3, 24, 21, '2016-06-22 11:00:00', NULL),
	(34, 0, 0, 0, 3, 22, 23, '2016-06-22 11:00:00', NULL),
	(35, 0, 0, 0, 3, 18, 19, '2016-06-22 14:00:00', NULL),
	(36, 0, 0, 0, 3, 20, 17, '2016-06-22 14:00:00', NULL),
	(37, 0, 1, 0, 6, 25, 25, '2016-06-25 08:00:00', NULL),
	(38, 0, 1, 0, 6, 25, 25, '2016-06-25 11:00:00', NULL),
	(39, 0, 1, 0, 6, 25, 25, '2016-06-25 14:00:00', NULL),
	(40, 0, 1, 0, 6, 25, 25, '2016-06-26 08:00:00', NULL),
	(41, 0, 1, 0, 6, 25, 25, '2016-06-26 11:00:00', NULL),
	(42, 0, 1, 0, 6, 25, 25, '2016-06-26 14:00:00', NULL),
	(43, 0, 1, 0, 6, 25, 25, '2016-06-27 11:00:00', NULL),
	(44, 0, 1, 0, 6, 25, 25, '2016-06-27 14:00:00', NULL),
	(45, 0, 1, 0, 9, 25, 25, '2016-06-30 14:00:00', NULL),
	(46, 0, 1, 0, 9, 25, 25, '2016-07-01 14:00:00', NULL),
	(47, 0, 1, 0, 9, 25, 25, '2016-07-02 14:00:00', NULL),
	(48, 0, 1, 0, 9, 25, 25, '2016-07-03 14:00:00', NULL),
	(49, 0, 1, 0, 12, 25, 25, '2016-07-06 14:00:00', NULL),
	(50, 0, 1, 0, 12, 25, 25, '2016-07-07 14:00:00', NULL),
	(51, 0, 1, 0, 15, 25, 25, '2016-07-10 14:00:00', NULL);
/*!40000 ALTER TABLE `match` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
