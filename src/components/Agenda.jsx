import { Box, Paper, Typography } from "@mui/material";
import Milestone from "./Milestone";

const Agenda = ({ a, milestones, subMilestones }) => {
  return (
    <Paper
      component="div"
      elevation={3}
      sx={{ padding: "16px", margin: "16px", marginBottom: "32px" }}
    >
      <Typography variant="h5" gutterBottom>
        {a.name}
      </Typography>

      <Box>
        {milestones &&
          milestones.map(
            (m, index1) =>
              a.id === m.agenda && (
                <Milestone key={index1} m={m} subMilestones={subMilestones} />
              )
          )}
      </Box>
    </Paper>
  );
};

export default Agenda;
