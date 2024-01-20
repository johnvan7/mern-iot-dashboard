import React from "react";
import {Alert, Button, CircularProgress, Stack, TextField, Typography} from "@mui/material";
const LoginEmailForm = ({email, handleEmailChange, error, isLoading, onNextClick}
                            : {email: string, handleEmailChange: any, error: string, isLoading: boolean, onNextClick: any}) => {

    return (
        <>
            <Typography color={"primary"} variant={"h6"}>
                Login
            </Typography>
            <TextField
                error={error !== ""}
                id="outlined-basic"
                label="Email"
                variant="outlined"
                value={email}
                type={"email"}
                onChange={handleEmailChange}
                key={"email"}
            />
            <Typography color={"text.secondary"} variant={"body2"}>
                A code will be sent to your email
            </Typography>
            {error && <Alert severity="error">{error}</Alert> }
            <Stack direction={"row"} spacing={2}>
                <Button variant={isLoading ? "outlined" : "contained"} onClick={onNextClick}>Next</Button>
                {isLoading && <CircularProgress />}
            </Stack>
        </>
    );
}

export default LoginEmailForm;
