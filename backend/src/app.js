import authRoutes from "./routes/authRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import express from "express";
import cors from "cors";
import authMiddleware from "./middleware/Auth.middleware.js";

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api", authMiddleware, apiRoutes);
app.use("/post", authMiddleware, postRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
