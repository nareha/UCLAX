import React from 'react';

interface Props {
    label: string;
    type: string;
}

const SubmissionField: React.FC<Props> = ({ label, type }: Props) => {
  return (
    <tr>
      <td><label>{label}</label></td>
      <td><input type={type}/></td>
    </tr>
  );
}

export default SubmissionField;
