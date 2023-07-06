/*
  Warnings:

  - Added the required column `localEnablePercentage` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localOffCount` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localOnCount` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productionEnablePercentage` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productionOffCount` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productionOnCount` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stagingEnablePercentage` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stagingOffCount` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stagingOnCount` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FeatureFlagSingleDb` ADD COLUMN `localEnablePercentage` INTEGER NOT NULL,
    ADD COLUMN `localOffCount` INTEGER NOT NULL,
    ADD COLUMN `localOnCount` INTEGER NOT NULL,
    ADD COLUMN `productionEnablePercentage` INTEGER NOT NULL,
    ADD COLUMN `productionOffCount` INTEGER NOT NULL,
    ADD COLUMN `productionOnCount` INTEGER NOT NULL,
    ADD COLUMN `stagingEnablePercentage` INTEGER NOT NULL,
    ADD COLUMN `stagingOffCount` INTEGER NOT NULL,
    ADD COLUMN `stagingOnCount` INTEGER NOT NULL;
