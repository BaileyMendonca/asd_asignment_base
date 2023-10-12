import React from "react";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import AvailabilitiesView, {
  formatDateTime,
} from "../components/AvailabilitiesView";
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import TechnicianView from "../components/TechnicianView";
import AvailabilitiesForm from "../components/AvailabilitiesForm";

// Mock the API functions
jest.mock("../api", () => ({
  getAvailabilities: jest.fn(),
  deleteAvailability: jest.fn(),
}));

jest.mock("@auth0/auth0-react");

describe("AvailabilitiesView Test Cases", () => {
  it("Not Authenticated Access", () => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <AvailabilitiesView />
      </BrowserRouter>
    );

    const loginMessage = screen.getByText(
      "Sorry, you should be logged in to see this view"
    );

    expect(loginMessage).toBeInTheDocument();
  });

  it("Render empty case", async () => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    // Mock getAvailabilities to return an empty array initially
    const { getAvailabilities } = require("../api");
    getAvailabilities.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <AvailabilitiesView />
      </BrowserRouter>
    );

    // Check if the component renders without availabilities
    const deleteButton = screen.queryByText("Delete");
    expect(deleteButton).not.toBeInTheDocument();
  });

  it("Adding an availability", async () => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { email: "user@example.com" },
    });

    // Mock getAvailabilities to return an empty array initially
    const { getAvailabilities } = require("../api");
    getAvailabilities.mockResolvedValue([]);

    // Render the component
    render(
      <BrowserRouter>
        <AvailabilitiesView />
      </BrowserRouter>
    );

    // Fill out the form fields and submit
    const startTimeInput = screen.getByLabelText("Start Time");
    const endTimeInput = screen.getByLabelText("End Time");

    fireEvent.change(startTimeInput, { target: { value: "2023-10-25T10:00" } });
    fireEvent.change(endTimeInput, { target: { value: "2023-10-25T12:00" } });

    // Mock getAvailabilities to return new data that includes the added availability
    getAvailabilities.mockResolvedValue([
      {
        StartTime: "2023-10-25T10:00",
        EndTime: "2023-10-25T12:00",
        status: "Pending",
        id: 1,
      },
    ]);

    // Submit the form
    const submitButton = screen.getByText("Request Leave");
    fireEvent.click(submitButton);

    // render(
    //   <BrowserRouter>
    //     <AvailabilitiesView />
    //   </BrowserRouter>
    // );

    // Assert the component behavior
    await waitFor(() => {
      const addedStartTime = screen.getByText(
        formatDateTime("2023-10-25T10:00")
      );
      const addedEndTime = screen.getByText(formatDateTime("2023-10-25T12:00"));

      expect(addedStartTime).toBeInTheDocument();
      expect(addedEndTime).toBeInTheDocument();
    });
  });
});
