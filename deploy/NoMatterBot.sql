-- MySQL dump 10.13  Distrib 5.7.28, for Linux (x86_64)
--
-- Host: localhost    Database: NoMatterBot
-- ------------------------------------------------------
-- Server version	5.7.28-0ubuntu0.18.04.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `skills` (
  `skillName` varchar(100) NOT NULL,
  PRIMARY KEY (`skillName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES ('ai'),('c'),('c++'),('java'),('js'),('ml'),('mysql'),('networking'),('python');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userNames`
--

DROP TABLE IF EXISTS `userNames`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userNames` (
  `ghUName` varchar(100) NOT NULL,
  `mmUName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ghUName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userNames`
--

LOCK TABLES `userNames` WRITE;
/*!40000 ALTER TABLE `userNames` DISABLE KEYS */;
INSERT INTO `userNames` VALUES ('asmalunj','g9ztakciipdtuf5354yk6yof1h'),('ffahid','som36ft1tjnsikdr8dsw7r7iza'),('psharma9','393geubi5inudkyn9d1wz418rr'),('smkulka3','576zmec6xjrmxpr8814nszc48e'),('vbbhadra','xj868yorpfnibmar3cb6jd8c4c'),('yshi26','jfxyoyh3tfbzxeyb4d47eh63ko');
/*!40000 ALTER TABLE `userNames` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userSkills`
--

DROP TABLE IF EXISTS `userSkills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userSkills` (
  `ghUName` varchar(100) NOT NULL,
  `skill` varchar(100) NOT NULL,
  PRIMARY KEY (`ghUName`,`skill`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userSkills`
--

LOCK TABLES `userSkills` WRITE;
/*!40000 ALTER TABLE `userSkills` DISABLE KEYS */;
INSERT INTO `userSkills` VALUES ('asmalunj','ai'),('asmalunj','java'),('asmalunj','js'),('asmalunj','python'),('psharma9','java'),('psharma9','js'),('psharma9','networking'),('psharma9','python'),('smkulka3','java'),('smkulka3','js'),('smkulka3','python'),('smkulka3','sql'),('vbbhadra','c'),('vbbhadra','js'),('vbbhadra','networking'),('vbbhadra','python'),('ffahid', 'se'),('ffahid', 'ai'),('ffahid','devops'),('yshi26','se'),('yshi26','js'),('yshi26','ml');
/*!40000 ALTER TABLE `userSkills` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-30 18:35:32
