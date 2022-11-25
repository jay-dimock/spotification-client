import React from "react";
import { AboutBasic } from "./AboutBasic.react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const FAQ = () => {
  return (
    <div className="container-main">
      <Typography variant="h5" color="white" mb={1} mx={2}>
        Frequently Asked Questions
      </Typography>
      {content.map((c, i) => (
        <Accordion className="small-screen" key={i}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="privacy-policy-content"
          >
            <Typography fontWeight="bold">{c.q}</Typography>
          </AccordionSummary>
          <AccordionDetails>{c.a}</AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

const content = [
  {
    q: "What is the purpose of this site?",
    a: <AboutBasic />,
  },
  {
    q: "Another question?",
    a: <Typography>Another answer</Typography>,
  },
];
