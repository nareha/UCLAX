import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import type { Submission } from "./structures";

import { formatDate, scanMatches } from "./utils";
import { addSubmission, querySubmissions, querySubmissionsAndEmails, getEmail, addUser } from "../db/db";

dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT || 9000;
const cors = require('cors')

app.use(cors())

app.get("/", (req: Request, res: Response) => {
  res.send("Mickey's Express Server. Have a wonderful day!");
});

app.get("/table", (req: Request, res: Response) => {
  const submissions = querySubmissions();
  submissions.then((result) => {
    result.forEach((submission) => {
      submission.early_time = formatDate(new Date(submission.early_time));
      submission.late_time = formatDate(new Date(submission.late_time));
    });
    res.send(result);
  });
});

app.get("/email", (req: Request, res: Response) => {
  let param = req.query.user_id as string;
  const submissionPromise = getEmail(parseInt(param));
  submissionPromise.then((row) => {
    res.send(row);
  });
});

app.post("/submission", (req: Request, res: Response) => {
  //make sure that the body of the request has the data that we want
  //parse the body of the request and store as a Submission
  let submission: Submission = req.body;
  addSubmission(submission).then((result) => {
    console.log("Received: ", submission);

    const submissionsPromise = querySubmissionsAndEmails();
    submissionsPromise.then((submissions) => {
      const matches: Submission[] = scanMatches(submission, submissions);
      console.log("Matches: ", matches);
      res.send(matches);
    });

  });
});

app.post("/user", (req: Request, res: Response) => {
  let email = req.body.email;
  console.log("Received: ", email);

  const receipt = addUser(email);
  receipt.then((result) => {
    res.send(result);
    console.log(result);
  });
  
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export { app };