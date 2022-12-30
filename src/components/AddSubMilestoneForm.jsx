import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import {
  onSnapshot,
  collection,
  writeBatch,
  doc,
  serverTimestamp,
  query,
  orderBy,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";

import { useState, useEffect } from "react";
import { InputLabel } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  display: "flex",
  flexDirection: "column",
  borderRadius: "20px",
  margin: "30px 0px 10px 0px",
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AddSubMilestoneForm = ({
  subMilestoneModalOpen,
  setSubMilestoneModalOpen,
  user,
}) => {
  const [snackOpen, setSnackOpen] = useState(false);

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const doNothing = () => null;

  const [nameText, setNameText] = useState("");

  const [milestone, setMilestone] = useState("");

  const [milestones, setMilestones] = useState([]);

  const handleNameTextChange = (e) => {
    setNameText(e.target.value);
  };

  const handleCancelButtonClick = () => {
    setSubMilestoneModalOpen(false);
    setMilestone("");
    setNameText("");
  };

  const handleSaveButtonClick = async (e) => {
    e.preventDefault();

    console.log(nameText, milestone);

    // add sub milestone to db

    const data = {
      name: nameText,
      user: user.uid,
      done: false,
      milestone: milestone,
    };

    const docRef = await addDoc(collection(db, "SubMilestone"), data);
    console.log("Document written with ID: ", docRef.id);

    setNameText("");
    setMilestone("");
    setSubMilestoneModalOpen(false);
  };

  const getMilestones = () => {
    const q = query(collection(db, "Milestone"), where("user", "==", user.uid));

    onSnapshot(q, (querySnapshot) => {
      const milestonesArray = [];
      querySnapshot.forEach((doc) => {
        milestonesArray.push({ ...doc.data(), id: doc.id });
      });

      setMilestones(milestonesArray);
    });
  };

  useEffect(() => {
    if (subMilestoneModalOpen) {
      getMilestones();
    }
  }, [subMilestoneModalOpen]);

  const handleMilestoneChange = (event) => {
    setMilestone(event.target.value);
  };

  return (
    <>
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
      >
        <Alert
          onClose={handleSnackClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Saved!
        </Alert>
      </Snackbar>
      <Modal
        open={subMilestoneModalOpen}
        onClose={doNothing}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle} component="form" onSubmit={handleSaveButtonClick}>
          <Typography id="modal-title" gutterBottom variant="h6" component="h2">
            Add a sub-milestone
          </Typography>

          <Divider />

          <InputLabel
            id="demo-simple-select-label"
            sx={{
              marginTop: "30px",
            }}
          >
            Select a milestone
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={milestone}
            onChange={handleMilestoneChange}
            sx={{
              marginBottom: "10px",
            }}
          >
            {milestones.length > 0 &&
              milestones.map((m) => (
                <MenuItem value={m.id} key={m.id}>
                  {m.name}
                </MenuItem>
              ))}
          </Select>

          <TextField
            id="standard-basic"
            label="Name"
            variant="outlined"
            value={nameText}
            onChange={handleNameTextChange}
            sx={{
              margin: "10px 0px 30px 0px",
            }}
            required
          />

          <Divider />

          <Box
            sx={{
              margin: "30px 0px 10px 0px",
            }}
          >
            <Button
              style={{ left: "60%", textTransform: "none" }}
              size="medium"
              variant="text"
              onClick={handleCancelButtonClick}
            >
              Cancel
            </Button>
            <Button
              style={{ left: "65.5%", textTransform: "none" }}
              variant="contained"
              size="medium"
              // disabled={enableDisableSaveButton(agenda)}
              onClick={handleSaveButtonClick}
              type="submit"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AddSubMilestoneForm;
