import React, {useState} from "react";
import {
    Card,
    CardContent,
    Grid,
    Stack,
} from "@mui/material";
import {useSearchParams} from "react-router-dom";
import LoginEmailForm from "../Forms/LoginEmailForm";
import LoginOtpForm from "../Forms/LoginOtpForm";
import {apiPost} from "../../utils/api";

const Login = () => {
    const [searchParams] = useSearchParams();
    const [showOtpForm, setShowOtpForm] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [error, setError] = useState<string>("");

    const uri = searchParams.get("uri");
    const token = localStorage.getItem("authToken");
    if (token) {
        window.location.replace(uri ? uri : "/");
    }

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const isValidOtp = (inputString: string): boolean => {
        const regex = /^\d{6}$/;
        return regex.test(inputString);
    };

    const onNextClick = () => {
        if (isLoading) return;
        if (isValidEmail(email)) {
            setError("");
            setIsLoading(true);

            apiPost("/login", {email}).then((res) => {
                setIsLoading(false);
                setShowOtpForm(true);
            }).catch((err) => {
                setIsLoading(false);
                setError(err.response.data.message);
            })
        } else {
            setError("Invalid email");
        }

    };

    const onConfirmClick = () => {
        if (isLoading) return;
        if (isValidOtp(otp)) {
            setError("");
            setIsLoading(true);

            apiPost("/login/confirm", {email, otp}).then((res) => {
                const token = res.data.token;
                localStorage.setItem("authToken", token);
                window.location.replace(uri ? uri : "/");
            }).catch((err) => {
                setIsLoading(false);
                setError(err.response.data.message);
            });
        } else {
            setError("Invalid OTP");
        }
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(event.target.value);
    }

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            marginTop={20}
        >
            <Grid item xs={3} spacing={3}>
                <Card>
                    <CardContent>
                        <Stack direction={"column"} spacing={3}
                               sx={{
                                   marginX: 1,
                                   display: "flex",
                                   alignItems: "center",
                                   justifyContent: "space-between",
                                   minHeight: "400px"
                               }}>
                            {showOtpForm ?
                                <LoginOtpForm
                                    otp={otp}
                                    handleOtpChange={handleOtpChange}
                                    error={error}
                                    isLoading={isLoading}
                                    onConfirmClick={onConfirmClick}
                                />
                                :
                                <LoginEmailForm
                                    email={email}
                                    handleEmailChange={handleEmailChange}
                                    error={error}
                                    isLoading={isLoading}
                                    onNextClick={onNextClick}
                                />
                            }
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
};

export default Login;
