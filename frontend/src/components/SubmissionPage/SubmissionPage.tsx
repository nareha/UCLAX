import React from 'react';
import SubmissionField from '../SubmissionField/SubmissionField';

interface SubmissionValue {
  label: string,
  type: "datetime-local" | "text" | "number"
}

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
  },
];

const SubmissionPage: React.FC = () => {
  return (
    <div className="page">
        <p>Want to Share a Ride?</p>
        <p>Submit the following information to get your match</p>        
      <table>
        {submissionValues.map(({label, type}) => <SubmissionField label={label} type={type} />)}
      </table>
      <button>Submit</button>
    </div>
  );
}

export default SubmissionPage;
