import * as React from 'react';
import { Box, InputLabel, MenuItem, FormControl, Select, Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, AvatarGroup, Avatar, Tooltip } from "@mui/material";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


// Toolbar options array.
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    // ['clean']                                         // remove formatting button
    ['link', 'image']
];



function Editor({ handleShowAlert }) {
    const navigation = useNavigate();
    const [currentDocument, setCurrentDocument] = useState(null);
    const [permission, setPermission] = React.useState('');
    const [documentName, setDocumentName] = useState('');
    const [open, setOpen] = React.useState(false);
    const [activeUsers, setActiveUsers] = useState([]);
    const [emailInput, setEmailInput] = useState('');
    const [selectedPermission, setSelectedPermission] = useState('read-only');
    const [socket, setSocket] = useState(null);
    const [quill, setQuill] = useState(null);
    const { id } = useParams();






    const handleDocumentNameChange = (event) => {
        setDocumentName(event.target.value);
    }


    const handleUpdateDocumentName = async () => {
        try {
            const response = await fetch(`${process.env.SERVER_URI}/api/document/user-document/update-name/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ name: documentName })
            });

            if (response.ok) {
                // Update the currentDocument state with the new name
                setCurrentDocument(prevDocument => ({
                    ...prevDocument,
                    title: documentName
                }));
                setDocumentName('');
                handleShowAlert("Document name updated successfully", "success");
            } else {
                console.error('Error updating document name:', response.statusText);
                handleShowAlert("Error updating document name", "warn");
            }
        } catch (error) {
            console.error('Error updating document name:', error);
            handleShowAlert("Error updating document name");
        }
    }


    const handleDeleteDocument = async () => {
        try {
            const response = await fetch(`${process.env.SERVER_URI}/api/document/user-document/delete-document/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })

            if (response.ok) {
                handleShowAlert("Document deleted successfully", "success");
                setOpen(false);
                navigation('/');
            }
            else {
                handleShowAlert("Could not delete document", "error");
            }
        }
        catch (err) {

        }
    }


    const handlePermissionChange = async (event) => {
        const newPermission = event.target.value;
        setPermission(newPermission);

        let newPermissionString = '';

        if (newPermission === 0) {
            newPermissionString = 'private';
        } else if (newPermission === 1) {
            newPermissionString = 'read-only';
        } else {
            newPermissionString = 'read-write';
        }

        try {
            const response = await fetch(`${process.env.SERVER_URI}/api/document/user-document/update-permission/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ permission: newPermissionString })
            });

            if (response.ok) {
                // Update the currentDocument state with the new permission
                setCurrentDocument(prevDocument => ({
                    ...prevDocument,
                    permissions: newPermissionString
                }));

                if (newPermission === 0) {
                    handleShowAlert("Permissions updated to private", "success");
                } else if (newPermission === 1) {
                    handleShowAlert("Be careful people can view your document", "warning");
                } else if (newPermission === 2) {
                    handleShowAlert("Attention, people can now edit your document with share link", "error");
                }

            } else {
                console.error('Error updating permission:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating permission:', error);
        }
    }


    const handleShareButtonClick = () => {
        const currentURL = window.location.href;

        // Copy the current URL to the clipboard
        navigator.clipboard.writeText(currentURL).then(() => {
            console.log('URL copied to clipboard:', currentURL);
            handleShowAlert("Share link copied to clipboard", "info");
        }).catch((error) => {
            console.error('Error copying URL to clipboard:', error);
        });
    }


    const handleClose = () => {
        setOpen(false);
    };


    const handleEmailInputChange = (event) => {
        setEmailInput(event.target.value);
    };


    const handleGivePermissionChnage = (event) => {
        setSelectedPermission(event.target.value);
    };


    const handleGrantAccess = async () => {
        if (selectedPermission && selectedPermission === 'remove-access') {
            const response = await fetch(`${process.env.SERVER_URI}/api/document/user-document/remove-permission/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ userEmail: emailInput })
            })

            if (response.ok) {
                setCurrentDocument(prevDocument => ({
                    ...prevDocument,
                    usersWithSpecialAccess: prevDocument.usersWithSpecialAccess.filter(
                        access => access.user !== emailInput
                    )
                }));
                handleShowAlert(`Special Permissions removed for user with this email: ${emailInput}`, "info")
            }
            else {
                handleShowAlert(`Error removing special Permissions for user with this email: ${emailInput}`, "error")
            }
        }
        else {

            // Emit an event to the socket server to send access request
            const response = await fetch(`${process.env.SERVER_URI}/api/document/user-document/give-permission/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ userEmail: emailInput, permission: selectedPermission })
            });

            if (response.ok) {
                const json = await response.json();
                setCurrentDocument(json);

                handleShowAlert(`Permission to access this document sent to ${emailInput}, share URL copied to clipboard `, "info");
                const currentURL = window.location.href;

                // Copy the current URL to the clipboard
                navigator.clipboard.writeText(currentURL).then(() => {
                    console.log('URL copied to clipboard:', currentURL);
                    handleShowAlert("Share link copied to clipboard", "info");
                }).catch((error) => {
                    console.error('Error copying URL to clipboard:', error);
                });
            }
            else {
                handleShowAlert(`Error sending permission to ${emailInput} try again later `, "error");
            }

        }
        setEmailInput('');
    };





    useEffect(() => {
        const getCurrentDoc = async () => {
            const response = await fetch(`${process.env.SERVER_URI}/api/document/user-documents/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            });
            const json = await response.json();
            if (json) {
                setCurrentDocument(json && json);
            }
            else {
                navigation("/404");
            }
        }

        getCurrentDoc();
    }, [id, navigation])


    useEffect(() => {
        const socketServer = io('');
        setSocket(socketServer);

        const quillInstance = new Quill("#container", { theme: "snow", modules: { toolbar: toolbarOptions }, placeholder: "Start editing your epic document..." });
        quillInstance.disable();
        setQuill(quillInstance);

        return () => {
            socketServer.disconnect();
            if (quillInstance) {
                quillInstance.off('text-change');
                quillInstance.getModule('toolbar').container.remove(); // Remove the toolbar
                quillInstance.container.remove(); // Remove the editor container
            }
        };
    }, []);


    useEffect(() => {
        if (socket === null && quill === null) {
            return;
        }

        const handleChange = (delta, oldData, source) => {
            if (source !== "user") {
                return;
            }
            socket && socket.emit("send-changes", delta);
        }

        quill && quill.on('text-change', handleChange);

        return () => {
            quill && quill.off('text-change', handleChange);
        }

    }, [quill, socket]);



    useEffect(() => {
        if (socket === null && quill === null) {
            return;
        }

        const handleChange = (delta) => {
            quill.updateContents(delta);
        }

        socket && socket.on('recieve-changes', handleChange);

        return () => {
            socket && socket.off('recieve-changes', handleChange);
        }

    }, [quill, socket]);


    useEffect(() => {
        if (!socket || !quill || !currentDocument) {
            return;
        }

        const givePermissions = () => {
            const owner = currentDocument.owner;
            const permissions = currentDocument.permissions;
            const user_id = localStorage.getItem('user_id');
            const usersWithSpecialAccess = currentDocument.usersWithSpecialAccess || [];

            if (user_id === owner) {
                console.log("1");
                quill.enable();
            } else if (!user_id && !localStorage.getItem('token')) {
                console.log("2");
                navigation('/404');
                quill.disable();
                quill.setText(''); // Clear content
            }
            else if (user_id !== owner) {
                const userPermission = usersWithSpecialAccess.find(
                    user => user.user.toString() === user_id
                );

                console.log("3");
                if (userPermission) {
                    if (userPermission.permission === 'read-write') {
                        quill.enable();
                    } else if (userPermission.permission === 'read-only') {
                        quill.disable();
                        quill.setText(''); // Clear content
                    }
                } else {
                    if (permissions === 'read-write') {
                        console.log("4");
                        quill.enable();
                    } else if (permissions === 'read-only') {
                        console.log("5");
                        quill.disable();
                        quill.setText(''); // Clear content
                    } else {
                        console.log(currentDocument.owner, " ", user_id);
                        navigation('/404');
                        console.log("6");
                    }
                }
            }

        };

        socket.once('load-document', deltaDoc => {
            givePermissions();
            quill.setContents(deltaDoc, 'api');
        });

        // NEWLY ADDED CODE> 
        socket.on("active-users", users => {
            setActiveUsers(users);
        });

        socket.on("user-connected", ({ userId, email }) => {
            setActiveUsers(prevUsers => [...prevUsers, { userId, email }]);
        });

        socket.on("user-disconnected", ({ userId }) => {
            setActiveUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
        });
        // NEWLY ADDED CODE ENDS HERE>


        socket.emit('get-document', id);
    }, [quill, socket, currentDocument, id, navigation]);



    useEffect(() => {
        if (quill === null || socket === null) {
            return;
        }

        const interval = setInterval(() => {
            socket && socket.emit("save-changes", quill.getContents());
        }, 2000);

        return () => {
            clearInterval(interval);
        }

    }, [socket, quill]);






    return (
        <>

            {/* NAVBAR */}
            <nav className="navbar bg-body-tertiary" style={{ minHeight: "1%" }}>
                <div className="container-fluid">
                    <Link to={'/'} className="navbar-brand gradientText">XDocs</Link>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            {currentDocument && currentDocument.owner === localStorage.getItem("user_id") &&
                                <>
                                    <div className='input-group' style={{ display: 'flex', alignItems: 'center' }}>
                                        <TextField
                                            label={`${currentDocument && currentDocument.title}`}
                                            id="outlined-size-small"
                                            defaultValue="Small"
                                            size="small"
                                            value={documentName}
                                            onChange={handleDocumentNameChange}
                                            style={{ marginRight: '10px' }}
                                        />
                                        <Tooltip title="Change document name">

                                            <Button variant='outlined' onClick={handleUpdateDocumentName}>
                                                <i className="bi bi-check"></i>
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </>
                            }
                        </li>
                    </ul>

                    {activeUsers && activeUsers.length>1&&
                        <Tooltip title="Joined users">
                            <AvatarGroup total={activeUsers && activeUsers.length}>
                                <Avatar sx={{ width: 24, height: 24, }} alt="Remy Sharp" src="https://source.unsplash.com/featured/300x200" />
                                <Avatar sx={{ width: 24, height: 24, }} alt="Travis Howard" src="https://source.unsplash.com/featured/300x201" />
                                <Avatar sx={{ width: 24, height: 24, }} alt="Agnes Walker" src="https://source.unsplash.com/featured/300x202" />
                                <Avatar sx={{ width: 24, height: 24, }} alt="Trevor Henderson" src="https://source.unsplash.com/featured/300x203" />
                            </AvatarGroup>
                        </Tooltip>
                    }



                    <div className="d-flex">

                        <div className='d-flex justify-content-center align-items-center'>
                            {currentDocument && currentDocument.owner === localStorage.getItem("user_id") &&
                                <>
                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                        <InputLabel id="demo-select-small-label">{currentDocument && currentDocument.permissions}</InputLabel>
                                        <Select
                                            labelId="demo-select-small-label"
                                            id="demo-select-small"
                                            value={permission}
                                            label="Permission"
                                            onChange={handlePermissionChange}
                                        >
                                            <MenuItem value={0}>Private</MenuItem>
                                            <MenuItem value={1}>Read-Only</MenuItem>
                                            <MenuItem value={2}>Read-Write</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Tooltip title="Delete Document">
                                        <Button className='mx-1' variant='outlined' color='error' onClick={() => setOpen(true)} >
                                            <i style={{ fontSize: "medium" }} className="bi bi-trash"></i>
                                        </Button>
                                    </Tooltip>

                                    <Tooltip title="Special Access">
                                        <Button className='mx-1' variant='outlined' color='warning' data-bs-toggle="modal" data-bs-target="#exampleModal">
                                            <i style={{ fontSize: "medium" }} className='bi bi-star'></i>
                                        </Button>
                                    </Tooltip>

                                </>

                            }

                            {currentDocument && currentDocument.permissions !== "private" &&
                                <Tooltip title="Copy share URL">
                                    <Button variant='outlined' onClick={handleShareButtonClick}>
                                        <i style={{ fontSize: "medium" }} className="bi bi-clipboard"></i>
                                    </Button>
                                </Tooltip>
                            }
                        </div>
                    </div>
                </div>
            </nav>



            {/* QUILL CONTAINER */}
            <Box id="container"></Box>





            {/* HANDLE USER's with Special access */}
            <div>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Special Access</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Give and remove special access to user using their email.</p>
                                <div className='my-3 d-flex justify-content-center align-items-center'>
                                    <TextField
                                        label="User Email"
                                        value={emailInput}
                                        onChange={handleEmailInputChange}
                                    />
                                    <FormControl className='mx-1'>
                                        <Select value={selectedPermission} onChange={handleGivePermissionChnage}>
                                            <MenuItem value="read-only">Read-Only</MenuItem>
                                            <MenuItem value="read-write">Read-Write</MenuItem>
                                            <MenuItem value="remove-access">Remove Special Access</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button className='mx-1' variant="outlined" onClick={handleGrantAccess}>
                                        <i style={{ fontSize: "medium" }} className="bi bi-send"></i>
                                    </Button>
                                </div>

                                <div className="specialAccessUsers">
                                    <p>Users having special Access</p>
                                    {currentDocument && currentDocument.usersWithSpecialAccess && currentDocument.usersWithSpecialAccess.map((item) => {
                                        return (
                                            <div className="card" key={item.user}>
                                                <div className="card-body">
                                                    {item.email} <span className='mx-2 text-primary'>{item.permission}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* DELETE DIALOG */}
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Delete Document?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this document, you cannot restore this document after delete.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancle</Button>
                        <Button color='error' onClick={handleDeleteDocument} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>



        </>
    )
}

export default Editor