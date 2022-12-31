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

const AddMilestoneForm = ({
  milestoneModalOpen,
  setMilestoneModalOpen,
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

  const [agenda, setAgenda] = useState("");

  const [agendas, setAgendas] = useState([]);

  const handleNameTextChange = (e) => {
    setNameText(e.target.value);
  };

  const handleCancelButtonClick = () => {
    setMilestoneModalOpen(false);
    setAgenda("");
    setNameText("");
  };

  const handleSaveButtonClick = async (e) => {
    e.preventDefault();

    // add milestone to db

    const data = {
      name: nameText,
      user: user.uid,
      done: false,
      agenda: agenda,
    };

    const docRef = await addDoc(collection(db, "Milestone"), data);

    setNameText("");
    setAgenda("");
    setMilestoneModalOpen(false);
  };

  const getAgendas = () => {
    const q = query(collection(db, "Agenda"), where("user", "==", user.uid));

    onSnapshot(q, (querySnapshot) => {
      const agendasArray = [];
      querySnapshot.forEach((doc) => {
        agendasArray.push({ ...doc.data(), id: doc.id });
      });

      setAgendas(agendasArray);
    });
  };

  useEffect(() => {
    if (milestoneModalOpen) {
      getAgendas();
    }
  }, [milestoneModalOpen]);

  const handleAgendaChange = (event) => {
    setAgenda(event.target.value);
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
        open={milestoneModalOpen}
        onClose={doNothing}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle} component="form" onSubmit={handleSaveButtonClick}>
          <Typography id="modal-title" gutterBottom variant="h6" component="h2">
            Add a milestone
          </Typography>

          <Divider />

          <InputLabel
            id="demo-simple-select-label"
            sx={{
              marginTop: "30px",
            }}
          >
            Select an agenda
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={agenda}
            onChange={handleAgendaChange}
            sx={{
              marginBottom: "10px",
            }}
          >
            {agendas.length > 0 &&
              agendas.map((a) => (
                <MenuItem value={a.id} key={a.id}>
                  {a.name}
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

export default AddMilestoneForm;
