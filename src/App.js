import React from 'react';


import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"

import SideDrawer from "./component/SideBar"

import { actions } from "./core/reducers/whomi"
import { AdminSideBar, AdminRoutes, JsecRoutes, JsecSideBar } from "./routes";
import Login from './pages/login';
import { getAuthToken, serviceInstance, clearAuthToken } from './core/utils/service';
import useErrorSnackbar from './hooks/useSnackbar';


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  }
}));

function App() {
  const role = "Admin"
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isLogin, setLogin] = React.useState(!!getAuthToken())
  const dispatch = useDispatch()
  const { error, loading, data } = useSelector((state) => state.whomiReducer)
  useErrorSnackbar(error)
  React.useEffect(() => {
    if (isLogin || getAuthToken()) dispatch(actions.whomi(serviceInstance.get("/whomi")))
  }, [dispatch, isLogin])
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <div className={classes.root}>
      {isLogin ?
        <Router>
          <CssBaseline />
          <SideDrawer open={mobileOpen} handleDrawerToggle={handleDrawerToggle} sideMenu={data.find(val => val.role == "admin" || val.role === "brics") ? AdminSideBar : JsecSideBar} />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap className={classes.title}>
                {role}
              </Typography>
              <Button edge="end" color="inherit" onClick={() => { setLogin(false); clearAuthToken() }}>Logout</Button>
            </Toolbar>
          </AppBar>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {
              data.find(val => val.role == "admin") ?
                AdminRoutes.map(({ path, component, nested }) => <Route exact path={path} component={component} />)
                : data.find(val => val.role == "brics") ?
                  AdminRoutes.map(({ path, component, nested }) => <Route exact path={path} component={component} />) :
                  JsecRoutes.map(({ path, component, nested }) => <Route exact path={path} component={component} />)
            }
          </main>
        </Router> : <Login setLogin={setLogin} />}
    </div>
  );
}

export default App;
