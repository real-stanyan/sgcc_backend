import express from "express";
import cors from "cors";
import yaowenRouter from "./routes/yaowenRoutes.js";
import kuaixunRouter from "./routes/kuaixunRoutes.js";
import biwulianbingRouter from "./routes/biwulianbingRoutes.js";
import rouxingtuanduiRouter from "./routes/rouxingtuanduiRoutes.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/api", yaowenRouter);
app.use("/api", kuaixunRouter);
app.use("/api", biwulianbingRouter);
app.use("/api", rouxingtuanduiRouter);

app.get("/", (req, res) => res.send("Hello World"));

app.listen(3000);
