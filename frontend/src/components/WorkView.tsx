import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SearchPage from "./SearchPage";
import TechnicianCRUD from "./TechnicianCRUD";
import ServiceCRUD from "./ServiceCRUD";
import AppointmentDist from "./AppointmentDist";
import TurningSheet from "./TurningSheet";

const WorkView = () => {
  const navigate = useNavigate();

  // Tab value should reflect the full path after the hash
  const getTabValue = () => window.location.hash.replace('#/', '');

  const handleTabChange = (_event: any, newValue: any) => {
    navigate(`/${newValue}`);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={getTabValue()}
        onChange={handleTabChange}
        aria-label="work view tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Search" value="search-page" />
        <Tab label="Technician Management" value="technician-crud" />
        <Tab label="Service Management" value="service-crud" />
        <Tab label="Appointment Distribution" value="appointment-dist" />
        <Tab label="Turning Sheet" value="turning-sheet" />
      </Tabs>

      <Routes>
        <Route path="/search-page" element={<SearchPage />} />
        <Route path="/technician-crud" element={<TechnicianCRUD />} />
        <Route path="/service-crud" element={<ServiceCRUD />} />
        <Route path="/appointment-dist" element={<AppointmentDist />} />
        <Route path="/turning-sheet" element={<TurningSheet />} />
      </Routes>
    </Box>
  );
};

export default WorkView;
