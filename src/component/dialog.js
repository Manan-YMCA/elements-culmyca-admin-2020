import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';



const ConfirmationDialog= ({
  open,
  title,
  confirmationAction,
  onClose,
  children,
}) => {
  const handleConfirmation = React.useCallback(() => {
    confirmationAction();
    onClose();
  }, [onClose, confirmationAction]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="default">
          No
        </Button>
        <Button onClick={handleConfirmation} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DialogActionTypes={
  OpenDialog:'open',
  CloseDialog:'close',
}


const initialState = {
  open: false,
  title: '',
  body: '',
  confirmationAction: ()=>{}
};

function reducer(state, action){
  switch (action.type) {
    case DialogActionTypes.OpenDialog:
      return { open: true, ...action.payload };
    case DialogActionTypes.CloseDialog:
      return { ...state, open: false };
    default:
      return state;
  }
}

const ConfirmationDialogContext = React.createContext({ getConfirmation: ()=>{} });

export const ConfirmationDialogProvider= ({ children }) => {
  const [dialogState, dispatch] = React.useReducer(reducer, initialState);
  const closeDialog = React.useCallback(() => {
    dispatch({ type: DialogActionTypes.CloseDialog });
  }, [dispatch]);
  const openDialog = React.useCallback(
    (payload) => {
      dispatch({ type: DialogActionTypes.OpenDialog, payload });
    },
    [dispatch],
  );

  return (
    <ConfirmationDialogContext.Provider value={{ getConfirmation: openDialog }}>
      {children}
      <ConfirmationDialog
        open={dialogState.open}
        title={dialogState.title}
        onClose={closeDialog}
        confirmationAction={dialogState.confirmationAction}
      >
        {dialogState.body}
      </ConfirmationDialog>
    </ConfirmationDialogContext.Provider>
  );
};

export function useConfirmationDialog() {
  return React.useContext(ConfirmationDialogContext);
}
