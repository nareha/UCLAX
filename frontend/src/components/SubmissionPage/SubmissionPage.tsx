import React from 'react';
import SubmissionField , { SubmissionValue } from '../SubmissionField/SubmissionField';
import AWS from 'aws-sdk';

import './SubmissionPage.css';

//The accessKeyId, secretAccessKey, and sessionToken expire after 12 hours and must be re-retrieved from the AWS Access Portal.
AWS.config.update({
  apiVersion: "2010-12-01",
  accessKeyId: "",
  secretAccessKey: "",
  sessionToken: "",
  region: "us-east-2"
});

const submissionValues: Array<SubmissionValue> = [
  {
    label: "Earliest Time of Arrival*:",
    type: "datetime-local"
  },
  {
    label: "Latest Time of Arrival*:",
    type: "datetime-local"
  },
  {
    label: "Trip Start Location*:",
    type: "text"
  },
  {
    label: "Trip Destination*:",
    type: "text"
  },
  {
    label: "Preferred Contact Method*:",
    type: "text"
  },
  {
    label: "Maximum Party Capacity:",
    type: "number"
  }
];

const submitInfo = () => {
  var params = {
    Destination: {
      CcAddresses: [
      ],
      ToAddresses: [
        //these must be verified emails in the AWS SES Portal.
        "stevenz123@ucla.edu",
        "UCLAX130@gmail.com"
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "You have been matched with user abc@gmail.com through UCLAX for a ridshare. Please contact them if you'd like to set up plans.", //text for the body of the email
        },
        Text: {
          Charset: "UTF-8",
          Data: "",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "UCLAX Match",
      },
    },
    //these must be verified emails in the AWS SES Portal.
    Source: "UCLAX130@gmail.com",
    ReplyToAddresses: [
      "UCLAX130@gmail.com",
    ],
  };

  var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
  .sendEmail(params)
  .promise();

  sendPromise
  .then(function (data) {
    console.log(data.MessageId);
  })
  .catch(function (err) {
    console.error(err, err.stack);
  });
}
const SubmissionPage: React.FC = () => {
  return (
    <div className="page">
      <div className="text">
        <p className="title-text">Want to Share a Ride?</p>
        <p>Submit the following information to get your match.</p>        
      </div>
      <table>
        {submissionValues.map(({label, type}) => <SubmissionField label={label} type={type} />)}
      </table>
      <button onClick={submitInfo}>Submit</button>
    </div>
  );
}

export default SubmissionPage;
