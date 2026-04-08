/*
  Warnings:

  - A unique constraint covering the columns `[name,lead_id]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_name_lead_id_key" ON "Team"("name", "lead_id");
