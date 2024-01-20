import {
    AppBar,
    Box,
    Button,
    Divider, Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon, ListItemText,
    Toolbar,
    Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {Home} from "@mui/icons-material";
import {useState} from "react";
import SensorsIcon from "@mui/icons-material/Sensors";
import {Link} from "react-router-dom";

const drawWidth = 220;

const responsiveDrawer = (
    <Box
        bgcolor="primary.main"
        style={{
            height: "100%"
        }}>
        <Toolbar/>
        <Divider/>
        <List sx={{backgroundColor: "primary.main"}}>
            <Link style={{textDecoration: "none"}} to={"/"}>
                <ListItemButton sx={{color: "white"}}>
                    <ListItemIcon sx={{color: "white"}}>
                        {<Home/>}
                    </ListItemIcon>
                    <ListItemText primary={"Homepage"}/>
                </ListItemButton>
            </Link>
            <Link style={{textDecoration: "none"}} to={"/sensors"}>
                <ListItemButton sx={{color: "white"}}>
                    <ListItemIcon sx={{color: "white"}}>
                        {<SensorsIcon/>}
                    </ListItemIcon>
                    <ListItemText primary={"Sensors"}/>
                </ListItemButton>
            </Link>
        </List>
    </Box>
);
const NavBar = ({currentPageTitle, isLogged, loginClick}: {
    currentPageTitle: string,
    isLogged: boolean,
    loginClick: any
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <div>
            <Box sx={{display: 'flex'}}>
                <AppBar
                    position="fixed"
                    sx={{
                        ml: {sm: `${drawWidth}px`},
                    }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleToggle}
                            sx={{mr: 2}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            {currentPageTitle}
                        </Typography>
                        <Button color="inherit" onClick={loginClick}>{isLogged ? "Logout" : "Login"}</Button>
                    </Toolbar>
                </AppBar>
                <Box
                    component="nav"
                    sx={{
                        width: {sm: drawWidth},
                        flexShrink: {sm: 0}
                    }}
                >
                    <Drawer
                        variant="temporary"
                        open={isDrawerOpen}
                        onClose={handleToggle}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            display: {xs: "block"},
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: drawWidth,
                            },
                        }}
                    >
                        {responsiveDrawer}
                    </Drawer>
                </Box>
            </Box>
        </div>
    )
};

export default NavBar;
