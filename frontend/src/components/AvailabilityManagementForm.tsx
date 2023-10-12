import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getAllPendingAvailabilities,
  handleAvailabilityStatusChange,
} from "../api";
import { formatDateTime } from "./AvailabilitiesView";

const AvailabilityManagementForm = () => {
  type AvailabilityData = {
    StartTime: string;
    EndTime: string;
    status: string;
    id: number;
  };
  const [availabilities, setAvailabilities] = useState<AvailabilityData[]>([]);
  const [availCount, setAvailCount] = useState<number>(0);
  useEffect(() => {
    getAllPendingAvailabilities().then((data: AvailabilityData[]) =>
      setAvailabilities(data)
    );
  }, [availCount]);

  const handleStatusChange = (id: number, status: string) => {
    handleAvailabilityStatusChange(id, status);
    setAvailCount(availCount - 1);
  };

  return (
    <TableContainer component={Paper} sx={{ width: "80%" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Action</TableCell>
            <TableCell align="right">Leave ID</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Start</TableCell>
            <TableCell align="right">End</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {availabilities.map((row: any) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Button
                  variant="contained"
                  sx={{ mx: 3 }}
                  onClick={() => handleStatusChange(row.id, "Denied")}
                >
                  Deny
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleStatusChange(row.id, "Approved")}
                >
                  {" "}
                  Approve
                </Button>
              </TableCell>
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">
                {formatDateTime(row.StartTime)}
              </TableCell>
              <TableCell align="right">{formatDateTime(row.EndTime)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AvailabilityManagementForm;
