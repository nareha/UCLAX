import React from 'react';

import './SubmissionPage.css';

const SubmissionPage: React.FC = () => {
  return (
    <div className="center">
      <div className="title-logo">
        <p>Want to Share a Ride?</p>
      </div>
      <div className="description">
        <p>Submit the following information to get your match</p>        
        <table>
            <tr>
                <td><label> Earliest Time of Arrival*: </label></td>
                <td><input type="datetime-local" /> </td>
            </tr>
            <tr>
                <td><label> Latest Time of Arrival*: </label></td>
                <td><input type="datetime-local" /> </td>
            </tr>
            <tr>
                <td><label> Trip Start Location*: </label></td>
                <td><input type="text" /> </td>
            </tr>
            <tr>
                <td><label> Trip Destination*: </label></td>
                <td><input type="text" /> </td>
            </tr>
            <tr>
                <td><label> Preferred Contact Method*: </label></td>
                <td><input type="text" /> </td>
            </tr>
            <tr>
                <td><label> Maximum Party Capacity: </label></td>
                <td><input type="number" /> </td>
            </tr>
        </table>
      </div>
      <div className="submit">
        <button>Submit</button>
      </div> 
    </div>
  );
}

export default SubmissionPage;