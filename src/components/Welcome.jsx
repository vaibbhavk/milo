import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

const Welcome = () => {
  const provider = new GoogleAuthProvider();

  const handleLogin = (e) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
    >
      <Typography variant="h2" gutterBottom>
        Welcome to Milo!
      </Typography>
      <Typography variant="h3" gutterBottom>
        Start creating your milestones here.
      </Typography>
      <Button variant="contained" sx={{ margin: "16px" }} onClick={handleLogin}>
        Sign In with Google
      </Button>
    </Box>
  );
};

export default Welcome;
