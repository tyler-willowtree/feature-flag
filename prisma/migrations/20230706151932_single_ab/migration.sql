/*
  Warnings:

  - Added the required column `abPercentageLocal` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abHideCountLocal` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abShowCountLocal` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abPercentageProd` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abHideCountProd` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abShowCountProd` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abPercentageStage` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abHideCountStage` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abShowCountStage` to the `FeatureFlagSingleDb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FeatureFlagSingleDb` ADD COLUMN `abPercentageLocal` INTEGER NOT NULL,
    ADD COLUMN `abHideCountLocal` INTEGER NOT NULL,
    ADD COLUMN `abShowCountLocal` INTEGER NOT NULL,
    ADD COLUMN `abPercentageProd` INTEGER NOT NULL,
    ADD COLUMN `abHideCountProd` INTEGER NOT NULL,
    ADD COLUMN `abShowCountProd` INTEGER NOT NULL,
    ADD COLUMN `abPercentageStage` INTEGER NOT NULL,
    ADD COLUMN `abHideCountStage` INTEGER NOT NULL,
    ADD COLUMN `abShowCountStage` INTEGER NOT NULL;
