/**
 *UI used to display User Errors.
 *@module components/FailToast
 */
import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

/** Contains info about a failure. */
export interface Failure {
  /** Type of error, which is either login or submission */
  alertType: "Login Error" | "Submission Error";
  /** Determines whether to show the alert or not */
  showAlert: boolean;
  /** Message displayed for this failure */
  failMessage: string;
  /** Function to close the alert */
  closeAlert: () => void;
}

/** @ignore */
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
