import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectToMongo from "./config/db.js";
import authRouter from "./routes/auth.js";
import associateRouter from "./routes/associate.js";
import StaticId from "./models/staticId.js";

const app = express();
const port = 5000;

connectToMongo();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/auth", authRouter);

app.use("/associate", associateRouter);

app.post("/staticId", async (req, res) => {
  const res = await StaticId.create(req.body);
  res.send(res);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
