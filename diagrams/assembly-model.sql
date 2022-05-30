-- MySQL Script generated by MySQL Workbench
-- Mon May 30 14:37:08 2022
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`artists`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`artists` (
  `id` INT NOT NULL,
  `name` VARCHAR(255) NULL,
  `email` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`live_gig`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`live_gig` (
  `id` INT NOT NULL,
  `artist` INT NULL,
  `message` VARCHAR(500) NULL,
  `venue` VARCHAR(45) NULL,
  `slug` VARCHAR(255) NULL,
  `image_url` VARCHAR(500) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `artist`
    FOREIGN KEY (`id`)
    REFERENCES `mydb`.`artists` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`users` (
  `id` INT NOT NULL,
  `email` VARCHAR(45) NULL,
  `fb_first_name` VARCHAR(45) NULL,
  `fb_id` VARCHAR(45) NULL,
  `fb_profile_pic` VARCHAR(45) NULL,
  `fb_last_name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`check_ins`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`check_ins` (
  `id` INT NOT NULL,
  `user_email` VARCHAR(255) NOT NULL,
  `live_gig_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `live_gig_id_idx` (`live_gig_id` ASC) VISIBLE,
  INDEX `user_id_idx` (`user_email` ASC) VISIBLE,
  CONSTRAINT `live_gig_id`
    FOREIGN KEY (`live_gig_id`)
    REFERENCES `mydb`.`live_gig` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user_email`
    FOREIGN KEY (`user_email`)
    REFERENCES `mydb`.`users` (`email`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
