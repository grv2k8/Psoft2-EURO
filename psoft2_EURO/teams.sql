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

-- Dumping structure for table psoft2_EURO.teams
CREATE TABLE IF NOT EXISTS `teams` (
  `teamID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `group` tinytext,
  `logoURL` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`teamID`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;

-- Dumping data for table psoft2_EURO.teams: ~26 rows (approximately)
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` (`teamID`, `Name`, `group`, `logoURL`) VALUES
	(1, 'France', 'A', 'https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg'),
	(2, 'Romania', 'A', 'https://upload.wikimedia.org/wikipedia/commons/7/73/Flag_of_Romania.svg'),
	(3, 'Albania', 'A', 'https://upload.wikimedia.org/wikipedia/commons/3/36/Flag_of_Albania.svg'),
	(4, 'Switzerland', 'A', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_Switzerland_(Pantone).svg'),
	(5, 'Wales', 'B', 'https://upload.wikimedia.org/wikipedia/commons/5/59/Flag_of_Wales_2.svg'),
	(6, 'Slovakia', 'B', 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Slovakia.svg'),
	(7, 'England', 'B', 'https://upload.wikimedia.org/wikipedia/en/b/be/Flag_of_England.svg'),
	(8, 'Russia', 'B', 'https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg'),
	(9, 'Poland', 'C', 'https://upload.wikimedia.org/wikipedia/en/1/12/Flag_of_Poland.svg'),
	(10, 'Northern Ireland', 'C', 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Northern_Ireland.svg'),
	(11, 'Ukraine', 'C', 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg'),
	(12, 'Germany', 'C', 'https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg'),
	(13, 'Turkey', 'D', 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg'),
	(14, 'Croatia', 'D', 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Croatia.svg'),
	(15, 'Spain', 'D', 'https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg'),
	(16, 'Czech Republic', 'D', 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Czech_Republic.svg'),
	(17, 'Republic of Ireland', 'E', 'https://upload.wikimedia.org/wikipedia/commons/4/45/Flag_of_Ireland.svg'),
	(18, 'Sweden', 'E', 'https://upload.wikimedia.org/wikipedia/en/4/4c/Flag_of_Sweden.svg'),
	(19, 'Belgium', 'E', 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Belgium.svg'),
	(20, 'Italy', 'E', 'https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg'),
	(21, 'Austria', 'F', 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_Austria.svg'),
	(22, 'Hungary', 'F', 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_Hungary.svg'),
	(23, 'Portugal', 'F', 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg'),
	(24, 'Iceland', 'F', 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Iceland.svg'),
	(25, 'TBD', 'X', 'not_found'),
	(50, 'DRAW', 'X', NULL);
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
