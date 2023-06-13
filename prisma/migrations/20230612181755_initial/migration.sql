/*
  Warnings:

  - Made the column `description` on table `FeatureFlag` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `FeatureFlag` MODIFY `description` VARCHAR(191) NOT NULL;
