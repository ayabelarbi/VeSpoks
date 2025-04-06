import express, {Application, Request, Response} from "express";
import routes from "./routes/routes";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// Connect to MongoDB once
mongoose
  .connect("mongodb://localhost:27017/vemob")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("PBW 2025 - VeMob REST API");
});

app.use("/api/v1", routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});