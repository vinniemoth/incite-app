-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "bookName" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
