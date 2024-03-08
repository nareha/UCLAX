import React, { useState } from 'react';
import axios from 'axios';

import { Location, Submission } from '../../structures';
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

const postSubmission = (submissionData: Submission) => {
  axios.post('http://localhost:9000/submission', submissionData)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error posting submission:', error);
    });
}

const SubmissionPage: React.FC = () => {
  type FormErrors = Partial<Record<'interval' | 'missing_field', string>>

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
    if (Date.parse(formData.interval_start) > Date.parse(formData.interval_end)) {
      errors.interval = "Please enter a valid start and end time.";
    }
    if (!formData.contact) {
      errors.missing_field = "Missing required field. Required fields are earliest/latest time, source, destination, and contact."
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
    if (formErrors.interval || formErrors.missing_field) {
      console.log("Please fix your errors", formErrors);
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
    postSubmission(submission);
  };

  return (
    <div className="page">
      <div className="text">
        <p className="title-text">Want to Share a Ride?</p>
        <p>Submit the following information to get your match.</p>        
      </div>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><label>Earliest Time of Arrival*:</label></td>
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
              <td><label>Latest Time of Arrival*:</label></td>
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
              <td><label>Contact:</label></td>
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SubmissionPage;
