import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { Box, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Technician {
  id: number;
  firstName: string;
  lastName: string;
  currentPoints: number;
  WorkingDays: string[];
}

const TechnicianCRUD: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [inputFirstName, setInputFirstName] = useState("");
  const [inputLastName, setInputLastName] = useState("");
  const [selectedWorkingDays, setSelectedWorkingDays] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  const getTabValue = () => {
    const pathSegments = window.location.hash.replace("#/", "").split("/");
    return pathSegments[pathSegments.length - 1] || "technician-crud";
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(`/${newValue}`);
  };
  const apiURL = "https://41026asdspa.com";

  // const apiURL = "http://localhost:4000";
  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    const response = await fetch(`${apiURL}/technicians`);
    const data: Technician[] = await response.json();
    setTechnicians(data);
  };

  const handleCreateOrUpdate = async () => {
    const url = selectedId
      ? `${apiURL}/technicians/${selectedId}`
      : `${apiURL}/technicians`;
    const method = selectedId ? "PUT" : "POST";

    const payload = {
      firstName: inputFirstName,
      lastName: inputLastName,
      WorkingDays: selectedWorkingDays,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchTechnicians();
        setInputFirstName("");
        setInputLastName("");
        setSelectedWorkingDays([]);
        setSelectedId(null);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`${apiURL}/technicians/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchTechnicians();
    }
  };

  const handleEdit = (technician: Technician) => {
    setInputFirstName(technician.firstName);
    setInputLastName(technician.lastName);
    setSelectedWorkingDays(technician.WorkingDays);
    setSelectedId(technician.id);
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
          <Tab label="Search" value="search-page" />
          <Tab label="Technician Management" value="technician-crud" />
          <Tab label="Service Management" value="service-crud" />
          <Tab label="Appointment Distribution" value="appointment-dist" />
          <Tab label="Turning Sheet" value="turning-sheet" />
        </Tabs>
      </Box>
      <h2>Technician CRUD</h2>
      <div>
        <TextField
          label="First Name"
          variant="outlined"
          value={inputFirstName}
          onChange={(e) => setInputFirstName(e.target.value)}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          value={inputLastName}
          onChange={(e) => setInputLastName(e.target.value)}
        />
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="working-days-label">Working Days</InputLabel>
          <Select
            labelId="working-days-label"
            id="working-days"
            multiple
            value={selectedWorkingDays}
            onChange={(e) => setSelectedWorkingDays(e.target.value as string[])}
            label="Working Days"
          >
            <MenuItem value="Monday">Monday</MenuItem>
            <MenuItem value="Tuesday">Tuesday</MenuItem>
            <MenuItem value="Wednesday">Wednesday</MenuItem>
            <MenuItem value="Thursday">Thursday</MenuItem>
            <MenuItem value="Friday">Friday</MenuItem>
            <MenuItem value="Saturday">Saturday</MenuItem>
            <MenuItem value="Sunday">Sunday</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateOrUpdate}
        >
          {selectedId ? "Update Technician" : "Create Technician"}
        </Button>
      </div>

      <List>
        {technicians.map((tech) => (
          <ListItem key={tech.id}>
            <ListItemText
              primary={`${tech.firstName} ${tech.lastName}`}
              secondary={`Working Days: ${tech.WorkingDays.join(", ")}`}
            />
            <ListItemSecondaryAction>
              <Button color="primary" onClick={() => handleEdit(tech)}>
                Edit
              </Button>
              <Button color="secondary" onClick={() => handleDelete(tech.id)}>
                Delete
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TechnicianCRUD;
