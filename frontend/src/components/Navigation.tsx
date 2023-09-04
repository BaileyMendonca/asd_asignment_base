import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useAuth0 } from "@auth0/auth0-react";

const Navigation: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  // Image source
  const profileImg =
    isAuthenticated && user?.picture ? user.picture : "/defaultProfilePic.jpg";

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        {/* Left Side - Profile Picture */}
        {isAuthenticated && (
          <IconButton edge="start" color="inherit" aria-label="profile-picture">
            <img
              src={profileImg}
              alt="Profile"
              style={{ width: "40px", borderRadius: "50%" }}
            />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }}></div>{" "}
        {/* Spacer to push items to the right */}
        {/* Right Side - Login or Logout Button */}
        {isAuthenticated ? (
          <Button
            color="inherit"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </Button>
        ) : (
          <Button color="inherit" onClick={() => loginWithRedirect()}>
            Log In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
