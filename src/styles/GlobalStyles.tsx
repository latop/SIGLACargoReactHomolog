import { Global, css } from "@emotion/react";
import { grey } from "@mui/material/colors";

const GlobalStyles = () => (
  <Global
    styles={css`
      * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
      }

      html,
      body {
        max-width: 100vw;
        overflow-x: hidden;
      }

      body {
        color: ${grey[800]};
        background: ${grey[50]};
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      @media (prefers-color-scheme: dark) {
        html {
          color-scheme: dark;
        }
      }

      & .MuiDataGrid-columnHeader {
        color: white;
        background-color: #24438f;

        & + .MuiDataGrid-filler {
          color: white;
          background-color: #24438f;
        }
      }
    `}
  />
);

export default GlobalStyles;
