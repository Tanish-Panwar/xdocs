import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';


export default function AlertDialog({ document_id, handleShowAlert, setDialogVis }) {
    const navigation = useNavigate();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleDeleteDocument = async () => {
        try {
            const response = await fetch(`${process.env.SERVER_URI}/api/document/user-document/delete-document/${document_id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })

            if (response.ok) {
                handleShowAlert("Document deleted successfully", "success");
                navigation('/');
            }
            else {
                handleShowAlert("Could not delete document", "error");
            }
        }
        catch (err) {

        }
        finally {
            setDialogVis(false);
            setOpen(false);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Open alert dialog
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Use Google's location service?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this document, you cannot restore this document after delete.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color='secondary' onClick={handleClose}>Cancle</Button>
                    <Button color='error' onClick={handleDeleteDocument} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}