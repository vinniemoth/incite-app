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
      switch (err.message) {
        case "missing_credentials":
          return res.status(400).json({ message: "All fields are required." });
        case "email_already_exists":
          return res.status(400).json({ message: "Email already exists." });
        case "username_already_exists":
          return res.status(400).json({ message: "Username already exists." });
        default:
          return res.status(500).json({ message: "Erro interno do servidor." });
      }
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
      switch (err.message) {
        case "missing_credentials":
          return res
            .status(400)
            .json({ message: "Email and Password are required." });
        case "invalid_password":
          return res.status(401).json({ message: "Invalid password." });
        default:
          return res.status(500).json({ message: "Erro interno do servidor." });
      }
    }
  });

  router.post("/logout", async (req, res) => {
    return res.status(200).json({ message: "Logout feito com sucesso!" });
  });

  return router;
}

export default setupAuthRoutes;
