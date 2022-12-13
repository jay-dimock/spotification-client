import * as React from "react";
import { styled } from "@mui/material/styles";
import { ArrowForwardIosSharp } from "@mui/icons-material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  border: `1px solid`,
  borderLeft: 0,
  borderRight: 0,
  "&:first-of-type": {
    borderTop: 0,
  },
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

export const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharp sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(() => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  paddingLeft: 8,
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    // marginLeft: 1,
  },
}));

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  marginLeft: 8,
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export const CustomAccordion = (props) => {
  const toggleExpansion = () => {
    const newValue = props.expandedId === props.id ? null : props.id;
    props.setExpandedId(newValue);
  };

  return (
    <Accordion
      expanded={props.expandedId === props.id}
      TransitionProps={{ unmountOnExit: true }}
      onChange={toggleExpansion}
    >
      {props.children}
    </Accordion>
  );
};
