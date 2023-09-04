import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Box, Button, TextField } from "@mui/material";
import { login } from "./api";
import { useAuth0 } from "@auth0/auth0-react";
import AppNav from "./components/AppNav";

function App() {
  const { user, loginWithRedirect } = useAuth0();
  return (
    <div className="App">
      <AppNav />
    </div>
  );
}

export default App;
