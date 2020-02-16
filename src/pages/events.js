import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux"

import { actions } from "../core/reducers/event"

import { serviceInstance } from "../core/utils/service"
import Table from '../component/Table'
import Button from "@material-ui/core/Button"
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from "@material-ui/core/styles"
import { useFormik } from "formik"
import useSnackbar from "../hooks/useSnackbar";
import { useConfirmationDialog } from "../component/dialog"
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import AddIcon from "@material-ui/icons/Add";
import { useSnackbar as useSnackbarQ } from "notistack"
import * as yup from "yup";


const useStyle = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column"
    },
    textField: {
        margin: "5px",
    }
})

function UserDialog({ open, handleClose }) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbarQ();
    const formik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
            lastName: "",
            photoUrl: ""
        },
        validationSchema: yup.object({
            fullName: yup.string()
                .max(30, "Must be less than 30")
                .min(3, "Must be greater than 3")
                .required("Name must be provided"),
            email: yup.string().email().required("email must be provided"),
            phone: yup.string().length(12, "Length must be greater than 12(91+phone number)").required("phone must be provided"),
            lastName: yup.string().required("last name is required"),
            password: yup.string().length(8, "Length must be greater than 8").required("password is required"),
            photoUrl: yup.string().url("photourl is required").required("photourl is required")
        })
    })
    const handleSubmit = React.useCallback(() => {
        serviceInstance.post("/user/register", formik.values).then(() => {
            enqueueSnackbar("Successfully created Users", {
                variant: "success"
            })
        }).catch(() => {
            enqueueSnackbar("Something went wrong!", {
                variant: "error"
            })
        }).finally(() => {
            dispatch(actions.getUser(serviceInstance.get(`/admin/user?perPage=${10}&page=${0}`)))
            handleClose()
        })
    }, [enqueueSnackbar, dispatch, formik.values, handleClose])
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">User</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {"Create New User for various event in the system"}
                </DialogContentText>
                <UserForm handleSubmit={() => { }} formik={formik} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
          </Button>
                <Button onClick={() => handleSubmit()} color="primary" disabled={!formik.isValid} >
                    Submit
          </Button>
            </DialogActions>
        </Dialog>
    )
}

function UserForm({ formik }) {
    const classes = useStyle()
    return (<form onSubmit={formik.handleSubmit} className={classes.root}>
        <TextField
            className={classes.textField}
            label="Name"
            variant="outlined"
            name="fullName"
            onChange={formik.handleChange}
            error={!!formik.errors.fullName}
            helperText={formik.errors.fullName}
            value={formik.values.fullName} />
        <TextField
            className={classes.textField}
            label="Email"
            variant="outlined"
            name="email"
            onChange={formik.handleChange}
            error={!!formik.errors.email}
            helperText={formik.errors.email}
            value={formik.values.email} />
        <TextField
            className={classes.textField}
            label="Phone"
            variant="outlined"
            name="phone"
            onChange={formik.handleChange}
            error={!!formik.errors.phone}
            helperText={formik.errors.phone}
            value={formik.values.phone} />
        <TextField
            className={classes.textField}
            label="Password"
            variant="outlined"
            name="password"
            onChange={formik.handleChange}
            error={!!formik.errors.password}
            helperText={formik.errors.password}
            value={formik.values.password} />
        <TextField
            className={classes.textField}
            label="Avatar"
            variant="outlined"
            name="photoUrl"
            onChange={formik.handleChange}
            error={!!formik.errors.photoUrl}
            helperText={formik.errors.photoUrl}
            value={formik.values.photoUrl}
        />
        <TextField
            className={classes.textField}
            label="Last Name"
            variant="outlined"
            name="lastName"
            onChange={formik.handleChange}
            error={!!formik.errors.lastName}
            helperText={formik.errors.lastName}
            value={formik.values.lastName}
        />
    </form>)

}

export default function User() {
    const { getConfirmation } = useConfirmationDialog();
    const { data: roles, error: RoleError } = useSelector((state => state.whomiReducer))
    useSnackbar(RoleError)
    const { data: { list, perPage, page, total }, loading, error } = useSelector((state) => state.eventReducer);
    useSnackbar(error);
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.getEvents(serviceInstance.get(`/event?perPage=${perPage}&page=${page}`)))
    }, [dispatch, page, perPage])
    const onPerPageChange = React.useCallback((perPage) => {
        dispatch(actions.getEvents(serviceInstance.get(`/event?perPage=${perPage}&page=${page}`)))
    }, [dispatch, page])
    const onPageChange = React.useCallback((page) => {
        dispatch(actions.getEvents(serviceInstance.get(`/event?perPage=${perPage}&page=${page}`)))
    }, [dispatch, perPage])
    const renderList = React.useMemo(() => {
        return list.map((val) => {
            const [sel, org, club] = val
            return {
                event: sel.title,
                fee: sel.fee,
                organisedBy: club.name,
                value: sel.value,
                date: sel.eventTime,
                contact: `${org.fullName}-(${org.phone})`
            }
        })
    }, [list])
    const handleClose = React.useCallback(() => setOpen(!open), [open, setOpen])
    const renderAction = (id, tableMetaData) => <><IconButton onClick={() => getConfirmation({
        title: 'Delete sponsor',
        body: 'Are your sure you want to delete sponsor?',
        confirmationAction: () => { },

    })}><DeleteIcon /></IconButton><IconButton onClick={() => { }} ><EditIcon /></IconButton></>
    const extraAction = () => <IconButton onClick={handleClose}> <AddIcon /></IconButton>
    return <>
        <UserDialog open={open} handleClose={handleClose} />
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
                { label: "Action", name: "id", options: { customBodyRender: renderAction } }
            ]}
            list={renderList}
            extra={extraAction}
        /></>
}