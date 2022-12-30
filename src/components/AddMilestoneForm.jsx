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
} from "firebase/firestore";
import { db } from "../firebase";

import { useState, useEffect } from "react";

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
  const [linkText, setLinkText] = useState("");

  const [tagIds, setTagIds] = useState([]);

  const [tags, setTags] = useState([]);

  const handleTagInputChange = (event) => {
    const {
      target: { value },
    } = event;
    setTagIds(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleNameTextChange = (e) => {
    setNameText(e.target.value);
  };

  const handleLinkTextChange = (e) => {
    setLinkText(e.target.value);
  };

  const handleCancelButtonClick = () => {
    setMilestoneModalOpen(false);
    setTagIds([]);
    setNameText("");
    setLinkText("");
  };

  const handleSaveButtonClick = async (e) => {
    e.preventDefault();

    const batch = writeBatch(db);
    console.log(batch);

    tagIds.forEach((tagId) => {
      const tagReference = doc(collection(db, "Tags", tagId, "Links"));

      batch.set(tagReference, {
        name: nameText,
        link: linkText,
        timestamp: serverTimestamp(),
      });
    });

    batch
      .commit()
      .then(() => {
        setMilestoneModalOpen(false);

        setSnackOpen(true);

        setTagIds([]);
        setNameText("");
        setLinkText("");
      })
      .catch((e) => {
        alert("Could not add a new link");
        return;
      });
  };

  const enableDisableSaveButton = (tagName, linkText) => {
    if (tagName.length === 0) {
      return true;
    }
    if (linkText.length === 0) {
      return true;
    }
    return false;
  };

  const getTags = () => {
    const q = query(collection(db, "Tags"), orderBy("name", "asc"));

    onSnapshot(q, (querySnapshot) => {
      const tagsArray = [];
      querySnapshot.forEach((doc) => {
        tagsArray.push({ ...doc.data(), id: doc.id });
      });

      setTags(tagsArray);
    });
  };

  useEffect(() => {
    if (milestoneModalOpen) {
      getTags();
    }
  }, [milestoneModalOpen]);

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

          <Select
            sx={{
              margin: "30px 0px 10px 0px",
            }}
            multiple
            displayEmpty
            value={tagIds}
            onChange={handleTagInputChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>Select an agenda</em>;
              }

              return <em>Selected</em>;
            }}
            MenuProps={MenuProps}
            inputProps={{ "aria-label": "Without label" }}
          >
            {tags.length < 1 && (
              <MenuItem disabled value="">
                <em>No tags</em>
              </MenuItem>
            )}
            {tags.length > 0 &&
              tags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.name}
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
              disabled={enableDisableSaveButton(tagIds, linkText)}
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
