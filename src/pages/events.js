import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { actions } from "../core/reducers/event";

import { serviceInstance } from "../core/utils/service";
import Table from "../component/Table";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import useSnackbar from "../hooks/useSnackbar";
import { useConfirmationDialog } from "../component/dialog";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import { useSnackbar as useSnackbarQ } from "notistack";
import * as yup from "yup";

const useStyle = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column"
  },
  textField: {
    margin: "5px"
  }
});
const initialValues = {
  title: "",
  fPrize: 0,
  sPrize: 0,
  tPrize: 0,
  photoUrl: "",
  description: "",
  fee: 0,
  eventTime: "00:00:00",
  eventDate: new Date(),
  eventDuration: 0,
  genre: "",
  venue: "",
  images: "",
  rules: ""
};
function UserDialog({ open, handleClose, init, edit = false, handleEdit }) {
  const dispatch = useDispatch();
  const [val, setVal] = React.useState(initialValues);
  const { enqueueSnackbar } = useSnackbarQ();
  React.useEffect(() => {
    if (edit) {
      const edited = {
        ...init,
        eventTime: init.eventTime ? init.eventTime.split("T")[1] : "00:00:00"
      };
      formik.setValues(edited);
    } else {
      formik.setValues(initialValues);
    }
  }, [init]);
  const formik = useFormik({
    initialValues: edit ? val : initialValues,
    validationSchema: yup.object({
      title: yup.string().required(),
      fPrize: yup
        .number()
        .label("first prize")
        .positive()
        .moreThan(-1)
        .required(),
      sPrize: yup
        .number()
        .positive()
        .label("second prize")
        .moreThan(-1)
        .required(),
      tPrize: yup
        .number()
        .positive()
        .label("third prize")
        .moreThan(-1)
        .required(),
      photoUrl: yup
        .string()
        .url()
        .label("photo url")
        .required(),
      description: yup.string().required(),
      fee: yup
        .number()
        .positive()
        .moreThan(-1)
        .required(),
      eventTime: yup
        .string()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .required(),
      eventDate: yup
        .date()
        .label("time")
        .min(new Date())
        .required(),
      eventDuration: yup
        .number()
        .positive()
        .moreThan(-1)
        .required(),
      genre: yup.string().required(),
      venue: yup.string().required(),
      images: yup
        .string()
        .url()
        .required(),
      rules: yup.string().required()
    })
  });
  const handleSubmit = React.useCallback(() => {
    let { eventDate, eventTime } = formik.values;
    const values = {
      ...formik.values,
      eventDate: `${eventDate}T00:00:00`,
      eventTime: `${eventDate}T${eventTime}`
    };
    if (!edit) {
      serviceInstance
        .post("/club/event", values)
        .then(() => {
          enqueueSnackbar("Successfully created event", {
            variant: "success"
          });
        })
        .catch(() => {
          enqueueSnackbar("Something went wrong!", {
            variant: "error"
          });
        })
        .finally(() => {
          handleEdit(false);
          dispatch(
            actions.getEvents(
              serviceInstance.get(`/event?perPage=${10}&page=${0}`)
            )
          );
        });
    } else {
      serviceInstance
        .patch(`/club/event/${init.id}`, values)
        .then(() => {
          enqueueSnackbar("Successfully updated event", {
            variant: "success"
          });
        })
        .catch(() => {
          enqueueSnackbar("Something went wrong!", {
            variant: "error"
          });
        })
        .finally(() => {
          handleEdit(false);
          formik.setValues(initialValues);
          dispatch(
            actions.getEvents(
              serviceInstance.get(`/event?perPage=${10}&page=${0}`)
            )
          );
        });
    }
    handleClose();
  }, [enqueueSnackbar, dispatch, formik.values, handleClose]);

  const editClose = () => {
    handleClose();
    handleEdit(false);
    formik.setValues(initialValues);
  };
  return (
    <Dialog open={open} onClose={editClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Event</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {"Create New User for various event in the system"}
        </DialogContentText>
        <UserForm handleSubmit={() => {}} formik={formik} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit()}
          color="primary"
          disabled={!formik.isValid}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function UserForm({ formik }) {
  const classes = useStyle();
  return (
    <form onSubmit={formik.handleSubmit} className={classes.root}>
      <TextField
        className={classes.textField}
        label="Title"
        variant="outlined"
        name="title"
        onChange={formik.handleChange}
        error={!!formik.errors.title}
        helperText={formik.errors.title}
        value={formik.values.title}
      />
      <TextField
        className={classes.textField}
        label="First Prize"
        variant="outlined"
        name="fPrize"
        type="number"
        onChange={formik.handleChange}
        error={!!formik.errors.fPrize}
        helperText={formik.errors.fPrize}
        value={formik.values.fPrize}
      />
      <TextField
        className={classes.textField}
        label="Second Prize"
        variant="outlined"
        name="sPrize"
        type="number"
        onChange={formik.handleChange}
        error={!!formik.errors.sPrize}
        helperText={formik.errors.sPrize}
        value={formik.values.sPrize}
      />
      <TextField
        className={classes.textField}
        label="Third Prize"
        variant="outlined"
        name="tPrize"
        type="number"
        onChange={formik.handleChange}
        error={!!formik.errors.tPrize}
        helperText={formik.errors.tPrize}
        value={formik.values.tPrize}
      />
      <TextField
        className={classes.textField}
        label="Photo"
        variant="outlined"
        name="photoUrl"
        onChange={formik.handleChange}
        error={!!formik.errors.photoUrl}
        helperText={formik.errors.photoUrl}
        value={formik.values.photoUrl}
      />
      <TextField
        multiline
        className={classes.textField}
        label="Description"
        variant="outlined"
        name="description"
        onChange={formik.handleChange}
        error={!!formik.errors.description}
        helperText={formik.errors.description}
        value={formik.values.description}
      />
      <TextField
        multiline
        className={classes.textField}
        label="Rules"
        variant="outlined"
        name="rules"
        onChange={formik.handleChange}
        error={!!formik.errors.rules}
        helperText={formik.errors.rules}
        value={formik.values.rules}
      />
      <TextField
        className={classes.textField}
        label="Fee"
        variant="outlined"
        name="fee"
        type="number"
        onChange={formik.handleChange}
        error={!!formik.errors.fee}
        helperText={formik.errors.fee}
        value={formik.values.fee}
      />
      <TextField
        className={classes.textField}
        label="Date"
        variant="outlined"
        name="eventDate"
        type="date"
        onChange={formik.handleChange}
        error={!!formik.errors.eventDate}
        helperText={formik.errors.eventDate}
        value={formik.values.eventDate}
      />
      <TextField
        className={classes.textField}
        label="Time"
        variant="outlined"
        name="eventTime"
        onChange={formik.handleChange}
        error={!!formik.errors.eventTime}
        helperText={formik.errors.eventTime}
        value={formik.values.eventTime}
      />
      <TextField
        className={classes.textField}
        label="Duration in Mins"
        variant="outlined"
        name="eventDuration"
        type="number"
        onChange={formik.handleChange}
        error={!!formik.errors.eventDuration}
        helperText={formik.errors.eventDuration}
        value={formik.values.eventDuration}
      />
      <TextField
        className={classes.textField}
        label="Venue"
        variant="outlined"
        name="venue"
        onChange={formik.handleChange}
        error={!!formik.errors.venue}
        helperText={formik.errors.venue}
        value={formik.values.venue}
      />
      <TextField
        className={classes.textField}
        label="Additional Image"
        variant="outlined"
        name="images"
        onChange={formik.handleChange}
        error={!!formik.errors.images}
        helperText={formik.errors.images}
        value={formik.values.images}
      />
      <TextField
        className={classes.textField}
        label="Genre"
        variant="outlined"
        name="genre"
        onChange={formik.handleChange}
        error={!!formik.errors.genre}
        helperText={formik.errors.genre}
        value={formik.values.genre}
      />
    </form>
  );
}

export default function User() {
  const { getConfirmation } = useConfirmationDialog();
  const { enqueueSnackbar } = useSnackbarQ();
  const {
    data: { list, perPage, page, total },
    loading,
    error
  } = useSelector(state => state.eventReducer);
  useSnackbar(error);
  const [selectedEvent, setSelectedEvent] = React.useState(initialValues);
  const [isEdit, setEdit] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      actions.getEvents(
        serviceInstance.get(`/event?perPage=${perPage}&page=${page}`)
      )
    );
  }, [dispatch, page, perPage]);
  const onPerPageChange = React.useCallback(
    perPage => {
      dispatch(
        actions.getEvents(
          serviceInstance.get(`/event?perPage=${perPage}&page=${page}`)
        )
      );
    },
    [dispatch, page]
  );
  const onPageChange = React.useCallback(
    page => {
      dispatch(
        actions.getEvents(
          serviceInstance.get(`/event?perPage=${perPage}&page=${page}`)
        )
      );
    },
    [dispatch, perPage]
  );
  const renderList = React.useMemo(() => {
    return list.map(val => {
      const [sel, org, club] = val;
      return {
        event: sel.title,
        fee: sel.fee,
        organisedBy: club.name,
        value: sel.value,
        date: sel.eventTime,
        contact: `${org.fullName}-(${org.phone})`,
        id: sel.id
      };
    });
  }, [list]);

  const handleDelete = React.useCallback(
    id => {
      serviceInstance
        .delete(`/club/event/${id}`)
        .then(() => {
          enqueueSnackbar("Successfully removed event", {
            variant: "success"
          });
          dispatch(
            actions.getEvents(
              serviceInstance.get(`/event?perPage=${10}&page=${0}`)
            )
          );
        })
        .catch(() => {
          enqueueSnackbar("Something went wrong!", {
            variant: "error"
          });
        })
        .finally(() => {});
    },
    [enqueueSnackbar]
  );
  const handleClose = React.useCallback(() => setOpen(!open), [open, setOpen]);
  const handleEdit = React.useCallback(ed => setEdit(ed), [setEdit]);
  const renderAction = (id, tableMetaData) => (
    <>
      <IconButton
        onClick={() =>
          getConfirmation({
            title: "Delete Event",
            body: "Are your sure you want to delete event?",
            confirmationAction: () => handleDelete(id)
          })
        }
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          setEdit(true);
          setOpen(true);
          setSelectedEvent(list[tableMetaData.rowIndex][0]);
        }}
      >
        <EditIcon />
      </IconButton>
    </>
  );

  const handleNew = () => {
    handleClose();
    setSelectedEvent(initialValues);
  };
  const extraAction = () => (
    <IconButton onClick={handleClose}>
      {" "}
      <AddIcon />
    </IconButton>
  );
  return (
    <>
      <UserDialog
        open={open}
        handleClose={handleNew}
        edit={isEdit}
        init={selectedEvent}
        handleEdit={handleEdit}
      />
      <Table
        page={page}
        total={total}
        perPage={perPage}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
        loading={loading}
        title="Events"
        columns={[
          { label: "Event", name: "event" },
          { label: "Club", name: "organisedBy" },
          { label: "Amount", name: "fee" },
          { label: "Date", name: "event" },
          { lable: "Contact", name: "contact" },
          {
            label: "Action",
            name: "id",
            options: { customBodyRender: renderAction }
          }
        ]}
        list={renderList}
        extra={extraAction}
      />
    </>
  );
}
