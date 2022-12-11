import React from "react";
import { Box } from "@mui/material";

export const CustomBox = (props) => {
  return (
    <Box
      borderColor="#28a745"
      sx={{
        width: "100%",
        maxWidth: 400,
        maxHeight: 500,
        backgroundColor: "white",
        color: "black",
        overflow: "auto",
        borderColor: "#28a745",
        borderWidth: "1px",
        borderRadius: "10px",
      }}
    >
      {props.children}
    </Box>
  );
};
