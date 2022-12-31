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
import AddIcon from "@mui/icons-material/Add";
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
import { IconButton, InputLabel, Tooltip } from "@mui/material";
import { AddIcCallRounded } from "@mui/icons-material";

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

  const [textInputs, setTextInputs] = useState({ 0: "" });

  const [numInputs, setNumInputs] = useState([0]);

  const handleNameTextChange = (e) => {
    setNameText(e.target.value);
  };

  const handleNameTextInputChange = (e, index) => {
    setTextInputs({
      ...textInputs,
      [index]: e.target.value,
    });
  };

  const handleAddInputButtonClick = (e) => {
    setNumInputs([...numInputs, 0]);
    setTextInputs({ ...textInputs, [numInputs.length]: "" });
  };

  const handleCancelButtonClick = () => {
    setSubMilestoneModalOpen(false);
    setMilestone("");
    setNameText("");
  };

  const handleSaveButtonClick = async (e) => {
    e.preventDefault();

    const batch = writeBatch(db);

    numInputs.forEach((input, index) => {
      if (textInputs[index] !== "") {
        const docRef = doc(collection(db, "SubMilestone"));

        const data = {
          name: textInputs[index],
          user: user.uid,
          done: false,
          milestone: milestone,
        };

        batch.set(docRef, data);
      }
    });

    batch
      .commit()
      .then(() => {
        setMilestone("");
        setTextInputs({ 0: "" });
        setNumInputs([0]);
        setSubMilestoneModalOpen(false);
      })
      .catch((e) => {
        alert("Could not add new milestones");
        return;
      });
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

          {numInputs.map((input, index) => (
            <TextField
              key={index}
              sx={{
                marginTop: "10px",
              }}
              id="standard-basic"
              label="Name"
              variant="outlined"
              value={textInputs[index]}
              onChange={(e) => handleNameTextInputChange(e, index)}
              required
            />
          ))}

          {numInputs.length < 5 && (
            <Tooltip title="Add more" sx={{ marginTop: "10px" }}>
              <IconButton onClick={(e) => handleAddInputButtonClick(e)}>
                <AddIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          )}

          <Divider sx={{ marginTop: "30px" }} />

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
