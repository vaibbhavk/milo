import { Box, Paper } from "@mui/material";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Agenda from "./Agenda";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Dashboard = ({ user }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [agendas, setAgendas] = useState(null);
  const [milestones, setMilestones] = useState(null);
  const [subMilestones, setSubMilestones] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "Agenda"), where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const agendaList = [];
      querySnapshot.forEach((doc) => {
        agendaList.push({
          name: doc.data().name,
          user: doc.data().user,
          id: doc.id,
        });
      });
      // console.log(agendaList);
      setAgendas(agendaList);
    });

    const q1 = query(
      collection(db, "Milestone"),
      where("user", "==", user.uid)
    );
    const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
      const milestoneList = [];
      querySnapshot.forEach((doc) => {
        milestoneList.push({
          id: doc.id,
          name: doc.data().name,
          user: doc.data().user,
          agenda: doc.data().agenda,
          done: doc.data().done,
        });
      });
      setMilestones(milestoneList);
    });

    const q2 = query(
      collection(db, "SubMilestone"),
      where("user", "==", user.uid)
    );
    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      const subMilestoneList = [];
      querySnapshot.forEach((doc) => {
        subMilestoneList.push({
          id: doc.id,
          name: doc.data().name,
          user: doc.data().user,
          milestone: doc.data().milestone,
          done: doc.data().done,
        });
      });
      // console.log(subMilestoneList);
      setSubMilestones(subMilestoneList);
    });
  }, []);

  return (
    <Box sx={{ margin: "16px", marginTop: "32px" }}>
      {agendas &&
        agendas.map((a, index) => (
          <Agenda
            key={index}
            a={a}
            milestones={milestones}
            subMilestones={subMilestones}
          />
        ))}
    </Box>
  );
};

export default Dashboard;
