// index.js
import express from "express";
import yaowenRouter from "./routes/yaowenRoutes.js";

const app = express();

app.use("/api", yaowenRouter);

app.get("/", (req, res) => res.send("Hello World"));

app.listen(3000);
