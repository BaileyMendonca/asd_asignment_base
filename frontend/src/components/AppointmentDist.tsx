import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  MenuItem,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Checkbox, FormControlLabel } from "@mui/material";
// Define interfaces for types.
import { Box, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Technician {
  id: number;
  firstName: string;
  lastName: string;
  currentPoints: number;
  WorkingDays: string[];
}

interface Service {
  id: number;
  name: string;
  duration: number;
  points: number;
}

interface Appointment {
  AppointmentID?: number;
  TechnicianID: number | null;
  ServiceID: number;
  Time: string;
  LockerNumber: number;
  Date: string;
}

const AppointmentDist: React.FC = () => {
  const navigate = useNavigate();

  const getTabValue = () => {
    const pathSegments = window.location.hash.replace("#/", "").split("/");
    return pathSegments[pathSegments.length - 1] || "technician-crud";
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(`/${newValue}`);
  };
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<number | null>(
    null
  );
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [time, setTime] = useState<string>("");
  const [lockerNumber, setLockerNumber] = useState<number>(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isRequested, setIsRequested] = useState(false);
  const [recentlyDistributed, setRecentlyDistributed] = useState<Appointment[]>(
    // Retrieve recently distributed appointments from local storage.

    () => {
      const savedData = localStorage.getItem("recentlyDistributed");
      return savedData ? JSON.parse(savedData) : [];
    }
  );

  const [isDistributed, setIsDistributed] = useState<boolean>(false);

  const apiURL = "https://41026asdspa.com";

  // const apiURL = "http://localhost:4000";

  useEffect(() => {
    localStorage.setItem(
      "recentlyDistributed",
      JSON.stringify(recentlyDistributed)
    );
  }, [recentlyDistributed]);

  useEffect(() => {
    localStorage.setItem("isDistributed", JSON.stringify(isDistributed));
  }, [isDistributed]);
  useEffect(() => {
    fetch(`${apiURL}/technicians`)
      .then((response) => response.json())
      .then((data) => setTechnicians(data));

    fetch(`${apiURL}/services`)
      .then((response) => response.json())
      .then((data) => setServices(data));
  }, []);

  console.log(recentlyDistributed);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Function to add a new appointment.

  const handleAddAppointment = () => {
    if (isRequested && selectedTechnician === null) {
      setErrorMessage(
        "Please select a technician when the request is selected."
      );
      return;
    }
    if (selectedService === null) {
      setErrorMessage("Please select Service for the appointment");
      return;
    }
    if (time === null) {
      setErrorMessage("Please select the time for the appointment");
      return;
    }
    if (lockerNumber === 0) {
      setErrorMessage("Please input the lockernumfor the appointment");
      return;
    }
    const appointment = {
      TechnicianID: selectedTechnician,
      ServiceID: selectedService,
      Time: time,
      LockerNumber: lockerNumber,
      Date: new Date().toISOString(),
    };
    setAppointments([...appointments, appointment]);
    setErrorMessage(null); // Clear any previous error message
  };
  // Function to distribute appointments.

  const handleDistribute = () => {
    setRecentlyDistributed([]);
    localStorage.removeItem("recentlyDistributed");
    appointments.forEach((appointment) => {
      // Extract the date part from the appointment.date
      const datePart = appointment.Date.split("T")[0];

      // Format the time
      const formattedTime = appointment.Time + ":00";

      // Combine the date part and the formatted time
      const dateTimeString = datePart + "T" + formattedTime;
      const requestBody = {
        LockerNumber: appointment.LockerNumber,
        IsRequested: isRequested,
        Date: appointment.Date,
        ServiceID: appointment.ServiceID,
        ...(appointment.TechnicianID !== null
          ? { TechnicianID: appointment.TechnicianID }
          : {}),
      };

      try {
        const isoString = new Date(dateTimeString).toISOString();
        setIsDistributed(true);

        fetch(`${apiURL}/appointments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Time: isoString,
            ...requestBody,
          }),
        })
          .then((response) => response.json())

          .then((data) => {
            console.log("Success:", data);
            setRecentlyDistributed((prev) => [
              ...prev,
              { ...appointment, AppointmentID: data.AppointmentID },
            ]);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } catch (error) {
        console.error(
          "Error converting date and time to ISO string:",
          dateTimeString,
          error
        );
      }
    });
    setAppointments([]);
  };
  // Function to edit an existing appointment.

  const handleEditAppointment = (index: number) => {
    const appointment = appointments[index];
    setSelectedTechnician(appointment.TechnicianID);
    setSelectedService(appointment.ServiceID);
    setTime(appointment.Time);
    setLockerNumber(appointment.LockerNumber);
    handleDeleteAppointment(index);
  };
  // Function to delete an appointment.

  const handleDeleteAppointment = (index: number) => {
    setAppointments(appointments.filter((_, i) => i !== index));
  };
  // Function to revert all distributions.

  const handleRedoAll = () => {
    // Delete all recently distributed appointments from the backend
    const deletePromises = recentlyDistributed.map((appointment) =>
      fetch(`${apiURL}/appointments/${appointment.AppointmentID}`, {
        method: "DELETE",
      })
    );

    Promise.all(deletePromises)
      .then(() => {
        // Add all recently distributed appointments back to the appointments list on frontend
        setAppointments([...recentlyDistributed]);

        // Clear the recentlyDistributed list
        setRecentlyDistributed([]);
      })
      .catch((error) => {
        console.error("Error deleting the appointments:", error);
      });
  };
  const handleStartNewDay = () => {
    setRecentlyDistributed([]);
    localStorage.removeItem("recentlyDistributed");
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

      {/* Heading for the page */}
      <h2>Appointment</h2>
      {/* Button to reset and start a new day */}
      <Button variant="contained" color="primary" onClick={handleStartNewDay}>
        Start New Day
      </Button>

      {/* Form for appointment details */}
      <Grid container spacing={2}>
        {/* Checkbox for user to specify if the technician is requested */}
        <Grid item xs={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isRequested}
                onChange={(e) => setIsRequested(e.target.checked)}
              />
            }
            label="Requested"
          />
        </Grid>

        {/* Dropdown to select a Technician */}
        <Grid item xs={2}>
          Technician
          <Select
            value={selectedTechnician}
            onChange={(e) => setSelectedTechnician(Number(e.target.value))}
          >
            {/* If no technician is requested, show 'None' option */}
            {!isRequested && <MenuItem value="">None</MenuItem>}
            {/* Show available technicians for today */}
            {technicians
              .filter((technician) => {
                const today = new Date().toLocaleString("en-US", {
                  weekday: "long",
                });
                return technician.WorkingDays.includes(today);
              })
              .map((technician) => (
                <MenuItem key={technician.id} value={technician.id}>
                  {technician.firstName} {technician.lastName}
                </MenuItem>
              ))}
          </Select>
        </Grid>

        {/* Dropdown to select a Service */}
        <Grid item xs={2}>
          Service
          <Select
            value={selectedService}
            onChange={(e) => setSelectedService(Number(e.target.value))}
          >
            {services.map((service) => (
              <MenuItem key={service.id} value={service.id}>
                {service.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {/* Time input for appointment */}
        <Grid item xs={2}>
          Time
          <TextField
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </Grid>

        {/* Locker number input for appointment */}
        <Grid item xs={2}>
          Locker Number
          <TextField
            type="number"
            value={lockerNumber}
            onChange={(e) => setLockerNumber(Number(e.target.value))}
          />
        </Grid>

        {/* Button to add the appointment to the list */}
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddAppointment}
          >
            Add Appointment
          </Button>
        </Grid>

        {/* List of appointments added */}
        <Grid item xs={12}>
          <List>
            {appointments.map((appointment, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Technician: ${
                    technicians.find((t) => t.id === appointment.TechnicianID)
                      ?.firstName
                  } ${
                    technicians.find((t) => t.id === appointment.TechnicianID)
                      ?.lastName
                  }, Service: ${
                    services.find((s) => s.id === appointment.ServiceID)?.name
                  }, Time: ${appointment.Time}, Locker Number: ${
                    appointment.LockerNumber
                  }`}
                />
                {/* Button to edit the appointment */}
                <IconButton onClick={() => handleEditAppointment(index)}>
                  <EditIcon />
                </IconButton>
                {/* Button to delete the appointment */}
                <IconButton onClick={() => handleDeleteAppointment(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Button to distribute the appointments */}
        <Grid item xs={12} container justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDistribute}
          >
            Distribute
          </Button>
        </Grid>

        {/* Display error messages, if any */}
        <Grid item xs={12} container justifyContent="center">
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </Grid>
      </Grid>

      {/* Display the appointments that were recently distributed */}
      <Grid item xs={12}>
        <h3>Recently Distributed Appointments</h3>
        <List>
          {recentlyDistributed.map((appointment, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Technician: ${
                  technicians.find((t) => t.id === appointment.TechnicianID)
                    ?.firstName
                } ${
                  technicians.find((t) => t.id === appointment.TechnicianID)
                    ?.lastName
                }, Service: ${
                  services.find((s) => s.id === appointment.ServiceID)?.name
                }, Time: ${appointment.Time}, Locker Number: ${
                  appointment.LockerNumber
                }`}
              />
            </ListItem>
          ))}
        </List>

        {/* Button to redo the distribution of appointments */}
        {recentlyDistributed.length > 0 && (
          <Button variant="contained" color="secondary" onClick={handleRedoAll}>
            Redo All
          </Button>
        )}
      </Grid>
    </div>
  );
};

export default AppointmentDist;
