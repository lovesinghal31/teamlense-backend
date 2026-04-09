/*
  Warnings:

  - Made the column `assigned_to_id` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assigned_to_id_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "assigned_to_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "TeamMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
