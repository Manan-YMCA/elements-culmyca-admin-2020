import React from "react";
import { Paper, TextField, Button, makeStyles } from "@material-ui/core";
import Logo from "../logo.png";
import Manan from "../manan.png";
import { serviceInstance, setAuthToken } from "../core/utils/service";
import { useSnackbar } from "notistack";

const useStyle = makeStyles({
  logo: {
    width: "200px",
    margin:"auto"
  },
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    margin: "20vh auto"
  },
  outlined: {
    margin: "10px"
  },
  manan: {
    position: "fixed",
    bottom: 0,
    display:"flex",
    justifyContent:"center",
    width:"100%"
  },
  manan_text:{
      paddingTop:"10px"
  },
  manan_logo: {
    width: "50px"
  }
});
function Login({ setLogin }) {
  const classes = useStyle();
  const { enqueueSnackbar } = useSnackbar();
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const handleEmailChange = React.useCallback(
    e => {
      setEmail(e.target.value);
    },
    [setEmail]
  );
  const handlePasswordChange = React.useCallback(
    e => {
      setPassword(e.target.value);
    },
    [setPassword]
  );
  const handleSubmit = React.useCallback(() => {
    serviceInstance
      .post("/user/login", { email, password })
      .then(data => {
        setAuthToken(data.idToken);
        setLogin(true);
      })
      .catch(() => {
        enqueueSnackbar("Password or Email wrong", {
          variant: "error"
        });
      });
  }, [email, password]);
  return (
    <>
      <Paper className={classes.root}>
        <img src={Logo} className={classes.logo} />
        <TextField
          className={classes.outlined}
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={handleEmailChange}
        />
        <TextField
          className={classes.outlined}
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Login
        </Button>
      </Paper>
      <div className={classes.manan}>
        <div className={classes.manan_text}>Created by </div> <img src={Manan} className={classes.manan_logo} />
      </div>
    </>
  );
}

export default Login;
