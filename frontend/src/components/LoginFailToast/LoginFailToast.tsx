import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

interface Failure {
  showAlert: boolean;
  failMessage: string;
  closeAlert: () => void;
}

const LoginFailToast: React.FC<Failure> = ({showAlert, failMessage, closeAlert}: Failure) => {
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
        <AlertTitle>Login Error</AlertTitle>
        {failMessage}
      </Alert>
    </Snackbar>
  );
}

export default LoginFailToast;
