import React from 'react';
import { Typography, Container, Grid, Card, CardContent, ListItemIcon, ListItemText, Divider } from '@mui/material';

function About() {
    return (
        <Container maxWidth="md">
            <Typography className='gradientText' variant="h4" align="center" gutterBottom>
                About Our Document Editing App
            </Typography>

            <Typography style={{color: "gray", fontSize: "medium"}} variant="body1" paragraph>
                Welcome to our document editing application, designed to provide a seamless collaborative writing experience. 
                Here are some of the key features that make our app stand out:
            </Typography>
            <p style={{color: "gray", fontSize: "small"}}>Just wrote these things because they looked great</p>

            <Grid container spacing={3} sx={{marginBottom: "10px"}}>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 2, margin: '5px', border: '0.5px solid #00bcd4' }}>
                        <CardContent>
                            <ListItemIcon>
                                <i className="bi bi-lightbulb"></i>
                            </ListItemIcon>
                            <ListItemText primary="Real-Time Updates" secondary="See changes as they happen, no need to refresh." />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 2, margin: '5px', border: '0.5px solid #00bcd4' }}>
                        <CardContent>
                            <ListItemIcon>
                                <i className="bi bi-share"></i>
                            </ListItemIcon>
                            <ListItemText primary="Real-Time Sharing" secondary="Collaborate with others instantly by sharing documents." />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 2, margin: '5px', border: '0.5px solid #00bcd4' }}>
                        <CardContent>
                            <ListItemIcon>
                                <i className="bi bi-shield-check"></i>
                            </ListItemIcon>
                            <ListItemText primary="Permissions Updates" secondary="Control who can view or edit your documents." />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 2, margin: '5px', border: '0.5px solid #00bcd4' }}>
                        <CardContent>
                            <ListItemIcon>
                                <i className="bi bi-pencil-square"></i>
                            </ListItemIcon>
                            <ListItemText primary="Real-Time Writing Updates" secondary="Write collaboratively with live updates." />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 2, margin: '5px', border: '0.5px solid #00bcd4' }}>
                        <CardContent>
                            <ListItemIcon>
                                <i className="bi bi-people"></i>
                            </ListItemIcon>
                            <ListItemText primary="Special Permissions" secondary="Grant specific access to users using their emails." />
                        </CardContent>
                    </Card>
                </Grid>


                <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 2, margin: '5px', border: '0.5px solid #00bcd4' }}>
                        <CardContent>
                            <ListItemIcon>
                                <i className="bi bi-file-plus"></i>
                            </ListItemIcon>
                            <ListItemText primary="Multiple Documents" secondary="Create and manage multiple documents effortlessly." />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 2, margin: '5px', border: '0.5px solid #00bcd4' }}>
                        <CardContent>
                            <ListItemIcon>
                                <i className="bi bi-people"></i>
                            </ListItemIcon>
                            <ListItemText
                                primary="Live Document Viewing"
                                secondary="See all users currently viewing the document in real time."
                            />
                        </CardContent>
                    </Card>
                </Grid>



            </Grid>

            <Divider />

            <Typography style={{color: "gray", fontSize: "small", marginTop: "10px"}} variant="body1" paragraph>
                Our goal is to provide a powerful yet user-friendly platform for collaborative writing, making it easy for
                teams and individuals to work together on documents, ideas, and projects. Start exploring our app today!
            </Typography>
        </Container>
    );
}

export default About;