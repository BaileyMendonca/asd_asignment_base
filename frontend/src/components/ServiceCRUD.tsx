import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ServiceCRUD: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    duration: 0,
    points: 0.0,
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const apiURL =
    "http://ebsbackend-env.eba-8pkqsxsg.us-east-1.elasticbeanstalk.com";

  // const apiURL = "http://localhost:4000";

  const fetchServices = async () => {
    try {
      const response = await fetch(`${apiURL}/services`);
      const data = await response.json();
      console.log("Fetched services:", data);
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Handle number input fields correctly
    if (name === "duration" || name === "points") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const url = selectedId
        ? `${apiURL}/services/${selectedId}`
        : `${apiURL}/services`;
      const method = selectedId ? "PUT" : "POST";

      const payload = {
        name: formData.name,
        duration: parseInt(formData.duration.toString(), 10),
        points: parseFloat(formData.points.toString()),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data from server:", errorData);
        return;
      }

      fetchServices();
      setSelectedId(null);
      setFormData({
        name: "",
        duration: 0,
        points: 0.0,
      });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${apiURL}/services/${id}`, {
        method: "DELETE",
      });

      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleEdit = (service: any) => {
    setFormData({
      name: service.name,
      duration: service.duration,
      points: service.points,
    });
    setSelectedId(service.id);
  };

  return (
    <div>
      <h2>Manage Services</h2>
      <div>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Duration"
          name="duration"
          type="number"
          value={formData.duration}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Points"
          name="points"
          type="number"
          value={formData.points}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {selectedId ? "Update" : "Create"}
        </Button>
      </div>
      <List>
        {services.map((service: any) => (
          <ListItem key={service.id}>
            <ListItemText
              primary={service.name}
              secondary={`Duration: ${service.duration}, Points: ${service.points}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleEdit(service)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(service.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ServiceCRUD;
