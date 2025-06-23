import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/Auth.middleware.js";

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

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
        owner: {
          connect: {
            id: res.user_id,
          },
        },
      },
    });
    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            // avatarUrl: true
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

export default router;
