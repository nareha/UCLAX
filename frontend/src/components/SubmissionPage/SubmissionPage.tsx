import React, { useState } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';
import { createTheme, ThemeProvider, Snackbar, Alert, AlertTitle, Typography, Button } from '@mui/material';

import { Location, Submission } from '../../structures';
import FailToast from '../FailToast/FailToast';
import './SubmissionPage.css';

const theme = createTheme({
  typography: {
    allVariants: {
      color: getComputedStyle(document.querySelector(':root')!).getPropertyValue('--text')
    },
    h2: {
      fontSize: 40,
      fontWeight: 500
    },
    button: {
      textTransform: 'none'
    }
  },
  palette: {
    primary: {
      main: getComputedStyle(document.querySelector(':root')!).getPropertyValue('--main')
    }
  }
});

//The accessKeyId, secretAccessKey, and sessionToken expire after 12 hours and must be re-retrieved from the AWS Access Portal.
AWS.config.update({
  apiVersion: "2010-12-01",
  accessKeyId: "",
  secretAccessKey: "",
  sessionToken: "",
  region: "us-east-2"
});

/**
 * The submission page component.
 * 
 * @component
 * @category Component
 */
const SubmissionPage: React.FC = () => {
  type FormErrors = Partial<Record<'interval' | 'missing_field' | "same_source_dest", string>>

  const [formData, setFormData] = useState({
    "interval_start": "",
    "interval_end": "",
    "source": "UCLA",
    "destination": "UCLA",
    "contact": "",
    "max_group_size": undefined
  });

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (formData.interval_start.length === 0 || formData.interval_end.length === 0 ) {
      errors.missing_field = "Missing required field. Required fields are earliest/latest time, source, destination, and contact."
    }
    if (Date.parse(formData.interval_start) > Date.parse(formData.interval_end)) {
      errors.interval = "Please enter a valid start and end time.";
    }
    if (!formData.contact) {
      errors.missing_field = "Missing required field. Required fields are earliest/latest time, source, destination, and contact.";
    }
    if (formData.source === formData.destination) {
      errors.same_source_dest = "Please select different trip start and end locations.";
    }
    return errors;
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log(formData);
    const formErrors: FormErrors = validateForm();
    if (formErrors.interval || formErrors.missing_field || formErrors.same_source_dest) {
      // Alert text set s.t. missing fields take precedent as error message
      if (formErrors.missing_field) {
        setAlertText(`${formErrors.missing_field}`);
      } else if (formErrors.interval) {
        setAlertText(`${formErrors.interval}`);
      } else {
        setAlertText(`${formErrors.same_source_dest}`);
      }
      setShowAlert(true);
      return;
    }
    const submission: Submission = {
      "userid": Number(localStorage.getItem("userId")),
      "interval_start": new Date(formData.interval_start),
      "interval_end": new Date(formData.interval_end),
      "source": formData.source as Location,
      "destination": formData.destination as Location,
      "contact": formData.contact,
      "max_group_size": formData.max_group_size
    };
    
    axios.post('http://localhost:9000/submission', submission)
    .then(response => {
      const matches = response.data;
      const matchingEmails: string[] = matches.map((user: {email: string}) => user.email);
      console.log(matchingEmails);
      axios.get('http://localhost:9000/email', {params: {user_id: String(submission.userid)} })
      .then(response => {
        let userEmail = response.data[0].email;
        let userContact = submission.contact;

        if(userEmail.length >= 10 && userEmail.substring(userEmail.length-10) === "g.ucla.edu"){
          userEmail = userEmail.substring(0, userEmail.length-10) + "ucla.edu";
        }

        let contactString = "";
        let matchNum = 1;

        matches.push({email: userEmail, contact: userContact});
        matches.forEach(function(match: { email: string; contact: string }){
          let emailBody = ""
          let currEmail = match.email;
          let currContact = match.contact;
          if(currEmail!==userEmail){
            contactString +=  "Contact " + matchNum.toString() + ": " + currContact + "\n";
            emailBody = "You have been matched with a user through UC LAX for a rideshare. Their contact info is " + userContact;
            matchNum += 1;
          }
          else{
            if(matchNum > 1){
              emailBody = "You have been matched with " + (matchNum-1).toString()+ " user(s) through UC LAX for a rideshare. Here are their contacts.\n" + contactString;
            }
            else{
              emailBody = "You have receieved no matches through UC LAX for a rideshare so far. We will notify you of matches in the future.";
            }
          }
          let emailInfo = {
            Destination: {
              CcAddresses: [
              ],
              ToAddresses: [
                currEmail
                //these must be verified emails in the AWS SES Portal.
              ],
            },
            Message: {
              Body: {
                Html: {
                  Charset: "UTF-8",
                  Data: emailBody, //text for the body of the email
                },
                Text: {
                  Charset: "UTF-8",
                  Data: "",
                },
              },
              Subject: {
                Charset: "UTF-8",
                Data: "UC LAX Match",
              },
            },
            //these must be verified emails in the AWS SES Portal.
            Source: "UCLAX130@gmail.com",
            ReplyToAddresses: [
              "UCLAX130@gmail.com",
            ],
          };
          var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
          .sendEmail(emailInfo)
          .promise();
        
          sendPromise
          .then(function (data) {
            console.log(data.MessageId);
          })
          .catch(function (err) {
            console.error(err, err.stack);
          });
        })
      })
      .catch(error => {
        console.error('Error retrieving user email:', error);
      });
    })
    .catch(error => {
      console.error('Error posting submission:', error);
    });
    
  };

  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  return (
    <>
      <FailToast alertType="Submission Error" showAlert={showAlert} failMessage={alertText} closeAlert={() => {setShowAlert(false)}} />
      <Snackbar
        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      >
        <Alert
          severity="success"
          onClose={() => setShowSuccess(false)}
        >
          <AlertTitle>Success</AlertTitle>
          Submission has been received.
        </Alert>
      </Snackbar>
      <div className="page">
        <ThemeProvider theme={theme}>
        <div className="text-region">
          <Typography variant="h2">
            Want to Share a Ride?
          </Typography>
          <Typography variant="subtitle1">
            Submit the following information to get your match.
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td><label>Earliest Time of Departure*:</label></td>
                <td>
                  <input
                  type="datetime-local"
                  name="interval_start"
                  value={formData.interval_start}
                  onChange={handleChange}
                  />
                </td> 
              </tr>
              <tr>
                <td><label>Latest Time of Departure*:</label></td>
                <td>
                  <input
                  type="datetime-local"
                  name="interval_end"
                  value={formData.interval_end}
                  onChange={handleChange}
                  />
                </td> 
              </tr>
              <tr>
                <td><label>Trip Start Location*:</label></td>
                <td>
                  <select name="source" onChange={handleChange}>
                    <option value="UCLA">UCLA</option>
                    <option value="LAX">LAX</option>
                    <option value="BUR">BUR</option>
                  </select>
                </td> 
              </tr>
              <tr>
                <td><label>Trip Destination*:</label></td>
                <td>
                  <select name="destination" onChange={handleChange}>
                    <option value="UCLA">UCLA</option>
                    <option value="LAX">LAX</option>
                    <option value="BUR">BUR</option>
                  </select>
                </td> 
              </tr>
              <tr>
                <td><label>Contact*:</label></td>
                <td>
                  <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  />
                </td> 
              </tr>
              <tr>
                <td><label>Maximum Party Capacity:</label></td>
                <td>
                  <input
                  type="number"
                  name="max_group_size"
                  value={formData.max_group_size}
                  onChange={handleChange}
                  />
                </td> 
              </tr>
            </tbody>
          </table>
          <Button variant="contained" type="submit">Submit</Button>
        </form>
        </ThemeProvider>
      </div>
    </>
  );
}

export default SubmissionPage;
