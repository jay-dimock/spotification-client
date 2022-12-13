import React from "react";
import { AboutBasic } from "./AboutBasic.react";
import { accordionPage, accordionContent } from "../styles";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Container,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const FAQ = () => {
  return (
    <Container maxWidth="md" sx={accordionPage}>
      <Typography variant="h5" color="white" mb={1} mx={2}>
        Frequently Asked Questions
      </Typography>
      <Box sx={accordionContent}>
        {content.map((c, i) => (
          <Accordion key={i}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="privacy-policy-content"
            >
              <Typography fontWeight="bold">{c.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>{c.a}</AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
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
