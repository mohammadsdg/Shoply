import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RTL from "./Rtl.jsx";

const theme = createTheme({
  typography: {
    fontFamily: "Vazir, Arial, sans-serif",
  },
  direction: "rtl",
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F9471F", // default border
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F9471F", // hover border
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F9471F", // focused border
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#F9471F", // default label color
          "&.Mui-focused": {
            color: "#F9471F", // focused label color
          },
        },
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RTL>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RTL>
    </ThemeProvider>
  </StrictMode>
);
