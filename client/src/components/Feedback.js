import React, { useState } from 'react';
import {
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Tooltip,
} from '@mui/material';

const FeedbackForm = ({ open, onClose, handleShowAlert }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };


    const sendFeedback = async () => {
        const response = await fetch("/api/document/send-feedback", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ title: title, description: description, user_id: localStorage.getItem('user_id') })
        });
        const json = await response.json();
        console.log(json);
        if (response.ok) {
            handleShowAlert("Thank you for your feedback! It really helps us to improve.", "success");
        } else {
            if (json.error) {
                handleShowAlert(json.error, "warning");
            }
        }
    }

    const handleSubmit = () => {
        sendFeedback();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Feedback Form
                <IconButton onClick={onClose} color="inherit" aria-label="close" sx={{ float: "right", width: "60px", height: "60px" }} >
                    <i className="bi bi-x-lg"></i>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    label="Title"
                    fullWidth
                    value={title}
                    onChange={handleTitleChange}
                    margin="normal"
                />
                <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={handleDescriptionChange}
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const FloatingButtonWithForm = ({ handleShowAlert }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
            <Tooltip title="Give Feedback">
                <Fab color="primary" onClick={handleOpen}>
                    <i className="bi bi-chat-left-text"></i>
                </Fab>
            </Tooltip>
                <FeedbackForm handleShowAlert={handleShowAlert} open={open} onClose={handleClose} />
        </div>
    );
};

export default FloatingButtonWithForm;
