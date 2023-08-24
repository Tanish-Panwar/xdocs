import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom'
import ActionAreaCard from '../utils/DisplayCard';
import { CardActionArea } from '@mui/material';

const getColor = (index) => {
    if (index === 0) return 'primary';
    else if (index === 1) return "warning";
    else if (index === 2) return "danger";
    else if (index === 3) return "secondary";
    else if (index === 4) return "success";
    else if (index === 5) return "info";
    else if (index === 6) return "light";
    else return "dark";
}

const Home = ({ handleShowAlert }) => {
    const navigate = useNavigate();
    const [searchDocs, setSearchDocs] = useState('');
    const [userDocuments, setUserDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]); // Initialize with all documents



    const getDocuments = () => {
        // Fetch user's documents from the API
        fetch(`/api/document/user-documents`, {
            headers: {
                Authorization: `${localStorage.getItem('token')}`,
            },
        }).then((response) => response.json()).then((data) => {
            console.log(data);
            setUserDocuments(data);
            setFilteredDocuments(data);
        }).catch((error) => console.error('Error fetching user documents:', error));
    }

    const handleCreateDocument = async (e) => {
        // creating user's document.
        e.preventDefault();
        const response = await fetch(`/api/document/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem("token")}`,
            }
        })
        const json = await response.json();
        if (json) {
            console.log(json.doc_id);
            handleShowAlert("Your new epic document is created", "success");
            navigate(`/docs/${json.doc_id}`);
        }
    }

    const filterDocuments = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchDocs(searchTerm);
        if (searchTerm === '') {
            setFilteredDocuments(userDocuments); // Show all documents when search box is empty
        } else {
            const filtered = userDocuments.filter(document =>
                document.title.toLowerCase().includes(searchTerm)
            );
            setFilteredDocuments(filtered);
        }
    };



    useEffect(() => {
        // eslint-disable-next-line
        if (localStorage.getItem('token')) {
            getDocuments();
            console.log("OK");
        }
        else {
            navigate('/login');
        }
    }, [navigate])



    return (
        <div style={{ height: "100vh" }}>
            {/* NAV */}
            <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{ backgroundColor: "aliceblue" }}>
                <div className="container-fluid">
                    <Link className="navbar-brand gradientText" to={'/'}>XDocs</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to={'/'}>Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`about`}>About</Link>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            <input value={searchDocs} onChange={filterDocuments} className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <Link to={`account/${localStorage.getItem('user_id')}`} className='mx-1 btn btn-outline-primary' >
                                <i class="bi bi-person"></i>
                            </Link>
                        </form>
                    </div>
                </div>
            </nav>

            {/* USER DOCS & DOCS CREATION */}
            <div className='container my-2 mx-2'>

                <h6>Add new document</h6>
                <div onClick={handleCreateDocument} className='card border-primary d-flex justify-content-center align-items-center' style={{ maxWidth: "150px", maxHeight: "200px", height: "200px" }}>
                    <CardActionArea className='d-flex justify-content-center align-items-center' style={{ maxWidth: "150px", maxHeight: "200px", height: "200px" }}>
                        <i style={{ fontSize: "70px" }} class="bi bi-plus-lg plus-icon"></i>
                    </CardActionArea>
                </div>


                <hr />
                <h6>Your documents</h6>
                {userDocuments.length > 0 ?
                    <div className='d-flex flex-wrap'>
                        {filteredDocuments.map((document, index) => (
                            <div key={document._id} className={`card border-${getColor(index)} mx-2 my-2`} style={{ maxWidth: "18rem" }}>
                                <CardActionArea>
                                    <ActionAreaCard document={document} isMultipleHomeDoc={true} index={index} />
                                </CardActionArea>
                            </div>
                        ))}
                    </div>
                    :
                    <p style={{ color: "gray", fontSize: "small" }}>Nothing to show here! Try adding some document and then you can see your documents here.</p>
                }
            </div>
        </div>
    )
}


export default Home;