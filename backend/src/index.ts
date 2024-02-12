import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import type { Submission } from "./structures";

dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT || 9000;
const cors = require('cors')

app.use(cors())

app.get("/", (req: Request, res: Response) => {
  res.send("Mickey's Express Server. Have a wonderful day!");
});


app.post("/submission", (req: Request, res: Response) => {
  //make sure that the body of the requeset has the data that we want
  //parse the body of the request and store as a Submission
  let submission: Submission = req.body;

  console.log("Received: ", submission);
  res.send('Mickey has acknowledged your POST request. Have a wonderful day!');
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
