import {Box, Stack} from "@mui/material";
import SensorCard from "../Cards/SensorCard";
import React, {useState} from "react";
const SensorsList = ({sensors} : {sensors: Sensor[]}) => {
    const [width] = useState<number>(window.innerWidth);
    const isMobile = width <= 768;

    return (
        <Box marginTop={15}>
            <Stack direction={isMobile ? "column": "row"} spacing={10}>
                {sensors.map((sensor) => (
                    <SensorCard sensor={sensor} />
                ))}
            </Stack>
        </Box>
    );
}

export default SensorsList;
