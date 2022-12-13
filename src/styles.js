import { createTheme } from "@mui/material/styles";

const theme = createTheme();

export const accordionPage = {
  padding: "0 20px",
  [theme.breakpoints.down("sm")]: {
    padding: 0,
  },
};

export const accordionContent = {
  backgroundColor: "white",
  color: "black",
  overflow: "auto",
  borderColor: "#28a745",
  borderWidth: "1px",
  borderRadius: "10px",
  [theme.breakpoints.down("sm")]: {
    borderRadius: 0,
  },
};
