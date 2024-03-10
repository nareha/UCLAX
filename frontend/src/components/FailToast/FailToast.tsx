import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

interface Failure {
  alertType: "Login Error" | "Submission Error";
  showAlert: boolean;
  failMessage: string;
  closeAlert: () => void;
}

const FailToast: React.FC<Failure> = ({alertType, showAlert, failMessage, closeAlert}: Failure) => {
  return (
    <Snackbar
      anchorOrigin={{vertical: "bottom", horizontal: "right"}}
      open={showAlert}
      onClose={closeAlert}
    >
      <Alert
        severity="error"
        onClose={closeAlert}
      >
        <AlertTitle>{alertType}</AlertTitle>
        {failMessage}
      </Alert>
    </Snackbar>
  );
}

export default FailToast;
