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
  const [recentlyDistributed, setRecentlyDistributed] = useState<Appointment[]>(() => {
    const savedData = localStorage.getItem('recentlyDistributed');
    return savedData ? JSON.parse(savedData) : [];
  });
  
  const [isDistributed, setIsDistributed] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('recentlyDistributed', JSON.stringify(recentlyDistributed));
  }, [recentlyDistributed]);

  useEffect(()=>{
    localStorage.setItem('isDistributed',JSON.stringify(isDistributed));
  },[isDistributed]);
  useEffect(() => {
    fetch("http://localhost:4000/technicians")
      .then((response) => response.json())
      .then((data) => setTechnicians(data));

    fetch("http://localhost:4000/services")
      .then((response) => response.json())
      .then((data) => setServices(data));
  }, []);

  console.log(recentlyDistributed);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleDistribute = () => {
    setRecentlyDistributed([]);
    localStorage.removeItem('recentlyDistributed');
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

        fetch("http://localhost:4000/appointments", {
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

  const handleEditAppointment = (index: number) => {
    const appointment = appointments[index];
    setSelectedTechnician(appointment.TechnicianID);
    setSelectedService(appointment.ServiceID);
    setTime(appointment.Time);
    setLockerNumber(appointment.LockerNumber);
    handleDeleteAppointment(index);
  };

  const handleDeleteAppointment = (index: number) => {
    setAppointments(appointments.filter((_, i) => i !== index));
  };
  const handleRedoAll = () => {
    // Delete all recently distributed appointments from the backend
    const deletePromises = recentlyDistributed.map((appointment) =>
      fetch(`http://localhost:4000/appointments/${appointment.AppointmentID}`, {
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
    localStorage.removeItem('recentlyDistributed');
  };
  

  return (
    <div>
      <h2>Appointment</h2>
      <Button
  variant="contained"
  color="primary"
  onClick={handleStartNewDay}
>
  Start New Day
</Button>

      <Grid container spacing={2}>
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
        <Grid item xs={2}>
          Technician
          <Select
            value={selectedTechnician}
            onChange={(e) => setSelectedTechnician(Number(e.target.value))}
          >
            {!isRequested && <MenuItem value="">None</MenuItem>}
            {technicians
              .filter((technician) => {
                // Get today's day in long format (e.g., 'Monday', 'Tuesday', etc.)
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
        <Grid item xs={2}>
          Time
          <TextField
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          Locker Number
          <TextField
            type="number"
            value={lockerNumber}
            onChange={(e) => setLockerNumber(Number(e.target.value))}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddAppointment}
          >
            Add Appointment
          </Button>
        </Grid>

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
                <IconButton onClick={() => handleEditAppointment(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteAppointment(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} container justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDistribute}
          >
            Distribute
          </Button>
        </Grid>
        <Grid item xs={12} container justifyContent="center">
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </Grid>
      </Grid>
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
        {recentlyDistributed.length > 0 && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleRedoAll}
                >
                  Redo All
                </Button>
              )}
      </Grid>

    </div>
  );
};

export default AppointmentDist;