-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'LOVE', 'FUNNY', 'SAD');

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_postId_key" ON "Reaction"("userId", "postId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
