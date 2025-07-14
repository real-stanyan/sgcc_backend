// index.js
import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import yaowenRouter from "../routes/yaowenRoutes.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", yaowenRouter);

app.get("/", (req, res) => res.send("Hello World"));

app.listen(3000);
export default serverless(app);
