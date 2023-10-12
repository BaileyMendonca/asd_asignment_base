import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import AvailabilityForm from "./AvailabilitiesForm";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { deleteAvailability, getAvailabilities } from "../api";

// Define the type for the data structure returned by getAvailabilities
type AvailabilityData = {
  StartTime: string;
  EndTime: string;
  status: string;
  id: number;
};

const AvailabilitiesView = () => {
  const { isAuthenticated, user } = useAuth0();
  const [availabilities, setAvailabilities] = useState<AvailabilityData[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      getAvailabilities(user?.email!).then((data: AvailabilityData[]) =>
        setAvailabilities(data)
      );
    }
  }, [isAuthenticated, user?.email]);

  console.log(availabilities);
  if (!isAuthenticated) {
    return (
      <Typography>Sorry, you should be logged in to see this view</Typography>
    );
  }

  return (
    <Box sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}>
      <Typography gutterBottom>
        Your leave requests are as listed below!
      </Typography>

      {availabilities != null &&
        availabilities.map((availability, index) => (
          <AvailabilitiesCard
            key={index} // Make sure to provide a unique key
            StartTime={availability.StartTime}
            EndTime={availability.EndTime}
            status={availability.status}
            id={availability.id}
          />
        ))}

      <Typography>Add Leave</Typography>
      <AvailabilityForm />
    </Box>
  );
};

export default AvailabilitiesView;

export const formatDateTime = (isoDateTime: string) => {
  const date = new Date(isoDateTime);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat(undefined, options);
  return formatter.format(date);
};

type AvailabilitiesCardProps = {
  StartTime: string;
  EndTime: string;
  status: string;
  id: number;
};

const AvailabilitiesCard = (props: AvailabilitiesCardProps) => {
  const handleDelete = async () => {
    deleteAvailability(props.id);
  };
  return (
    <Card sx={{ minWidth: 275, mb: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {formatDateTime(props.StartTime) || "Start Time Unavailable"} -{" "}
          {formatDateTime(props.EndTime) || "Start Time Unavailable"}
        </Typography>
        <Chip
          label={props.status}
          sx={{ mt: 2 }}
          color={
            props.status === "Approved"
              ? "success"
              : props.status === "Denied"
              ? "error"
              : "default"
          }
        ></Chip>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleDelete}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};
