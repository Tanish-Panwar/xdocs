import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Editor from './components/Editor';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import NotFound from './components/NotFound';
import { Alert } from '@mui/material';
import { useState } from 'react';
import Account from './components/Account';
import { useAuth } from './hooks/useAuth'
import FloatingButtonWithForm from './components/Feedback';
import About from './components/About';


function App() {
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const { user } = useAuth();

  const handleShowAlert = (message, severityColor) => {
    setAlertMessage(message);
    setSeverity(severityColor);
    setShowAlert(true);

    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  };



  return (
    <>
      <Router>
        {showAlert && <Alert severity={`${severity}`}>{alertMessage}</Alert>}
        <Routes>

          <Route exact path="/login" element={<Login handleShowAlert={handleShowAlert} />} />
          <Route exact path="/signup" element={<Signup handleShowAlert={handleShowAlert} />} />

          <Route path="*" element={<Navigate to="/404" />} />
          <Route path="/404" element={<NotFound />} />

          <Route exact path="/" element={<Home handleShowAlert={handleShowAlert} />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/account/:user_id" element={<Account />} />
          <Route path="/docs/:id" element={<Editor handleShowAlert={handleShowAlert} />} />
          
        </Routes>
      </Router>
      {user&&<FloatingButtonWithForm handleShowAlert={handleShowAlert} />}
    </>
  );
}

export default App;