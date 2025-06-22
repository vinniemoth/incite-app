import authRoutes from "./routes/authRoutes.js";
import express from "express";
import cors from "cors";

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
