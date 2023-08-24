import * as React from 'react';
import { Paper, Grid, Button, CssBaseline, TextField, Link, Box, Typography, createTheme, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from 'firebase/auth';
import { app } from '../Firebase';
import { useAuth } from '../hooks/useAuth';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignInSide({ handleShowAlert }) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [credentials, setCredentials] = React.useState({ email: "", password: "" })
    const history = useNavigate();
    const auth = getAuth(app);
    const { user } = useAuth();
    const [loading, setLoading] = React.useState(false);
    const isVerified = (user&&user.emailVerified);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = credentials;
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Send email verification and wait for it to complete
            await sendEmailVerification(user);
            if (user) {
                handleShowAlert("Check your email for verification.", "success");
            }
        } catch (error) {
            handleShowAlert(error.message, "warning");
        }
    }

    

    React.useEffect(() => {
        console.log(user&&user.emailVerified);
        const createUserInMongo = async () => {
            const email = user.email;
            const response = await fetch("/api/auth/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            const json = await response.json();
            console.log(json);
            if (response.ok) {
                handleShowAlert("Your XDocs account created successfully", "success");
                localStorage.setItem('token', json.authtoken);
                localStorage.setItem('user_id', json.user_id);
                history('/');
                setLoading(false);
            } else {
                if (json.error) {
                    handleShowAlert(json.error, "warning");
                }
            }
        }

        if(user && user.emailVerified) {
            createUserInMongo();
        }

    }, [history, handleShowAlert, user, isVerified]);


    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            {loading && <p style={{position: "absolute", backgroundColor: "white", zIndex: "10", height: "100%", width: "100%", color: "black", textAlign: "center"}}>Reload this page after email verification!</p>}
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >

                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                value={credentials.email}
                                onChange={onChange}
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                value={credentials.password}
                                onChange={onChange}
                                name="password"
                                label="Password (minimum length 5)"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />

                            <Button
                                disabled={!credentials.email.match(regex) || credentials.password.length < 5 || loading}
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        {"Already have an account? Sign In"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}