import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  overrides: {
    // Name of the component ⚛️ / style sheet
    MuiButton: {
      // Name of the rule
      text: {
        // Some CSS
        background: 'linear-gradient(45deg, #FFC371 30%, #FF5F6D 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      },
    },

    MuiGrid: {
      container: {
        // background: 'linear-gradient(75deg, #4568DC 30%, #B06AB3 90%)',
        background: '#131c2e',
      }
    },

    MuiInputBase: {
      input: {
        color: '#fff'
      }
    }

  },
  typography: { useNextVariants: true },
});

export default theme;
