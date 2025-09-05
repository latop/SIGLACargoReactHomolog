import { createTheme } from "@mui/material/styles";
import { red, blue, grey, blueGrey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#24438F",
    },
    secondary: {
      main: red[700],
    },
    background: {
      default: blueGrey[50],
      paper: "#ffffff",
    },
    text: {
      primary: grey[800],
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontFamily: "var(--font-openSans)",
        },
        containedPrimary: {
          backgroundColor: "#24438F",
          "&:hover": {
            backgroundColor: blue[800],
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "11.5px 14px",
          fontSize: "13px",
          "&.Mui-disabled": {
            color: grey[700],
            WebkitTextFillColor: grey[700],
            cursor: "not-allowed",
          },
        },
        root: {
          "&.Mui-disabled": {
            backgroundColor: grey[100],
            cursor: "not-allowed",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: grey[300],
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          padding: "11.5px 14px",
          fontSize: "13px",
          "&.Mui-disabled": {
            color: grey[700],
            WebkitTextFillColor: grey[700],
            cursor: "not-allowed",
          },
        },
        root: {
          fontSize: "13px",
          backgroundColor: "#ffffff",
          fontFamily: "var(--font-openSans)",
          "&.Mui-disabled": {
            backgroundColor: grey[100],
            color: grey[700],
            cursor: "not-allowed",
          },
          "& input:-webkit-autofill": {
            WebkitTextFillColor: grey[800],
            WebkitBoxShadow: "0 0 0 100px #ffffff inset",
            transition: "background-color 5000s ease-in-out 0s",
          },
          "& input:-webkit-autofill:focus": {
            WebkitTextFillColor: grey[800],
            WebkitBoxShadow: "0 0 0 100px #ffffff inset",
          },
          "& .MuiInputLabel-shrink": {
            transform: "translate(14px, -6px) scale(0.75)",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-openSans)",
          fontSize: "13px",
          lineHeight: "10px",
          overflow: "inherit",
        },
        shrink: {
          lineHeight: "normal",
          overflow: "hidden",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-openSans)",
          color: grey[800],
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-openSans)",
          color: grey[800],
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-openSans)",
          padding: "3px 10px",
          fontSize: "12px",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-openSans)",
          backgroundColor: grey[100],
          color: grey[800],
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        input: {
          color: grey[800],
          fontFamily: "var(--font-openSans)",
          padding: "5.5px 4px 5.5px 5px !important",
          "&.Mui-disabled": {
            color: grey[700],
            WebkitTextFillColor: grey[700],
            cursor: "not-allowed",
          },
        },
        inputRoot: {
          padding: "6px",
          "&.Mui-disabled": {
            backgroundColor: grey[100],
            color: grey[700],
            cursor: "not-allowed",
          },
        },
        root: {
          color: grey[800],
          fontFamily: "var(--font-openSans)",
          "&.Mui-disabled": {
            cursor: "not-allowed",
            "& .MuiOutlinedInput-root": {
              backgroundColor: grey[100],
              cursor: "not-allowed",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: grey[300],
              },
            },
          },
        },
        popper: {
          marginTop: "10px !important",
        },
        option: {
          fontSize: "14px",
          fontFamily: "var(--font-openSans)",
        },
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore next line
    MuiDataGrid: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-openSans)",
          color: grey[800],
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          "& .MuiButtonBase-root": {
            paddingLeft: "0",
          },
        },
      },
    },
    MuiTimeline: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiTimelineDot: {
      styleOverrides: {
        root: {
          padding: "2px",
        },
      },
    },
    MuiTimelineConnector: {
      styleOverrides: {
        root: {
          width: "1px",
        },
      },
    },
    MuiTimelineItem: {
      styleOverrides: {
        root: {
          minHeight: "55px",
        },
      },
    },
    MuiDatePicker: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input.Mui-disabled": {
            backgroundColor: grey[100],
            color: grey[700],
            WebkitTextFillColor: grey[700],
            cursor: "not-allowed",
          },
          "& .MuiInputBase-root.Mui-disabled": {
            backgroundColor: grey[100],
            cursor: "not-allowed",
          },
        },
      },
    },
  },
});

export default theme;
