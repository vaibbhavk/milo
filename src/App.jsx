import { Box, LinearProgress } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import SpeedDialMenu from "./components/SpeedDialMenu";
import Welcome from "./components/Welcome";
import { auth } from "./firebase";

const App = () => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  }, []);
  return (
    <>
      <Navbar user={user} />

      {loading ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <>
          {user ? (
            <>
              <SpeedDialMenu user={user} />
              <Dashboard user={user} />
            </>
          ) : (
            <Welcome />
          )}
        </>
      )}
    </>
  );
};

export default App;
