import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AddIcon from "@mui/icons-material/Add";

import AddAgendaForm from "./AddAgendaForm";
import AddMilestoneForm from "./AddMilestoneForm";

import { useState } from "react";
import AddSubMilestoneForm from "./AddSubMilestoneForm";

const actions = [
  { id: 1, icon: <AddIcon />, name: "Sub-Milestone" },
  { id: 2, icon: <AddIcon />, name: "Milestone" },
  { id: 3, icon: <AddIcon />, name: "Agenda" },
];

const speedDialMenuStyle = {
  margin: 0,
  top: "auto",
  right: 50,
  bottom: 50,
  left: "auto",
  position: "fixed",
};

const SpeedDialMenu = ({ user }) => {
  const [subMilestoneModalOpen, setSubMilestoneModalOpen] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <SpeedDial
        style={speedDialMenuStyle}
        ariaLabel="SpeedDial controlled open example"
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        FabProps={{
          sx: {
            bgcolor: "#F39766",
            "&:hover": {
              bgcolor: "#F39766",
            },
          },
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={(e) => {
              if (action.id === 1) setSubMilestoneModalOpen(true);
              else if (action.id === 2) setMilestoneModalOpen(true);
              else setAgendaModalOpen(true);
            }}
          />
        ))}
      </SpeedDial>

      <AddMilestoneForm
        milestoneModalOpen={milestoneModalOpen}
        setMilestoneModalOpen={setMilestoneModalOpen}
        user={user}
      />

      <AddAgendaForm
        agendaModalOpen={agendaModalOpen}
        setAgendaModalOpen={setAgendaModalOpen}
        user={user}
      />

      <AddSubMilestoneForm
        subMilestoneModalOpen={subMilestoneModalOpen}
        setSubMilestoneModalOpen={setSubMilestoneModalOpen}
        user={user}
      />
    </>
  );
};

export default SpeedDialMenu;
