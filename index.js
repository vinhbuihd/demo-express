import express from "express";
import { connectDB } from "./db.js";
import swaggerUi from "swagger-ui-express";

import usersRouter from "./routes/users.js";
import { swaggerSpec } from "./swagger.js";
const PORT = process.env.PORT;

connectDB();

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from backend");
});
app.use("/api", usersRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
