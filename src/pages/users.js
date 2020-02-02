import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux"
import Button from "@material-ui/core/Button"
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from "@material-ui/core/styles"
import { useFormik } from "formik"

import { actions } from "../core/reducers/user"

import { serviceInstance } from "../core/utils/service"
import Table from '../component/Table'
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import useSnackbar from "../hooks/useSnackbar";
import { useConfirmationDialog } from "../component/dialog"
import { useSnackbar as useSnackbarQ } from "notistack"
import * as yup from "yup";
import AddIcon from "@material-ui/icons/Add";
import SmileIcons from "@material-ui/icons/VerifiedUser"
import CrossIcons from "@material-ui/icons/Cancel"


const useStyle = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column"
    },
    textField: {
        margin: "5px",
    }
})

function SponsorForm({ formik }) {
    const classes = useStyle()
    return (<form onSubmit={formik.handleSubmit} className={classes.root}>
        <TextField
            className={classes.textField}
            label="Name"
            variant="outlined"
            name="name"
            onChange={formik.handleChange}
            error={!!formik.errors.name}
            helperText={formik.errors.name}
            value={formik.values.name} />
        <TextField
            className={classes.textField}
            label="Type"
            variant="outlined"
            name="sponsorType"
            onChange={formik.handleChange}
            error={!!formik.errors.sponsorType}
            helperText={formik.errors.sponsorType}
            value={formik.values.sponsorType} />
        <TextField
            className={classes.textField}
            label="Tag Line"
            variant="outlined"
            name="tagLine"
            onChange={formik.handleChange}
            error={!!formik.errors.tagLine}
            helperText={formik.errors.tagLine}
            value={formik.values.tagLine} />
        <TextField
            className={classes.textField}
            label="Logo Url"
            variant="outlined"
            name="logoUrl"
            onChange={formik.handleChange}
            error={!!formik.errors.logoUrl}
            helperText={formik.errors.logoUrl}
            value={formik.values.logoUrl} />
        <TextField
            className={classes.textField}
            label="Website Url"
            variant="outlined"
            name="websiteUrl"
            onChange={formik.handleChange}
            error={!!formik.errors.websiteUrl}
            helperText={formik.errors.websiteUrl}
            value={formik.values.websiteUrl} />
    </form>)

}

function SponsorDialog({ open, handleClose, title, edit, initialValues = {
    name: "",
    logoUrl: '',
    websiteUrl: '',
    sponsorType: "",
    tagLine: ""
} }) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbarQ();
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: yup.object({
            name: yup.string()
                .max(30, "Must be less than 30")
                .min(3, "Must be greater than 3")
                .required("Name must be provided"),
            sponsorType: yup.string().required("Sponsor type must be provided"),
            tagLine: yup.string().required("tag must be provided"),
            logoUrl: yup.string().url("logo url must be provided").required("logo url is required"),
            websiteUrl: yup.string().url("website url must be provided").required("website url is required"),
        })
    })
    React.useEffect(() => {
        formik.setValues(initialValues)
    }, [initialValues])
    const handleSubmit = React.useCallback(() => {
        if (edit) {
            serviceInstance.patch(`/brics/sponsor/${initialValues.id}`, formik.values).then(() => {
                enqueueSnackbar("Successfully updated sponsors", {
                    variant: "success"
                })
            }).catch(() => {
                enqueueSnackbar("Something went wrong!", {
                    variant: "error"
                })
            }).finally(() => {
                dispatch(actions.getSponsor(serviceInstance.get(`/sponsor?perPage=${10}&page=${0}`)))
                handleClose()
            })
        }
        else {
            serviceInstance.post("/brics/sponsor", formik.values).then(() => {
                enqueueSnackbar("Successfully created sponsors", {
                    variant: "success"
                })
            }).catch(() => {
                enqueueSnackbar("Something went wrong!", {
                    variant: "error"
                })
            }).finally(() => {
                dispatch(actions.getSponsor(serviceInstance.get(`/sponsor?perPage=${10}&page=${0}`)))
                handleClose()
            })
        }
    }, [edit, enqueueSnackbar, dispatch, formik.values, initialValues.id, handleClose])
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Sponsor</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {edit ? "Edit sponsor details for various event in the system" : "Create New Sponsor for various event in the system"}
                </DialogContentText>
                <SponsorForm handleSubmit={() => { }} formik={formik} />
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

export default function User() {
    const { data: { list, perPage, page, total }, loading, error } = useSelector((state) => state.userReducer);
    useSnackbar(error);
    const [initialValues, setIntialValue] = React.useState({
        name: "",
        logoUrl: '',
        websiteUrl: '',
        sponsorType: "",
        tagLine: ""
    })
    const renderedList = React.useMemo(() => list.map((val) => val[0]), [list])
    const { enqueueSnackbar } = useSnackbarQ();
    const { getConfirmation } = useConfirmationDialog();
    const [search, setSearch] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.getUser(serviceInstance.get(`/admin/user?perPage=${perPage}&page=${page}`)))
    }, [dispatch, page, perPage])
    const onPerPageChange = React.useCallback((perPage) => {
        dispatch(actions.getUser(serviceInstance.get(`/admin/user?perPage=${perPage}&page=${page}&search=${search}`)))
    }, [dispatch, page, search])
    const onPageChange = React.useCallback((page) => {
        dispatch(actions.getUser(serviceInstance.get(`/admin/user?perPage=${perPage}&page=${page}&search=${search}`)))
    }, [dispatch, perPage, search])
    const onSearchChange = React.useCallback((term) => {
        setSearch(term ? term : "");
        dispatch(actions.getUser(serviceInstance.get(`/admin/user?perPage=${perPage}&page=${page}&search=${term ? term : ""}`)))
    }, [dispatch, perPage, page])
    const onSearchClose = React.useCallback(() => {
        dispatch(actions.getUser(serviceInstance.get(`/admin/user?perPage=${10}&page=${0}`)))
    }, [dispatch])

    const handleClose = React.useCallback(() => {
        setOpen(!open)
    }, [open, setOpen])

    const renderYesNo = (val) => <div style={{ textAlign: "center" }}>{val ? <SmileIcons /> : <CrossIcons />}</div>
    const handleDelete = React.useCallback((id) => {
        serviceInstance.delete(`brics/sponsor/${id}`).then(() => {
            enqueueSnackbar("SucessFully deleted sponsor", {
                variant: "success"
            })
        }).catch((error) => {
            enqueueSnackbar("Something went wrong!", {
                variant: "error"
            })
        }).finally(() => {
            dispatch(actions.getSponsor(serviceInstance.get(`/sponsor?perPage=${10}&page=${0}`)))
        })
    }, [enqueueSnackbar, dispatch]);

    const handleEditClick = React.useCallback((val) => {
        setEdit(true)
        handleClose();
        setIntialValue(val);
    }, [setEdit, handleClose, setIntialValue])

    const handleNewClick = React.useCallback(() => {
        setEdit(false);
        handleClose();
        setIntialValue({
            name: "",
            logoUrl: '',
            websiteUrl: '',
            sponsorType: "",
            tagLine: ""
        })
    }, [setIntialValue, handleClose, setEdit])

    const renderAction = (id, tableMetaData) => <><IconButton onClick={() => getConfirmation({
        title: 'Delete sponsor',
        body: 'Are your sure you want to delete sponsor?',
        confirmationAction: () => handleDelete(id),

    })}><DeleteIcon /></IconButton><IconButton onClick={() => handleEditClick(list[tableMetaData.rowIndex])} ><EditIcon /></IconButton></>
    const extraAction = () => <IconButton onClick={handleNewClick}> <AddIcon /></IconButton>
    return <>
        <SponsorDialog
            open={open}
            handleClose={handleClose}
            title="Create New Sponsor for various event in the system"
            initialValues={initialValues}
            edit={edit}
        />
        <Table
            onSearchClose={onSearchClose}
            searchText={search}
            onSearchChange={onSearchChange}
            page={page}
            search={search}
            total={total}
            perPage={perPage}
            onPageChange={onPageChange}
            onPerPageChange={onPerPageChange}
            loading={loading}
            title="User"
            columns={[
                { label: "Name", name: "fullName" },
                { label: "Phone", name: "phone" },
                { label: "Email", name: "email" },
                { label: "Phone Verified", name: "phoneVerified", options: { customBodyRender: renderYesNo } },
                { label: "Email Verified", name: "emailVerified", options: { customBodyRender: renderYesNo } },
                { label: "Action", name: "id", options: { customBodyRender: renderAction } }
            ]}
            extra={extraAction}
            list={renderedList}
        /></>
}