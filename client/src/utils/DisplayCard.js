import * as React from 'react';
import { CardContent, Card, Typography, CardActionArea, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';

const getColor = (text) => {
    if (text === "private") {
        return 'danger';
    }
    else return 'primary';
}

export default function ActionAreaCard(props) {
    const { document, index } = props;

    return (
        <>
            <Card sx={{ maxWidth: 345, height: 345 }}>
                <Link style={{ textDecoration: "none", color: "black" }} to={`/docs/${document._id}`}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={`https://source.unsplash.com/featured/300x20${index}`}
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {document.title}
                        </Typography>
                        <p className={`text-${getColor(document.permissions)}`}> {document.permissions} </p>
                        <hr />
                        <Typography variant="body2" color="text.secondary">
                            {document.data && document.data.length > 0
                                ? `${document.data[0].insert.toString().substr(0, 70)}`
                                : "Your document is empty, try adding some data."}
                        </Typography>
                    </CardContent>
                </Link>
            </Card>
        </>
    );
}