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

interface Technician {
  id: number;
  firstName: string;
  lastName: string;
  currentPoints: GLfloat;
  WorkingDays: string[];
}

const TechnicianCRUD: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputFirstName, setInputFirstName] = useState("");
  const [inputLastName, setInputLastName] = useState("");
  const [selectedWorkingDays, setSelectedWorkingDays] = useState<string[]>([]);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:4000/technicians");
    const data: Technician[] = await response.json();
    setTechnicians(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    try {
      const response = await fetch("http://localhost:4000/technicians", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: inputFirstName,
          lastName: inputLastName,
          WorkingDays: selectedWorkingDays,
        }),
      });
  
      if (response.ok) {
        // If the response status is in the 200 range, it's considered successful.
        fetchTechnicians();
        setInputFirstName("");
        setInputLastName("");
        setSelectedWorkingDays([]);
      } else {
        const errorData = await response.json();
        console.error("Error creating technician:", errorData);
  
        // You can add additional error handling here, such as displaying an error message to the user.
      }
    } catch (error) {
      console.error("Error creating technician:", error);
    }
  };
  

  const handleDelete = async (id: number) => {
    const response = await fetch(`http://localhost:4000/technicians/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchTechnicians();
    }
  };

  const handleUpdate = async (
    id: number,
    newFirstName: string,
    newLastName: string
  ) => {
    try {
      const response = await fetch(`http://localhost:4000/technicians/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: newFirstName,
          lastName: newLastName,
        }),
      });

      if (response.ok) {
        fetchTechnicians();
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating technician:", error);
    }
  };

  return (
    <div>
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
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create Technician
        </Button>
      </div>

      <List>
        {loading ? (
          <p>Loading technicians...</p>
        ) : (
          technicians.map((tech) => (
            <ListItem key={tech.id}>
              <ListItemText primary={`${tech.firstName} ${tech.lastName}`} />
              <ListItemSecondaryAction>
                <Button color="secondary" onClick={() => handleDelete(tech.id)}>
                  Delete
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    const newFirstName = prompt("Enter new first name:");
                    const newLastName = prompt("Enter new last name:");
                    if (newFirstName !== null && newLastName !== null) {
                      handleUpdate(tech.id, newFirstName, newLastName);
                    }
                  }}
                >
                  Update
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>
    </div>
  );
};

export default TechnicianCRUD;
