import React, {useEffect, useState} from 'react';
import './App.css';
import {Container} from '@mui/material';
import NavBar from "./Components/NavBars/NavBar";
import SensorsList from "./Components/Pages/SensorsList";
import Dashboard from "./Components/Pages/Dashboard";
import {Outlet, Route, Routes, useLocation} from "react-router-dom";
import Sensor from "./Components/Pages/Sensor";
import Login from "./Components/Pages/Login";
import {apiGet} from "./utils/api";

const routesNameMap: { [key: string]: string } = {
    "/": "Dashboard",
    "/sensors": "Sensors",
    "/sensor/([a-zA-Z0-9]+)": "Sensor details",
    "/login": "Login",
};

function findPageName(path: string): string {
    for (const key in routesNameMap) {
        const regex = new RegExp("^" + key.replace(/:[a-zA-Z]+/g, "[a-zA-Z0-9]+") + "$");
        if (regex.test(path)) {
            return routesNameMap[key];
        }
    }
    return "404 Not Found";
}

function App() {
    const location = useLocation();
    const [isLogged, setIsLogged] = useState<boolean>(true);
    const [sensors, setSensors] = useState<any>([]);

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        setIsLogged(token !== undefined && token !== null && token.length > 0);
        if (!token && location.pathname !== "/login") {
            window.location.replace("/login?uri=" + location.pathname);
        }
    }, []);

    useEffect(() => {
        apiGet("/sensors").then((res) => {
            setSensors(res.data);
        }).catch((err) => {
            console.error(err);
        });
    }, []);

    const onLoginClick = () => {
        if (isLogged) {
            localStorage.setItem("authToken", "");
        }
        window.location.replace("/login");
    };

    const Layout = ({currentPageTitle}: { currentPageTitle: string }) => (
        <>
            <NavBar
                currentPageTitle={currentPageTitle}
                isLogged={isLogged}
                loginClick={onLoginClick}
            />
            <Container>
                <Outlet/>
            </Container>
        </>
    );

    return (
        <Routes>
            <Route path={"/"} element={<Layout currentPageTitle={findPageName(location.pathname)}/>}>
                <Route index element={<Dashboard sensors={sensors} />}/>
                <Route path={"/sensors"} element={<SensorsList sensors={sensors}/>}/>
                <Route path={"/sensor/:id"} element={<Sensor/>}/>
                <Route path={"/login"} element={<Login/>}/>

                <Route path="*" element={<>not found</>}/>
            </Route>
        </Routes>
    );
}

export default App;
