import express from "express";
import AuthService from "../services/auth.services.js";

function setupAuthRoutes(authService) {
  const router = express.Router();

  router.post("/", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }
    try {
      const newUser = await authService.registerUser(username, email, password);
      return res
        .status(201)
        .json({ message: "Usuário criado com sucesso!", newUser });
    } catch (err) {
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha obrigatórios" });
    }

    try {
      const result = await AuthService.loginUser(email, password);
      if (!result) {
        return res.status(401).json({ message: "Credenciais Inválidas" });
      }

      return res.status(200).json({
        message: "Login feito com sucesso!",
        user: result.user,
        token: result.token,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Ocorreu um erro interno no servidor durante o login.",
      });
    }
  });

  router.post("/logout", (req, res) => {
    console.log("Requisição de logout recebida");
    return res.status(200).json({ message: "Logout feito com sucesso!" });
  });

  return router;
}

export default setupAuthRoutes;
