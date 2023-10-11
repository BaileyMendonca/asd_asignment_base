import React, { useEffect, useState } from "react";
import { Grid, List, ListItem, ListItemText, Paper } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useLocation } from "react-router-dom";

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

const apiURL =
  "http://ebsbackend-env.eba-8pkqsxsg.us-east-1.elasticbeanstalk.com";

// const apiURL = "http://localhost:4000";

const TurningSheet: React.FC = () => {
  const location = useLocation();
  const { recentlyDistributed } = location.state || { recentlyDistributed: [] };
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const storedAppointments = JSON.parse(
    localStorage.getItem("localAppointments") || "[]"
  );
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>(
    storedAppointments.length ? storedAppointments : recentlyDistributed
  );

  // Inside the TurningSheet component, at the beginning:
  const isDistributedFromLocalStorage = JSON.parse(
    localStorage.getItem("isDistributed") || "false"
  );
  const [isDistributed, setIsDistributed] = useState<boolean>(
    isDistributedFromLocalStorage
  );
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

  useEffect(() => {
    if (isDistributed) {
      // TODO: Write logic to distribute the recentlyDistributed appointments to technicians.
      setIsDistributed(false); // Reset the flag
      localStorage.setItem("isDistributed", "false");
    }
  }, [isDistributed]);

  useEffect(() => {
    const recentlyDistributedFromLocalStorage = JSON.parse(
      localStorage.getItem("recentlyDistributed") || "[]"
    );
    setLocalAppointments(recentlyDistributedFromLocalStorage);
  }, []);

  console.log(localAppointments);

  useEffect(() => {
    fetch(`${apiURL}/technicians`)
      .then((response) => response.json())
      .then((data) => {
        setTechnicians(data);
        data.forEach((tech: Technician) => {
          fetch(`${apiURL}/technicians/${tech.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ currentPoints: 0 }),
          });
        });
      });
  }, []);

  useEffect(() => {
    fetch(`${apiURL}/services`)
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
      });
  }, []);
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

    // Do nothing if dropped outside of a droppable area
    if (!destination) return;

    const newTechnicianId = parseInt(destination.droppableId);

    const updatedAppointments = reorder(
      localAppointments,
      source.index,
      destination.index,
      newTechnicianId
    );

    // Update the state
    setLocalAppointments(updatedAppointments);

    // Save the updated state to localStorage
    localStorage.setItem(
      "localAppointments",
      JSON.stringify(updatedAppointments)
    );
  };

  return (
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
  );
};

export default TurningSheet;
