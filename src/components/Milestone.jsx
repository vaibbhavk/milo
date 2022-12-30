import { Box } from "@mui/material";
import SubMilestone from "./SubMilestone";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useEffect } from "react";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const Milestone = ({ m, subMilestones }) => {
  const updateSubMilestone = async (value, id) => {
    const milestoneRef = doc(db, "Milestone", id);

    await updateDoc(milestoneRef, {
      done: value,
    });
  };

  useEffect(() => {
    const filtered = subMilestones.filter((sm) => m.id === sm.milestone);

    let result = true;

    if (filtered.length === 0) {
      result = false;
    } else {
      filtered.forEach((f) => {
        if (!f.done) {
          result = false;
        }
      });
    }

    updateSubMilestone(result, m.id);
  }, [m, subMilestones]);

  return (
    <Box component="div" sx={{ marginLeft: "32px" }}>
      <FormControlLabel
        label={m.name}
        control={<Checkbox checked={m.done} disableRipple />}
      />
      <Box component="div" sx={{ marginLeft: "32px" }}>
        {subMilestones &&
          subMilestones.map(
            (sm, index2) =>
              m.id === sm.milestone && <SubMilestone key={index2} sm={sm} />
          )}
      </Box>
    </Box>
  );
};

export default Milestone;
