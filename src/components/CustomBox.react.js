import React from "react";
import { Box } from "@mui/material";
import { accordionContent } from "../styles";

export const CustomBox = (props) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        overflow: "auto",
      }}
    >
      {props.header}
      <Box borderColor="#28a745" sx={accordionContent}>
        {props.children}
      </Box>
    </Box>
  );
};
