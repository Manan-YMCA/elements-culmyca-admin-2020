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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from "@material-ui/core/Avatar"

import { actions } from "../core/reducers/club"

import { serviceInstance } from "../core/utils/service"
import Table from '../component/Table'
import { IconButton } from "@material-ui/core";
import useSnackbar from "../hooks/useSnackbar";
import { useSnackbar as useSnackbarQ } from "notistack"
import * as yup from "yup";
import AddIcon from "@material-ui/icons/Add";
import UserIcon from "@material-ui/icons/Info"
import DeleteIcon from "@material-ui/icons/Delete"
import NoData from "@material-ui/icons/RemoveFromQueue"
import { useConfirmationDialog } from "../component/dialog";


const useStyle = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column"
    },
    textField: {
        margin: "5px",
    }
})


function Jsec({ open, handleClose, id }) {
    const{getConfirmation}=useConfirmationDialog()
    const { enqueueSnackbar } = useSnackbarQ()
    const [loading, setLoading] = React.useState(false);
    const [jsecs, setJsecs] = React.useState([])
    React.useEffect(() => {
        if (id && open) {
            setLoading(true);
            serviceInstance.get(`/admin/club/${id}`).then((data) => {
                setJsecs(data)
            }).catch(() => {
                enqueueSnackbar("Something went wrong!", {
                    variant: "error"
                })
                handleClose()
            }).finally(() => {
                setLoading(false)
            })
        }
    }, [id, enqueueSnackbar, setJsecs])
    const handleConfirm = React.useCallback((id) => {
        serviceInstance.delete(`/club/jsec/${id.userId}/${id.clubId}`).then(() => {
            enqueueSnackbar("Successfully removed jsec", {
                variant: "success"
            })
        }).catch(() => {
            enqueueSnackbar("Something went wrong!", {
                variant: "error"
            })
        }).finally(() => {

        })
    }, [enqueueSnackbar, handleClose])
    const handleDelete=React.useCallback((id)=>{
        handleClose()
        getConfirmation({
            title:"Remove Jsec from the club",
            body:"The jsec would be permanently removed from the club",
            confirmationAction:()=>handleConfirm(id)
        })
    },[getConfirmation,handleClose])
    return <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Jsecs</DialogTitle>
        <DialogContent>
            <DialogContentText>
                List Of jsecs for the Club
        </DialogContentText>
            {loading ? <div style={{ textAlign: "center" }}><CircularProgress /></div> : <List component="nav" aria-label="main mailbox folders">
                {jsecs.length == 0 ? <div style={{ textAlign: "center" }}><NoData /></div> : jsecs.map(val => {
                    const [del, user] = val;
                    return <ListItem button>
                        <ListItemAvatar ><Avatar /></ListItemAvatar>
                        <ListItemText primary={user.fullName} />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => handleDelete(del)}>  <DeleteIcon /></IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                })}
            </List>}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
  </Button>
            <Button onClick={() => { }} color="primary" >
                Submit
  </Button>
        </DialogActions>
    </Dialog>
}

function ClubForm({ formik }) {
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
            label="Tag Line"
            variant="outlined"
            name="tagLine"
            onChange={formik.handleChange}
            error={!!formik.errors.tagLine}
            helperText={formik.errors.tagLine}
            value={formik.values.tagLine} />
            <TextField
                className={classes.textField}
                label="Logo"
                variant="outlined"
                name="logo"
                onChange={formik.handleChange}
                error={!!formik.errors.logo}
                helperText={formik.errors.logo}
                value={formik.values.tagLine} />
                <TextField
                    className={classes.textField}
                    label="Image"
                    variant="outlined"
                    name="image"
                    onChange={formik.handleChange}
                    error={!!formik.errors.image}
                    helperText={formik.errors.image}
                    value={formik.values.tagLine} />
    </form>)

}

function ClubDialog({ open, handleClose, initialValues = {
    name: "",
    tagLine: "",
    logo:"",
    image:""
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
            tagLine: yup.string().required("tag must be provided"),
        })
    })
    const handleSubmit = React.useCallback(() => {
        serviceInstance.post("/admin/club", formik.values).then(() => {
            enqueueSnackbar("Successfully created club", {
                variant: "success"
            })
        }).catch(() => {
            enqueueSnackbar("Something went wrong!", {
                variant: "error"
            })
        }).finally(() => {
            dispatch(actions.getClub(serviceInstance.get(`/club?perPage=${10}&page=${0}`)))
            handleClose()
        })
    }, [enqueueSnackbar, dispatch, formik.values, handleClose])
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Club</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Add new Club to the system
                </DialogContentText>
                <ClubForm handleSubmit={() => { }} formik={formik} />
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
    const { data: { list, perPage, page, total }, loading, error } = useSelector((state) => state.clubReducer);
    useSnackbar(error);
    const [search, setSearch] = React.useState("");
    const [jsecOpen, setJsecOpen] = React.useState(false)
    const [open, setOpen] = React.useState(false);
    const [id, setId] = React.useState("")
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.getClub(serviceInstance.get(`/club?perPage=${perPage}&page=${page}`)))
    }, [dispatch, page, perPage])
    const onPerPageChange = React.useCallback((perPage) => {
        dispatch(actions.getClub(serviceInstance.get(`/club?perPage=${perPage}&page=${page}&term=${search}`)))
    }, [dispatch, page, search])
    const onPageChange = React.useCallback((page) => {
        dispatch(actions.getClub(serviceInstance.get(`/club?perPage=${perPage}&page=${page}&term=${search}`)))
    }, [dispatch, perPage, search])
    const onSearchChange = React.useCallback((term) => {
        setSearch(term ? term : "");
        dispatch(actions.getClub(serviceInstance.get(`/club?perPage=${perPage}&page=${page}&term=${term ? term : ""}`)))
    }, [dispatch, perPage, page])
    const onSearchClose = React.useCallback(() => {
        dispatch(actions.getClub(serviceInstance.get(`/club?perPage=${10}&page=${0}`)))
    }, [dispatch])

    const handleClose = React.useCallback(() => {
        setOpen(!open)
    }, [open, setOpen])
    const extraAction = () => <IconButton onClick={handleClose}> <AddIcon /></IconButton>
    const handleJsecOpen = React.useCallback((id) => {
        setId(id);
        setJsecOpen(!jsecOpen);
    }, [setJsecOpen, jsecOpen, setId])

    const renderAction = (id) => [<IconButton onClick={() => handleJsecOpen(id)}><UserIcon /></IconButton>]
    return <>
        <ClubDialog
            open={open}
            handleClose={handleClose}
        />
        <Jsec open={jsecOpen} handleClose={handleJsecOpen} id={id} />
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
            title="Clubs"
            columns={[
                { label: "Name", name: "name" },
                { label: "Tag Line", name: "tagLine" },
                { label: "Id", name: "id" },
                { label: "Users", name: "id", options: { customBodyRender: renderAction } }
            ]}
            extra={extraAction}
            list={list}
        /></>
}
