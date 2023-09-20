import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Box, Button, TextField } from "@mui/material";
import { login } from "./api";
import { useAuth0 } from "@auth0/auth0-react";
import AppNav from "./components/AppNav";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

import  TechnicianCRUD  from "./components/TechnicianCRUD";
import ServiceCRUD from "./components/ServiceCRUD";



// function App() {
//   const { user, loginWithRedirect } = useAuth0();
//   return (
//     <div className="App">
//       <AppNav />
//     </div>
//   );
// }

function App() {
  return (
    <Router>
    <div className="App">
        <AppNav />
        {/* Add a Link to navigate to the CRUD page */}
        <Link to="/technician-crud">Go to Technician CRUD</Link>
        <Link to="/service-crud">Go to Service CRUD</Link>
        
        {/* Define your routes using the Routes component */}
        <Routes>
            <Route path="/technician-crud" element={<TechnicianCRUD />} />
            <Route path="/service-crud" element={<ServiceCRUD />} />
        </Routes>
    </div>
</Router>

  );
}



export default App;
