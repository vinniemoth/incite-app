import { Router } from "express";

const router = Router();

router.get("/books-search", async (req, res) => {
  const { q } = req.query;
  const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY;

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

export default router;
