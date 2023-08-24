import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Avatar,
    Typography,
    LinearProgress,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const cardContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const cardStyle = {
    width: 'calc(50% - 16px)',
    margin: '8px',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid',
    borderImage: 'linear-gradient(to right, #00c9ff, #92fe9d)',
    borderImageSlice: 1,
};

const avatarStyle = {
    width: 80,
    height: 80,
    margin: 'auto',
    marginTop: 12,
    backgroundColor: '#1976d2',
};

const contentStyle = {
    textAlign: 'center',
    paddingTop: 8,
};

const textStyle = {
    marginBottom: 4,
};

const Account = () => {
    const history = useNavigate();
    const { user, logout } = useAuth();
    const [usedStorage, setUsedStorage] = useState(0);

    const totalStorage = 50.00;
    const storagePercentage = (usedStorage / totalStorage) * 100;

    const fetchStorage = async () => {
        try {
            const response = await fetch(`${process.env.SERVER_URI}/api/document/storage/${localStorage.getItem('user_id')}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                },
            });

            if (response.ok) {
                const json = await response.json();
                const data = parseFloat(json.formattedTotalStorageGB);
                setUsedStorage(data);
            } else {
                // Handle error response
            }
        } catch (error) {
            // Handle fetch error
        }
    };

    useEffect(() => {
        fetchStorage();
    }, []); // Run only on component mount

    const handleLogout = () => {
        logout();
        history('/login');
    };

    return (
        <div style={cardContainerStyle}>
            <Link to={'/'} className="btn btn-outline-primary mx-2 my-2" style={{ position: "fixed", top: "0", left: "0" }}>
                <i style={{ fontSize: "medium" }} className="bi bi-house-fill"></i>
            </Link>

            <button type='button' className='mx-1 btn btn-outline-danger mx-2 my-2' onClick={handleLogout} style={{ position: "fixed", top: "0", right: "0" }}>
                <i style={{ fontSize: "medium" }} className="bi bi-box-arrow-right"></i>
            </button>

            <Card style={cardStyle}>
                <Avatar alt={user?.email?.toUpperCase()} src={user?.photoURL} style={avatarStyle} />
                <CardContent style={contentStyle}>
                    <Typography variant="h6" style={textStyle}>
                        {user?.email}
                    </Typography>
                    <Typography variant="subtitle1" style={textStyle}>
                        {user?.displayName}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" style={textStyle}>
                        Free plan
                    </Typography>
                </CardContent>
                <hr />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Storage Usage
                    </Typography>
                    <hr />
                    <Typography variant="body1">
                        {usedStorage.toFixed(2)} MB used out of {totalStorage} MB
                    </Typography>
                    <LinearProgress variant="determinate" value={storagePercentage} />
                </CardContent>
            </Card>
        </div>
    );
};

export default Account;
