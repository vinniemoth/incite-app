import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import BcryptCryptoClient from "./services/cryptoclient.service.js";
import JwtManager from "./services/jwtManager.service.js";

// Middleware
import makeAuthMiddleware from "./middleware/Auth.middleware.js";

// Service Module
import { AuthServices } from "./services/index.services.js";
import GoogleBooksService from "./services/googleBooks.service.js";

// Routes with DI implemented
import setupAuthRoutes from "./routes/authRoutes.js";
import setupApiRoutes from "./routes/apiRoutes.js";

// Other Routes
import postRoutes from "./routes/postRoutes.js";
import setupUserRoutes from "./routes/userRoutes.js";
import UserService from "./services/user.service.js";

const app = express();
const PORT = 5000;

// Classes instances
const prisma = new PrismaClient();
const cryptoClient = new BcryptCryptoClient();
const jwtManager = new JwtManager();
const googleBooks = new GoogleBooksService();
const authServices = new AuthServices(prisma, cryptoClient, jwtManager);
const userService = new UserService(prisma);

app.use(cors());
app.use(express.json());

// Middleware with DI
const authMiddleware = makeAuthMiddleware(jwtManager);

// Services with DI

// Routes with DI
app.use("/auth", setupAuthRoutes(authServices));
app.use("/api", authMiddleware, setupApiRoutes(googleBooks, prisma));
app.use("/user", authMiddleware, setupUserRoutes(userService));

// Other Routes
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
