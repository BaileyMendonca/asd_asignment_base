import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Box, Button, TextField } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import AppNav from "./components/AppNav";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  HashRouter,
} from "react-router-dom";

import TechnicianCRUD from "./components/TechnicianCRUD";
import ServiceCRUD from "./components/ServiceCRUD";
import AppointmentDist from "./components/AppointmentDist";
import TurningSheet from "./components/TurningSheet";
import TechnicianView from "./components/TechnicianView";
import ManagerView from "./components/ManagerView";
import ServicesView from "./components/ServicesView";
import SearchPage from "./components/SearchPage";
import WorkView from "./components/WorkView";


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
    <HashRouter>
      <div className="App">
        <AppNav />
        {/* Add a Link to navigate to the CRUD page */}



        {/* Define your routes using the Routes component */}
        <Routes>
          <Route path="/services" element={<ServicesView />} />
          <Route path="/manager" element={<ManagerView />} />
          <Route path="/staff" element={<TechnicianView />} />
          <Route path="/technician-crud" element={<TechnicianCRUD />} />
          <Route path="/service-crud" element={<ServiceCRUD />} />
          <Route path="/appointment-dist" element={<AppointmentDist />} />
          <Route path="/turning-sheet" element={<TurningSheet />} />
          <Route path="/search-page" element={<SearchPage />} />
          <Route path="/worker" element={<WorkView />} />

          

        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
