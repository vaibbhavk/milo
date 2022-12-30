import { Box, Typography } from "@mui/material";
import SubMilestone from "./SubMilestone";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const Milestone = ({ m, subMilestones }) => {
  const [checked, setChecked] = useState(true);

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

    // return setChecked(result);
  }, [m, subMilestones]);

  const handleChange1 = (event) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event) => {
    setChecked([checked[0], event.target.checked]);
  };

  const handleChange = (e) => {
    setChecked();
  };

  //   const checkChecked = () => {
  //     subMilestones.forEach((sm) => console.log(sm.done));
  //     return true;
  //   };

  function checkChecked() {
    return true;
  }

  return (
    <Box component="div" sx={{ marginLeft: "32px" }}>
      <FormControlLabel
        label={m.name}
        control={<Checkbox checked={m.done} />}
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
