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
  technicianId: number | null;
  serviceId: number | null;
  time: string;
  lockerNumber: number;
  date: string;
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

  useEffect(() => {
    fetch("http://localhost:4000/technicians")
      .then((response) => response.json())
      .then((data) => setTechnicians(data));

    fetch("http://localhost:4000/services")
      .then((response) => response.json())
      .then((data) => setServices(data));
  }, []);

  const handleAddAppointment = () => {
    const appointment = {
      technicianId: selectedTechnician,
      serviceId: selectedService,
      time,
      lockerNumber,
      date: new Date().toISOString(),
    };
    setAppointments([...appointments, appointment]);
  };

  const handleDistribute = () => {
    appointments.forEach((appointment) => {
      // Extract the date part from the appointment.date
      const datePart = appointment.date.split("T")[0];

      // Format the time
      const formattedTime = appointment.time + ":00";

      // Combine the date part and the formatted time
      const dateTimeString = datePart + "T" + formattedTime;
      const requestBody = {
        LockerNumber: appointment.lockerNumber,
        IsRequested: isRequested,
        Date: appointment.date,
        ServiceID: appointment.serviceId,
        ...(appointment.technicianId !== null
          ? { TechnicianID: appointment.technicianId }
          : {}),
      };

      try {
        const isoString = new Date(dateTimeString).toISOString();

        // The rest of your fetch call here, using isoString
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
  };

  const handleEditAppointment = (index: number) => {
    const appointment = appointments[index];
    setSelectedTechnician(appointment.technicianId);
    setSelectedService(appointment.serviceId);
    setTime(appointment.time);
    setLockerNumber(appointment.lockerNumber);
    handleDeleteAppointment(index);
  };

  const handleDeleteAppointment = (index: number) => {
    setAppointments(appointments.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isRequested}
                onChange={(e) => setIsRequested(e.target.checked)}
              />
            }
            label="Requested"
          />

          <Select
            value={selectedTechnician}
            onChange={(e) => setSelectedTechnician(Number(e.target.value))}
            disabled={!isRequested} // Disable dropdown if isRequested is false
          >
            {technicians.map((technician) => (
              <MenuItem key={technician.id} value={technician.id}>
                {technician.firstName} {technician.lastName}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
          <TextField
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="number"
            value={lockerNumber}
            onChange={(e) => setLockerNumber(Number(e.target.value))}
          />
        </Grid>
        <Grid item xs={12}>
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
                    technicians.find((t) => t.id === appointment.technicianId)
                      ?.firstName
                  } ${
                    technicians.find((t) => t.id === appointment.technicianId)
                      ?.lastName
                  }, Service: ${
                    services.find((s) => s.id === appointment.serviceId)?.name
                  }, Time: ${appointment.time}, Locker Number: ${
                    appointment.lockerNumber
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
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDistribute}
          >
            Distribute
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default AppointmentDist;
