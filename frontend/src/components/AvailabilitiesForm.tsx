import {
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { submitAvailability } from "../api";
import { useAuth0 } from "@auth0/auth0-react";

const AvailabilityForm = () => {
  const defaultStartDate = new Date();
  defaultStartDate.setHours(0, 0, 0, 0);
  const [count, setCount] = useState<number>(0);
  useEffect(() => {}, [count]);
  const [formData, setFormData] = useState({
    TechnicianID: "",
    Day: "",
    StartTime: defaultStartDate.toISOString().slice(0, 16),
    EndTime: defaultStartDate.toISOString().slice(0, 16),
  });

  const { isAuthenticated, user } = useAuth0();
  if (!isAuthenticated) {
    return (
      <Typography>Sorry you should be logged in to see this view</Typography>
    );
  }

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setCount(count + 1);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await submitAvailability({
        email: user!.email!,
        StartTime: new Date(formData.StartTime).toISOString(),
        EndTime: new Date(formData.EndTime).toISOString(),
        status: "Pending",
      });
      console.log("Availability submitted successfully:");
    } catch (error) {
      console.error("Error submitting availability:", error);
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          sx={{ my: 5 }}
          name="StartTime"
          label="Start Time"
          type="datetime-local"
          variant="outlined"
          fullWidth
          value={formData.StartTime}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            placeholder: "Select Start Time",
          }}
        />

        <TextField
          name="EndTime"
          label="End Time"
          type="datetime-local"
          variant="outlined"
          fullWidth
          value={formData.EndTime}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true, // This prevents overlap when not selected
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Request Leave
        </Button>
      </form>
    </Card>
  );
};

export default AvailabilityForm;
