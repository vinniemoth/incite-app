/*
  Warnings:

  - You are about to drop the column `authorName` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorName",
ADD COLUMN     "authorsName" TEXT[];
