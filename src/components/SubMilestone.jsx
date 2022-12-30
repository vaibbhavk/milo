import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { useEffect } from "react";

const SubMilestone = ({ sm }) => {
  return (
    <Box>
      <FormControlLabel
        label={sm.name}
        // control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
        control={<Checkbox checked={sm.done} />}
      />
    </Box>
  );
};

export default SubMilestone;
