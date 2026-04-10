/*
  Warnings:

  - Made the column `agenda` on table `Meeting` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Meeting" ALTER COLUMN "agenda" SET NOT NULL;
