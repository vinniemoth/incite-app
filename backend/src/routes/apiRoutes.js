import { Router } from "express";

function setupApiRoutes(bookService) {
  const router = Router();

  router.get("/books-search", async (req, res) => {
    const { q } = req.query;

    try {
      const bookSearch = await bookService.searchBook(q);
      return res.status(200).json(bookSearch);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro interno do servidor ao buscar livros" });
    }
  });

  router.get("/book/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const bookInfo = await bookService.fetchBookInfo(id);
      return res.status(200).json(bookInfo);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  return router;
}

export default setupApiRoutes;
