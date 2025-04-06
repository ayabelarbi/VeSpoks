import express, {Application, Request, Response} from "express";
import routes from "./routes/routes";
import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("PBW 2025 - VeMob REST API");
});

app.use("/api/v1", routes);
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });