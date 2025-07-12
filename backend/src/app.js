import express from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/client.js";
import BcryptCryptoClient from "./services/cryptoClient.service.js";
import JwtManager from "./services/jwtManager.service.js";
import Argon2 from "./services/argon2.service.js";

// Middleware
import makeAuthMiddleware from "./middleware/Auth.middleware.js";

// Service Module
import { AuthServices } from "./services/index.services.js";
import GoogleBooksService from "./services/googleBooks.service.js";

// Routes with DI implemented
import setupAuthRoutes from "./routes/authRoutes.js";
import setupApiRoutes from "./routes/apiRoutes.js";
import setupPostRoutes from "./routes/postRoutes.js";
import setupUserRoutes from "./routes/userRoutes.js";

// Other Routes
import UserService from "./services/user.service.js";
import PostService from "./services/post.services.js";

const app = express();
const PORT = process.env.PORT;

// Classes instances
const prisma = new PrismaClient();
const cryptoClient = new Argon2();
const jwtManager = new JwtManager();
const googleBooks = new GoogleBooksService(
  "https://www.googleapis.com/books/v1/volumes",
  process.env.GOOGLE_BOOKS_API_KEY,
  fetch
);
const authServices = new AuthServices(prisma, cryptoClient, jwtManager);
const userService = new UserService(prisma);
const postService = new PostService(prisma);

app.use(cors());
app.use(express.json());

// Middleware with DI
const authMiddleware = makeAuthMiddleware(jwtManager);

// Services with DI

// Routes with DI
app.use("/auth", setupAuthRoutes(authServices));
app.use("/api", authMiddleware, setupApiRoutes(googleBooks));
app.use("/user", authMiddleware, setupUserRoutes(userService));
app.use("/post", authMiddleware, setupPostRoutes(postService));

// Other Routes

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
