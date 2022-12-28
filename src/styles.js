import { createTheme } from "@mui/material/styles";

const theme = createTheme();

export const aboutPage = {
  backgroundColor: "white",
  padding: 2,
  borderRadius: 2,
  [theme.breakpoints.down("md")]: {
    borderRadius: 0,
  },
};

export const accordionContent = {
  backgroundColor: "white",
  color: "black",
  overflow: "auto",
  // borderColor: "#28a745",
  // borderWidth: "1px",
  borderRadius: 2,
  [theme.breakpoints.down("sm")]: {
    borderRadius: 0,
  },
};
