import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TechnicianCRUD from "../components/TechnicianCRUD";
import { BrowserRouter } from "react-router-dom";

describe("TechnicianCRUD", () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mocking the global fetch function
    mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: "some data" }),
        text: () => Promise.resolve("some data"),
        status: 200,
        headers: new Headers(),
      } as Response)
    );

    // Assigning our mocked function to replace the global fetch
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  afterEach(() => {
    // Clean up after each test
    mockFetch.mockRestore();
  });

  it("renders without crashing and displays the form", () => {
    render(
      <BrowserRouter>
        <TechnicianCRUD />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Working Days/)).toBeInTheDocument();
    expect(screen.getByText(/Create Technician/)).toBeInTheDocument();
  });

  it("allows creating a technician", async () => {
    render(
      <BrowserRouter>
        <TechnicianCRUD />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/First Name/), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/), {
      target: { value: "Doe" },
    });

    fireEvent.click(screen.getByText(/Create Technician/));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://41026asdspa.com/technicians",
        expect.anything()
      );
    });
  });
});
