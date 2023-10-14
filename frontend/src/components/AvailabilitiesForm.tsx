import { useState } from "react";
import { Button, Card, TextField, Typography } from "@mui/material";
import { submitAvailability } from "../api";
import { useAuth0 } from "@auth0/auth0-react";

const AvailabilityForm = () => {
  // Set state for the form data so we can update the form
  const [formData, setFormData] = useState({
    TechnicianID: "",
    Day: "",
    StartTime: "",
    EndTime: "",
  });

  // This is just used to check if the user is authenticated before accessing the view
  const { isAuthenticated, user } = useAuth0();

  // Return a polite message for the edge case of a user getting to this view without authentication
  if (!isAuthenticated) {
    return (
      <Typography>Sorry, you should be logged in to see this view</Typography>
    );
  }

  // Handles the form data change to keep the dom up to date, along with visual error representation for the user
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "EndTime" && new Date(value) < new Date(formData.StartTime)) {
      window.alert("Please select an End Time passed the Start Time.");
      return;
    }

    // Set the form data with the current fields
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // This handle the actual submission of the form
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // We use a try here in order to manage error handling
    try {
      await submitAvailability({
        // Get the email from the users account
        email: user!.email!,
        StartTime: new Date(formData.StartTime).toISOString(),
        EndTime: new Date(formData.EndTime).toISOString(),
        //Always submitted as pending
        status: "Pending",
      });
    } catch (error) {
      // Error handling in the logs for internal use
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
            shrink: true,
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
