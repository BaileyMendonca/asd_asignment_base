import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
} from "@mui/material";
import { Box, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Define the types for your appointment, technician, and service
interface Appointment {
  AppointmentID: number;
  Date: string;
  TechnicianName?: string | null;
  ServiceName?: string | null;
}

interface Technician {
  id: number;
  firstName: string;
  lastName: string;
}

interface Service {
  id: number;
  name: string;
}

const SearchPage = () => {
  const [searchDate, setSearchDate] = useState("");
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState("");
  const apiURL = "https://41026asdspa.com";
  const navigate = useNavigate();

  const getTabValue = () => {
    const pathSegments = window.location.hash.replace("#/", "").split("/");
    return pathSegments[pathSegments.length - 1] || "technician-crud";
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(`/${newValue}`);
  };
  useEffect(() => {
    const fetchTechniciansAndServices = async () => {
      try {
        // Fetch technicians
        const techResponse = await fetch(`${apiURL}/technicians`);
        const techData = await techResponse.json();
        setTechnicians(techData);

        // Fetch services
        const serviceResponse = await fetch(`${apiURL}/services`);
        const serviceData = await serviceResponse.json();
        setServices(serviceData);
      } catch (error) {
        setError("Failed to fetch data.");
      }
    };

    fetchTechniciansAndServices();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(`${apiURL}/appointments`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let allAppointments = await response.json();

      // Enhance appointments with technician and service information
      allAppointments = allAppointments.map(
        (appointment: { TechnicianID: number; ServiceID: number }) => ({
          ...appointment,
          TechnicianName: appointment.TechnicianID
            ? technicians.find((tech) => tech.id === appointment.TechnicianID)
                ?.firstName +
              " " +
              technicians.find((tech) => tech.id === appointment.TechnicianID)
                ?.lastName
            : "Not Assigned",
          ServiceName:
            services.find((service) => service.id === appointment.ServiceID)
              ?.name || "Unknown Service",
        })
      );

      // Filter appointments based on the search criteria
      const filteredAppointments = allAppointments.filter(
        (appointment: {
          Date: string | number | Date;
          TechnicianID: { toString: () => string };
        }) => {
          const appointmentDate = new Date(appointment.Date).toDateString();
          const matchesDate = searchDate
            ? appointmentDate === new Date(searchDate).toDateString()
            : true;
          const matchesTechnician = selectedTechnicianId
            ? appointment.TechnicianID?.toString() === selectedTechnicianId
            : true;
          return matchesDate && matchesTechnician;
        }
      );

      setAppointments(filteredAppointments);
      setError("");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setError(`Failed to fetch appointments: ${error.message}`);
      } else {
        console.error("An unexpected error occurred");
        setError("Failed to fetch appointments due to an unexpected error.");
      }
      setAppointments([]);
    }
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={getTabValue()}
          onChange={handleTabChange}
          aria-label="navigation tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Search" value="" />
          <Tab label="Technician Management" value="technician-crud" />
          <Tab label="Service Management" value="service-crud" />
          <Tab label="Appointment Distribution" value="appointment-dist" />
          <Tab label="Turning Sheet" value="turning-sheet" />
        </Tabs>
      </Box>
      <h1>Search Appointments</h1>

      <FormControl fullWidth margin="normal">
        <TextField
          id="search-date"
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          variant="outlined"
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="technician-select-label">Technician</InputLabel>
        <Select
          labelId="technician-select-label"
          id="technician-select"
          value={selectedTechnicianId}
          onChange={(e) => setSelectedTechnicianId(e.target.value as string)}
          label="Technician"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {technicians.map((technician) => (
            <MenuItem key={technician.id} value={technician.id.toString()}>
              {`${technician.firstName} ${technician.lastName}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>

      {error && <p>{error}</p>}

      <List>
        {appointments.map((appointment) => (
          <ListItem key={appointment.AppointmentID}>
            Appointment ID: {appointment.AppointmentID}, Date:{" "}
            {new Date(appointment.Date).toLocaleDateString()}, Technician:{" "}
            {appointment.TechnicianName}, Service: {appointment.ServiceName}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SearchPage;
