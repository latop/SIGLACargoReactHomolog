import { Global, css } from "@emotion/react";
import { blueGrey } from "@mui/material/colors";

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
        color: rgb(var(--foreground-rgb));
        background: ${blueGrey[50]};
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
    `}
  />
);

export default GlobalStyles;
