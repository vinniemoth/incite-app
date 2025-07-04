import express from "express";

function setupAuthRoutes(authServices) {
  const router = express.Router();

  router.post("/", async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const newUser = authServices.createAccount(username, email, password);
      res.status(200).json(newUser);
    } catch (err) {
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = authServices.login(email, password);
      res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  });

  router.post("/logout", async (req, res) => {
    console.log("Requisição de logout recebida");
    return res.status(200).json({ message: "Logout feito com sucesso!" });
  });

  return router;
}

export default setupAuthRoutes;
