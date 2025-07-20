import express from "express";

function setupAuthRoutes(authServices) {
  const router = express.Router();

  router.post("/", async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const newUser = await authServices.createAccount(
        username,
        email,
        password
      );
      res.status(200).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      });
    } catch (err) {
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await authServices.login(email, password);
      res.status(200).json({
        user: {
          id: user.user.id,
          email: user.user.email,
        },
        token: user.token,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  });

  router.post("/logout", async (req, res) => {
    return res.status(200).json({ message: "Logout feito com sucesso!" });
  });

  return router;
}

export default setupAuthRoutes;
