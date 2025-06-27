import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();
const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY;

router.get("/books-search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res
      .status(400)
      .json({ message: "Parâmetro de busca 'q' obrigatório" });
  }
  if (!googleBooksApiKey) {
    return res.status(500).json({ error: "Chave de API não configurada" });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${q}&key=${googleBooksApiKey}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na API do Google Books:", errorData);
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar livros", err);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao buscar livros" });
  }
});

router.get("/book/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}?key=${googleBooksApiKey}`
    );
    const data = await response.json();
    console.log(data);
    return res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/users/search", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res
      .status(400)
      .json({ error: "O parâmetro 'username' é obrigatório" });
  }
  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: username,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        // avatarUrl: true,
      },
    });
    if (users.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
  }
});

router.get("/users/profile", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res
      .status(400)
      .json({ message: "O parâmetro 'username' é obrigatório" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        email: true,
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
        // avatarUrl: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor", err });
  }
});
export default router;
