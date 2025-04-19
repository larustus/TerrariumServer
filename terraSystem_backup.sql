-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: 212.47.71.180    Database: terraSystem
-- ------------------------------------------------------
-- Server version	8.0.40-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alarms`
--

DROP TABLE IF EXISTS `alarms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alarms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start_time` time NOT NULL,
  `end_time` time DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `highest_offshoot` float DEFAULT NULL,
  `terrarium_id` int NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `alarms_terrariums_FK` (`terrarium_id`),
  CONSTRAINT `alarms_terrariums_FK` FOREIGN KEY (`terrarium_id`) REFERENCES `terrariums` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alarms`
--

LOCK TABLES `alarms` WRITE;
/*!40000 ALTER TABLE `alarms` DISABLE KEYS */;
INSERT INTO `alarms` VALUES (9,'19:57:20',NULL,1,11.1875,1,'temperatura');
/*!40000 ALTER TABLE `alarms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pins`
--

DROP TABLE IF EXISTS `pins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pins` (
  `id` int NOT NULL,
  `pin_function` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `terrarium_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `probe_serial_number` varchar(255) DEFAULT NULL,
  `work_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pins_users_FK` (`user_id`),
  CONSTRAINT `pins_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pins`
--

LOCK TABLES `pins` WRITE;
/*!40000 ALTER TABLE `pins` DISABLE KEYS */;
INSERT INTO `pins` VALUES (5,'water',NULL,1,NULL,NULL),(6,'t2',NULL,1,NULL,NULL),(12,'water',1,1,NULL,NULL),(13,'t1',NULL,1,NULL,NULL),(17,'pwm',1,1,NULL,NULL),(22,'t1',1,1,NULL,NULL),(26,'pwm',NULL,1,NULL,NULL),(27,'t2',1,1,NULL,NULL),(101,'probe',1,1,'3ce1d4433914',NULL),(102,'probe',NULL,1,'3ce1d4433915',NULL);
/*!40000 ALTER TABLE `pins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `readings`
--

DROP TABLE IF EXISTS `readings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `readings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `temperature_1` int NOT NULL,
  `temperature_2` int NOT NULL,
  `humidity` int NOT NULL,
  `terrarium_id` int NOT NULL,
  `hour` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `readings_terrariums_FK` (`terrarium_id`),
  CONSTRAINT `readings_terrariums_FK` FOREIGN KEY (`terrarium_id`) REFERENCES `terrariums` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=799 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `readings`
--

LOCK TABLES `readings` WRITE;
/*!40000 ALTER TABLE `readings` DISABLE KEYS */;
INSERT INTO `readings` VALUES (1,'2024-11-02',40,30,50,1,14),(22,'2024-11-03',25,60,30,1,16),(23,'2024-12-09',24,24,62,1,16),(24,'2024-12-10',24,24,62,1,16),(25,'2024-12-11',24,24,62,1,16),(26,'2024-12-12',24,24,62,1,16),(27,'2024-12-13',24,24,62,1,16),(28,'2024-12-14',24,24,62,1,16),(29,'2024-12-15',24,24,62,1,16),(31,'2024-12-17',24,24,62,1,16),(32,'2024-12-18',24,24,62,1,16),(33,'2024-12-19',24,24,62,1,16),(34,'2024-12-20',24,24,62,1,16),(35,'2024-12-20',24,24,62,1,17),(36,'2024-12-21',32,28,62,1,9),(37,'2024-12-21',32,28,62,1,10),(38,'2024-12-21',32,28,62,1,11),(39,'2024-12-21',32,28,62,1,12),(40,'2024-12-21',32,28,62,1,13),(41,'2024-12-21',32,28,62,1,14),(42,'2024-12-21',32,28,62,1,15),(43,'2024-12-21',32,28,62,1,16),(44,'2024-12-21',28,26,58,1,17),(45,'2025-01-05',24,24,51,1,14),(768,'2025-01-08',24,24,50,1,20),(769,'2025-01-08',23,24,50,1,21),(770,'2025-01-09',27,24,44,1,19),(771,'2025-01-09',27,24,44,1,0),(772,'2025-01-09',27,24,44,1,1),(773,'2025-01-09',32,24,44,1,2),(774,'2025-01-09',34,24,44,1,3),(775,'2025-01-09',23,24,44,1,4),(776,'2025-01-09',43,24,44,1,5),(777,'2025-01-09',22,24,44,1,6),(778,'2025-01-09',32,24,44,1,7),(779,'2025-01-09',23,24,44,1,8),(780,'2025-01-09',43,24,44,1,9),(781,'2025-01-09',32,24,44,1,10),(782,'2025-01-09',27,24,44,1,11),(783,'2025-01-09',27,24,44,1,12),(784,'2025-03-22',27,24,44,1,0),(792,'2025-03-22',27,24,66,1,1),(793,'2025-03-22',27,24,33,1,2),(794,'2025-03-22',27,24,22,1,3),(795,'2025-03-22',27,24,50,1,4),(796,'2025-04-14',27,26,39,1,15),(797,'2025-04-14',26,26,40,1,16),(798,'2025-04-16',25,25,48,1,19);
/*!40000 ALTER TABLE `readings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `terrariums`
--

DROP TABLE IF EXISTS `terrariums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `terrariums` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `temperature_goal` float NOT NULL,
  `humidity_goal` float NOT NULL,
  `max_temp` float NOT NULL,
  `min_temp` float NOT NULL,
  `max_hum` float NOT NULL,
  `min_hum` float NOT NULL,
  `user_id` int NOT NULL,
  `water_time` time DEFAULT NULL,
  `water_period` int DEFAULT NULL,
  `current_temp_1` float DEFAULT NULL,
  `current_hum` float DEFAULT NULL,
  `current_temp_2` float DEFAULT NULL,
  `temperature_thermostat` float DEFAULT NULL,
  `last_update` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `terrariums_users_FK` (`user_id`),
  CONSTRAINT `terrariums_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `terrariums`
--

LOCK TABLES `terrariums` WRITE;
/*!40000 ALTER TABLE `terrariums` DISABLE KEYS */;
INSERT INTO `terrariums` VALUES (1,'my gecko terrarium',30,69,35,20,80,20,1,'18:11:00',45,28.8,45,27.8,46.0625,'2025-04-16 17:58:03'),(3,'mata',40,30,30,30,30,30,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `terrariums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'alwos','1234'),(2,'terry','4444');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-19 16:55:29
