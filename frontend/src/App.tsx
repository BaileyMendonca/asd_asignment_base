import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Box, Button, TextField } from "@mui/material";
import { login } from "./api";

function App() {
  const [email, setEmail] = React.useState("bailey@gmail.com");
  const [password, setPassword] = React.useState("123456");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [helperText, setHelperText] = React.useState<string | null>(null);

  // Call api login here and set the first and last name

  const setLogin = () => {
    // Clear firstName at the start of every login attempt
    setFirstName("");

    login({ email, password })
      .then((res) => {
        if (res) {
          // assuming res directly contains the firstName string
          setFirstName(res.firstName);
          setLastName(res.lastName);
          // Clearing the email and password fields after a successful response
          setHelperText(null);
          setEmail("");
          setPassword("");
        } else {
          setEmail("");
          setPassword("");

          console.error("Unexpected API response:", res);
        }
      })
      .catch((error) => {
        // Handle network/API errors here
        setHelperText("Invalid email or password");
        console.error("API call failed:", error);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          value={email}
          error={helperText !== null}
          helperText={helperText}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          id="outlined-basic"
          label="Outlined"
          value={password}
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={setLogin}>
          Click to submit login
        </Button>
        {firstName != "" && (
          <Box>
            {firstName}
            {lastName}
          </Box>
        )}

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
