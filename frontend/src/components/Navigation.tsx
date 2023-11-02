import React, { useState, MouseEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Navigation: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Extract the roles from the user's profile
  const userRoles = isAuthenticated
    ? user!["https://your-namespace/roles"]
    : [];

  // Image source
  const profileImg =
    isAuthenticated && user?.picture ? user.picture : "/defaultProfilePic.jpg";

  const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  const handleMenuItemClick = (route: string) => {
    navigate(route);
    handleProfileClose(); // Close the menu
  };
  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        {isAuthenticated && (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="profile-picture"
              onClick={handleProfileClick}
            >
              <img
                src={profileImg}
                alt="Profile"
                style={{ width: "40px", borderRadius: "50%" }}
              />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileClose}
            >
              {userRoles.includes("Customer") && (
                <MenuItem onClick={handleProfileClose}>
                  Check my appointments
                </MenuItem>
              )}
              {(userRoles.includes("Technician") ||
                userRoles.includes("Manager")) && (
                <MenuItem onClick={() => handleMenuItemClick("/staff")}>
                  Staff View
                </MenuItem>
              )}
              {userRoles.includes("Manager") && (
                <MenuItem onClick={() => handleMenuItemClick("/manager")}>
                  Manager View
                </MenuItem>
              )}
            </Menu>
          </>
        )}
        <div style={{ flexGrow: 1 }}></div>{" "}
        {/* Spacer to push items to the right */}
        <Button
          color="inherit"
          onClick={() => handleMenuItemClick("/services")}
        >
          Check out our services
        </Button>
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
