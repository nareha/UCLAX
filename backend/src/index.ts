import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 9000;
const cors = require('cors')

app.use(cors())

app.get("/", (req: Request, res: Response) => {
  res.send("Mickey's Express Server. Have a wonderful day!");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
