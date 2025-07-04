import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import BcryptCryptoClient from "./services/cryptoclient.service.js";

// Service Module
import { AuthServices } from "./services/index.services.js";

// Routes with DI implemented
import setupAuthRoutes from "./routes/authRoutes.js";

// Other Routes
import apiRoutes from "./routes/apiRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import authMiddleware from "./middleware/Auth.middleware.js";

const app = express();

const PORT = 5000;
const prisma = new PrismaClient();
const cryptoClient = new BcryptCryptoClient();

const authServices = new AuthServices(prisma, cryptoClient);

app.use(cors());
app.use(express.json());

// Routes with DI
app.use("/auth", setupAuthRoutes(authServices));

// Other Routes
app.use("/api", authMiddleware, apiRoutes);
app.use("/post", authMiddleware, postRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
