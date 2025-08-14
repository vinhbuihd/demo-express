// server/index.js
import express from "express";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import cors from "cors";

import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("./serviceAccountKey.json", import.meta.url), "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(
  cors({
    origin: "*", // hoặc "*"
  })
);
app.use(bodyParser.json());

let tokenFCM = "";

// save token endpoint (ví dụ đơn giản)
app.post("/api/save-token", (req, res) => {
  const { userId, token } = req.body;
  // lưu token vào DB gắn userId
  tokenFCM = token;
  console.log("save token", userId, token);
  res.sendStatus(200);
});

// gửi notification tới token
app.post("/api/send-noti", async (req, res) => {
  const { title, body, url } = req.body;
  const message = {
    token: tokenFCM,
    data: {
      title: title,
      body: body,
      url: url || "/", // url muốn mở khi click
    },
  };
  try {
    const resp = await admin.messaging().send(message);
    res.json({ ok: true, resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, err: err.message });
  }
});

app.listen(3001, () => console.log("Server on 3001"));
