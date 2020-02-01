import React from 'react';
import { Paper, TextField, Button, makeStyles } from '@material-ui/core';
import Logo from "../logo.png"
import { serviceInstance, setAuthToken } from '../core/utils/service';

const useStyle = makeStyles({
    logo: {
        width: "200px",
        height: "200px",
    },
    root: {
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        margin: "20vh auto"
    },
    outlined: {
        margin: "2px"
    }
})
function Login() {
    const classes = useStyle();
    const [password, setPassword] = React.useState("");
    const [email, setEmail] = React.useState("")
    const handleEmailChange = React.useCallback((e) => {
        setEmail(e.target.value)
    }, [setEmail])
    const handlePasswordChange = React.useCallback((e) => {
        setPassword(e.target.value)
    }, [setPassword])
    const handleSubmit = React.useCallback(() => {
        serviceInstance.post("/user/login", { email, password }).then((data) => {
            setAuthToken(data.idToken)
        })
    }, [email, password])
    return <>
        <Paper className={classes.root}>
            <img src={Logo} className={classes.logo} />
            <TextField className={classes.outlined} label="Email" variant="outlined" value={email} onChange={handleEmailChange} />
            <TextField className={classes.outlined} label="Password" variant="outlined" value={password} onChange={handlePasswordChange} />
            <Button variant="contained" onClick={handleSubmit}>Login</Button>
        </Paper>
    </>
}

export default Login