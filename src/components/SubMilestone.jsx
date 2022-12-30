import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const SubMilestone = ({ sm }) => {
  const updateSubMilestone = async (value, id) => {
    const subMilestoneRef = doc(db, "SubMilestone", id);

    await updateDoc(subMilestoneRef, {
      done: value,
    });
  };

  const handleChange = (e) => {
    updateSubMilestone(e.target.checked, sm.id);
  };

  return (
    <Box>
      <FormControlLabel
        label={sm.name}
        // control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
        control={<Checkbox checked={sm.done} onChange={handleChange} />}
      />
    </Box>
  );
};

export default SubMilestone;
