import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AppointmentDist from "../components/AppointmentDist";
import { BrowserRouter } from "react-router-dom";

// Mocking the fetch function to avoid actual API calls

describe("<AppointmentDist />", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });

  test("renders the component without crashing", () => {
    render(
      <BrowserRouter>
        <AppointmentDist />
      </BrowserRouter>
    );
    const headerElement = screen.getByText(
      /Recently Distributed Appointments/i
    );
    expect(headerElement).toBeInTheDocument();
  });

  test("shows error when trying to add an appointment without selecting a service", () => {
    render(
      <BrowserRouter>
        <AppointmentDist />
      </BrowserRouter>
    );

    const addButton = screen.getByText("Add Appointment");
    fireEvent.click(addButton);

    const errorMessage = screen.getByText(
      /Please select Service for the appointment/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("shows error when trying to add an appointment with request checked but without selecting a technician", () => {
    render(
      <BrowserRouter>
        <AppointmentDist />
      </BrowserRouter>
    );

    // Check the request checkbox
    const requestCheckbox = screen.getByLabelText("Requested");
    fireEvent.click(requestCheckbox);

    const addButton = screen.getByText("Add Appointment");
    fireEvent.click(addButton);

    const errorMessage = screen.getByText(
      /Please select a technician when the request is selected./i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  // More tests can be added as needed, for example:
  // - Testing if the "Distribute" button works correctly.
  // - Testing if the edit and delete functionalities are behaving as expected.
  // ... and so on.
});
