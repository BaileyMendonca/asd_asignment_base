import React, { useEffect, useState } from "react";
import { Grid, List, ListItem, ListItemText, Paper } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useLocation } from "react-router-dom";
import { Box, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Define interfaces for Technician, Appointment, and Service
interface Technician {
  id: number;
  firstName: string;
  lastName: string;
  currentPoints: number;
  WorkingDays: string[];
}

interface Appointment {
  AppointmentID?: number;
  TechnicianID: number | null;
  ServiceID: number;
  Time: string;
  LockerNumber: number;
  Date: string;
}

interface Service {
  id: number;
  name: string;
  duration: number;
  points: number;
}

// API Base URL
const apiURL = "https://41026asdspa.com";

const TurningSheet: React.FC = () => {
  const navigate = useNavigate();

  const getTabValue = () => {
    const pathSegments = window.location.hash.replace("#/", "").split("/");
    return pathSegments[pathSegments.length - 1] || "technician-crud";
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(`/${newValue}`);
  };
  const location = useLocation();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const getTodayDayName = (): string => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date();
    return days[today.getDay()];
  };

  const getServiceName = (ServiceID: number) => {
    const service = services.find((s) => s.id === ServiceID);
    return service ? service.name : "Unknown Service"; // default to 'Unknown Service' if not found
  };

  const reorder = (
    list: Appointment[],
    startIndex: number,
    endIndex: number,
    newTechnicianId: number
  ): Appointment[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    removed.TechnicianID = newTechnicianId;
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return; // dropped outside the list

    const newTechnicianId = parseInt(destination.droppableId);
    const updatedAppointments = reorder(
      localAppointments,
      source.index,
      destination.index,
      newTechnicianId
    );

    // Get the appointment that was moved
    const movedAppointment = updatedAppointments[destination.index];

    // Update the appointment in the database
    fetch(`${apiURL}/appointments/${movedAppointment.AppointmentID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ TechnicianID: newTechnicianId }), // update TechnicianID
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // assuming the backend sends a success field in the response
          // Update local state and local storage only after successful database update
          setLocalAppointments(updatedAppointments);
          localStorage.setItem(
            "localAppointments",
            JSON.stringify(updatedAppointments)
          );
        } else {
          console.error("Failed to update appointment:", data.error);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  };

  // Fetch appointments from the database on initial render
  useEffect(() => {
    fetch(`${apiURL}/appointments`)
      .then((response) => response.json())
      .then((data) => setLocalAppointments(data));
  }, []);

  useEffect(() => {
    fetch(`${apiURL}/technicians`)
      .then((response) => response.json())
      .then((data) => setTechnicians(data));
  }, []);

  useEffect(() => {
    fetch(`${apiURL}/services`)
      .then((response) => response.json())
      .then((data) => setServices(data));
  }, []);

  // Render the TurningSheet component
  return (
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={2}>
          {technicians
            .filter((technician) =>
              technician.WorkingDays.includes(getTodayDayName())
            )
            .map((technician, index) => (
              <Grid item xs={4} key={technician.id}>
                <Droppable droppableId={technician.id.toString()}>
                  {(provided) => (
                    <Paper
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ minHeight: "200px", padding: "10px" }}
                    >
                      <h3>
                        {technician.firstName} {technician.lastName}
                      </h3>
                      <List>
                        {localAppointments
                          .filter(
                            (appointment) =>
                              appointment.TechnicianID === technician.id
                          )
                          .map((appointment, index) => (
                            <Draggable
                              key={
                                appointment.AppointmentID?.toString() ??
                                "defaultID"
                              }
                              draggableId={
                                appointment.AppointmentID?.toString() ??
                                "defaultID"
                              }
                              index={index}
                            >
                              {(provided) => (
                                <ListItem
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <ListItemText
                                    primary={`Time: ${
                                      appointment.Time
                                    }, Locker: ${
                                      appointment.LockerNumber
                                    }, Service: ${getServiceName(
                                      appointment.ServiceID
                                    )}`}
                                  />
                                </ListItem>
                              )}
                            </Draggable>
                          ))}
                      </List>
                      {provided.placeholder}
                    </Paper>
                  )}
                </Droppable>
              </Grid>
            ))}
        </Grid>
      </DragDropContext>
    </Box>
  );
};

export default TurningSheet;
