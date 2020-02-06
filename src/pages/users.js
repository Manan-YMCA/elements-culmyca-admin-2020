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
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import NoData from "@material-ui/icons/RemoveFromQueue"


import { actions } from "../core/reducers/user"
import { actions as clubAction } from "../core/reducers/club"

import { serviceInstance } from "../core/utils/service"
import Table from '../component/Table'
import { IconButton, Divider } from "@material-ui/core";
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

function Roles({ open, handleClose, id, clubs = [] }) {
    const { enqueueSnackbar } = useSnackbarQ();
    const { getConfirmation } = useConfirmationDialog()
    const [loading, setLoading] = React.useState(false);
    const [roles, setRoles] = React.useState([])
    const renderClub = React.useMemo(() => {
        const roleObj = roles.reduce((acc, val) => (acc[val.clubId] = true, acc), {})
        return clubs.filter((val) => !roleObj[val.id])
    }, [roles, clubs])
    const getRole = React.useCallback(() => {
        setLoading(true);
        serviceInstance.get(`/admin/user/${id}`).then((data) => {
            setRoles(data)
        }).catch(() => {
            enqueueSnackbar("Something went wrong!", {
                variant: "error"
            })
            handleClose()
        }).finally(() => {
            setLoading(false)
        })
    }, [setLoading, id, setRoles, enqueueSnackbar, handleClose])
    React.useEffect(() => {
        if (id && open) {
            getRole(id)
        }
    }, [id, open])
    const handleConfirm = React.useCallback((role) => {
        if (role.clubId != 1) {
            serviceInstance.delete(`/club/jsec/${id}/${role.clubId}`).then(() => {
                enqueueSnackbar("Successfully removed jsec", {
                    variant: "success"
                })
            }).catch(() => {
                enqueueSnackbar("Something went wrong!", {
                    variant: "error"
                })
            }).finally(() => getRole(id))
        } else {
            serviceInstance.delete(`/admin/role/${role.clubName}/${id}`).then(() => {
                enqueueSnackbar("Successfully removed", {
                    variant: "success"
                })
            }).catch(() => {
                enqueueSnackbar("Something went wrong!", {
                    variant: "error"
                })
            }).finally(() => getRole(id))
        }
    }, [enqueueSnackbar, handleClose])
    const handleDelete = React.useCallback((id) => {
        getConfirmation({
            title: "Remove Jsec from the club",
            body: "The jsec would be permanently removed from the club",
            confirmationAction: () => handleConfirm(id)
        })
    }, [getConfirmation, handleClose, id])
    const convertToBricsOrAdmin = React.useCallback((type, id) => {
        getConfirmation({
            body: "Do you want to add the user to brics sub group?",
            title: "Added To Brics",
            confirmationAction: () => {
                serviceInstance.patch(`/admin/role/${type}/${id}`).then(() => {
                    enqueueSnackbar("Successfully added role to user", {
                        variant: "success"
                    })
                }).catch(() => {
                    enqueueSnackbar("Something went wrong", {
                        variant: "error"
                    })
                }).finally(() => getRole(id))
            }
        })
    }, [getConfirmation, enqueueSnackbar, id])
    const convertToJsec = React.useCallback((club, id) => {
        getConfirmation({
            body: "Do you want to add the user to brics sub group?",
            title: "Added To Brics",
            confirmationAction: () => {
                serviceInstance.post(`/club/jsec`, {
                    userId: id,
                    clubId: club
                }).then(() => {
                    enqueueSnackbar("Successfully added role to user", {
                        variant: "success"
                    })
                }).catch(() => {
                    enqueueSnackbar("Something went wrong", {
                        variant: "error"
                    })
                }).finally(() => getRole(id))
            }
        })
    }, [id, getConfirmation, enqueueSnackbar])
    return <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Jsecs</DialogTitle>
        <DialogContent>
            <DialogContentText>
                List Of Roles for user
        </DialogContentText>
            {loading ? <div style={{ textAlign: "center" }}><CircularProgress /></div> : <List component="nav" aria-label="main mailbox folders">
                {roles.length == 0 ? <div style={{ textAlign: "center" }}><NoData /></div> : roles.map((val, i) => {
                    return <ListItem button key={i}>
                        <ListItemText primary={val.clubName} />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => handleDelete(val)}>  <DeleteIcon /></IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                })}
                <Divider />
                {!roles.find((val) => val.clubName === "brics") ?
                    <ListItem>
                        <ListItemText primary={"Brixx"} />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => convertToBricsOrAdmin("brics", id)}>
                                <AddIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem> : ""}
                {!roles.find((val) => val.clubName === "admin") ?
                    <ListItem>
                        <ListItemText primary={"Admin"} />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => convertToBricsOrAdmin("admin", id)}>
                                <AddIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem> : ""}
                {!roles.find((val) => val.clubName === "jsec") ?
                    <ListItem>
                        <ListItemText primary={"Jsec"} />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => convertToBricsOrAdmin("jsec", id)}>
                                <AddIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem> : ""}
                {renderClub.map(val => <ListItem>
                    <ListItemText primary={val.name} />
                    <ListItemSecondaryAction>
                        <IconButton onClick={() => convertToJsec(val.id, id)}>
                            <AddIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>)}
            </List>
            }

        </DialogContent >
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
  </Button>

        </DialogActions>
    </Dialog >
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

export default function User() {
    const { data: { list, perPage, page, total }, loading, error } = useSelector((state) => state.userReducer);
    const { data: { list: clubList }, error: clubError } = useSelector((state) => state.clubReducer)
    const [roleOpen, setRoleOpen] = React.useState(false);
    useSnackbar(error);
    const [id, setId] = React.useState("");
    const [search, setSearch] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.getUser(serviceInstance.get(`/admin/user?perPage=${perPage}&page=${page}`)))
        dispatch(clubAction.getClub(serviceInstance.get("/club?perPage=100")))
    }, [dispatch, page, perPage])
    const onPerPageChange = React.useCallback((perPage) => {
        dispatch(actions.getUser(serviceInstance.get(`/admin/user?perPage=${perPage}&page=${page}&term=${search}`)))
    }, [dispatch, page, search])
    const onPageChange = React.useCallback((page) => {
        dispatch(actions.getUser(serviceInstance.get(`/admin/user?perPage=${perPage}&page=${page}&term=${search}`)))
    }, [dispatch, perPage, search])
    const onSearchChange = React.useCallback((term) => {
        setSearch(term ? term : "");
        dispatch(actions.getUser(serviceInstance.get(`/admin/user?perPage=${perPage}&page=${page}&term=${term ? term : ""}`)))
    }, [dispatch, perPage, page])
    const onSearchClose = React.useCallback(() => {
        dispatch(actions.getUser(serviceInstance.get(`/admin/user?perPage=${10}&page=${0}`)))
    }, [dispatch])
    const handleClose = React.useCallback(() => {
        setOpen(!open)
    }, [open, setOpen])
    const handleRoleClose = React.useCallback((id) => {
        setId(id)
        setRoleOpen(!roleOpen)
    }, [setRoleOpen, roleOpen])
    const renderYesNo = (val) => <div style={{ textAlign: "center" }}>{val ? <SmileIcons /> : <CrossIcons />}</div>
    const renderAction = (id, tableMetaData) => <><IconButton onClick={() => handleRoleClose(id)}><EditIcon></EditIcon></IconButton></>
    const extraAction = () => <IconButton onClick={handleClose}> <AddIcon /></IconButton>
    return <>
        <UserDialog
            open={open}
            handleClose={handleClose}
        />
        <Roles
            open={roleOpen}
            handleClose={handleRoleClose}
            id={id}
            clubs={clubList}
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
            list={list}
        /></>
}