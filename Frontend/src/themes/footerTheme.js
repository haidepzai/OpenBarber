import {createTheme} from "@mui/material/styles";
import {basicTheme} from "./basicTheme";

export const footerTheme = createTheme(basicTheme, {
    components: {
        MuiLink: {
            defaultProps: {
                color: basicTheme.palette.white.main,
            },
        },
        MuiIconButton: {
            /* defaultProps geht hier aus irgendeinem Grund nicht*/
            styleOverrides: {
                root: {
                    size: 'large',
                    color: basicTheme.palette.white.main
                }
            },
        },
        MuiSvgIcon: {
            defaultProps: {
                fontSize: 'inherit',
            },
        },
    },
});