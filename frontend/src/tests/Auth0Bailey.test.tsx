import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useAuth0 } from "@auth0/auth0-react";
import Navigation from "../components/Navigation";

//Initalise a mock version of auth0
jest.mock("@auth0/auth0-react");

// Add name so that we know whos component it is
describe("Bailey Auth0 Tests", () => {
  it("should show login button when not authenticated", () => {
    // Uses the mock version of auth0
    (useAuth0 as jest.Mock).mockReturnValue({
      // Set authentication status of the SDK
      isAuthenticated: false,
    });
    // Tell what componenets to render
    render(<Navigation />);
    // Tell what to expect
    expect(screen.getByText("Log In")).toBeInTheDocument();
  });

  it("Should show logout button when authenticated", () => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        // Add roles that should see this
        "https://your-namespace/roles": ["Customer", "Technician", "Manager"],
      },
    });

    render(<Navigation />);
    expect(screen.getByText("Log Out")).toBeInTheDocument();
  });

  /*
   *** The Following Tests are for managers view ***
   */

  it("Should show Manager View for Manager role", () => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        "https://your-namespace/roles": ["Manager"],
      },
    });

    render(<Navigation />);
    fireEvent.click(screen.getByLabelText("profile-picture"));
    expect(screen.getByText("Manager View")).toBeInTheDocument();
  });

  it("Should NOT show Manager View for Technician role", () => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        "https://your-namespace/roles": ["Technician"],
      },
    });

    render(<Navigation />);
    fireEvent.click(screen.getByLabelText("profile-picture"));
    expect(screen.queryByText("Manager View")).not.toBeInTheDocument();
  });

  it("Should NOT show Manager View for Customer role", () => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        "https://your-namespace/roles": ["Customer"],
      },
    });

    render(<Navigation />);
    fireEvent.click(screen.getByLabelText("profile-picture"));

    expect(screen.queryByText("Manager View")).not.toBeInTheDocument();
  });

  /* 
  The following tests are for staff view
  */
  it("Should show Staff View for Technician role", () => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        "https://your-namespace/roles": ["Technician"],
      },
    });

    render(<Navigation />);
    fireEvent.click(screen.getByLabelText("profile-picture"));
    expect(screen.getByText("Staff View")).toBeInTheDocument();
  });

  it("Should show Staff View for Manager role", () => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        "https://your-namespace/roles": ["Manager"],
      },
    });

    render(<Navigation />);
    fireEvent.click(screen.getByLabelText("profile-picture"));
    expect(screen.queryByText("Staff View")).toBeInTheDocument();
  });

  it("Should NOT show Staff View for Customer role", () => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        "https://your-namespace/roles": ["Customer", "Technician", "Manager"],
      },
    });

    render(<Navigation />);
    fireEvent.click(screen.getByLabelText("profile-picture"));

    expect(screen.queryByText("Staff View")).not.toBeInTheDocument();
  });
});
