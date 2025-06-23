import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { author, bookTitle, bookCover, quote } = req.body;
  if (!quote || !author || !bookTitle) {
    return res.status(400).json({ message: "Todos os campos obrigatórios" });
  }
  try {
    const post = await prisma.post.create({
      data: {
        bookName: bookTitle,
        authorName: author,
        quote,
        coverImage: bookCover,
        ownerId: res.user_id,
      },
    });
    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
  }
});

export default router;
