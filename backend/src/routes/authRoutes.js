import express from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(username, email, password);
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
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
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciais Inválidas" });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        message: "Credenciais inválidas",
      });
    }
    const tokenPayload = {
      id: user.id,
      email: user.email,
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      message: "Login feito com sucesso!",
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Erro no login do usuário", err);
    return res.status(500).json({
      message: "Ocorreu um erro interno no servidor durante o login.",
    });
  }
});

router.post("/logout", (req, res) => {
  console.log("Requisição de logout recebida");
  return res.status(200).json({ message: "Logout feito com sucesso!" });
});

export default router;
