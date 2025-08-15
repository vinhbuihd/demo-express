import express from "express";
import { connectDB } from "../db.js";
import swaggerUi from "swagger-ui-express";
import multer from "multer";

import usersRouter from "../routes/users.js";
import { swaggerSpec } from "../swagger.js";
import path from "path";
import fs from "fs";

const PORT = process.env.PORT || 8000;

connectDB();

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from backend");
});
app.use("/api", usersRouter);

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // lưu file vào thư mục uploads
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// API upload file (name="myfile" từ form-data)
app.post("/upload", upload.single("myfile"), (req, res) => {
  console.log("File đã nhận:", req.file);
  res.json({
    message: "Upload thành công",
    file: req.file,
  });
});

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running at http://localhost:${PORT}`);
// });

export default app;
