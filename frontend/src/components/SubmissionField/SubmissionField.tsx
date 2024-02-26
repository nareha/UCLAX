import React from 'react';

export interface SubmissionValue {
  label: string;
  type: "datetime-local" | "text" | "number"
}

const SubmissionField: React.FC<SubmissionValue > = ({label, type}: SubmissionValue) => {
  return (
    <tr>
      <td><label>{label}</label></td>
      <td><input type={type}/></td>
    </tr>
  );
}

export default SubmissionField;
