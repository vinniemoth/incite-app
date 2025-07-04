import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// Routes
import setupAuthRoutes from "./routes/authRoutes.js";
import setupPostRoutes from "./routes/postRoutes.js";

// Services
import { AuthService, PostService } from "./services/index.services.js";

const app = express();
const PORT = 5000;

const prisma = new PrismaClient();
const authService = new AuthService(prisma);
const postService = new PostService(prisma);

app.use(cors());
app.use(express.json());

app.use("/auth", setupAuthRoutes(authService));
app.use("/post", setupPostRoutes(postService));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
