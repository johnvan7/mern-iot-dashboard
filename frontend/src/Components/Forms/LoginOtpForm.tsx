import React from "react";
import {Alert, Button, CircularProgress, Stack, TextField, Typography} from "@mui/material";
const LoginOtpForm = ({otp, handleOtpChange, error, isLoading, onConfirmClick}
                            : {otp: string, handleOtpChange: any, error: string, isLoading: boolean, onConfirmClick: any}) => {

    return (
        <>
            <Typography color={"primary"} variant={"h6"}>
                Login
            </Typography>
            <TextField
                error={error !== ""}
                id="outlined-basic"
                label="One Time Password (OTP)"
                variant="outlined"
                value={otp}
                type={"text"}
                onChange={handleOtpChange}
                key={"otp"}
            />
            <Typography color={"text.secondary"} variant={"body2"}>
                Insert the code sent to your email
            </Typography>
            {error && <Alert severity="error">{error}</Alert> }
            <Stack direction={"row"} spacing={2}>
                <Button variant={isLoading ? "outlined" : "contained"} onClick={onConfirmClick}>Confirm</Button>
                {isLoading && <CircularProgress />}
            </Stack>
        </>
    );
}

export default LoginOtpForm;
