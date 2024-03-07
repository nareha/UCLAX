import React, { useState } from 'react';
import axios from 'axios';

import './SubmissionPage.css';

const SubmissionPage: React.FC = () => {
  const [formData, setFormData] = useState({
    "early_time": "",
    "late_time": "",
    "source": "UCLA",
    "dest": "UCLA",
    "contact": "",
    "capacity": undefined
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log(formData);
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
                name="early_time"
                value={formData.early_time}
                onChange={handleChange}
                />
              </td> 
            </tr>
            <tr>
              <td><label>Latest Time of Arrival*:</label></td>
              <td>
                <input
                type="datetime-local"
                name="late_time"
                value={formData.late_time}
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
                <select name="dest" onChange={handleChange}>
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
                name="capacity"
                value={formData.capacity}
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
