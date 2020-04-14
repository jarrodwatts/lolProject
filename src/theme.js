import { createMuiTheme } from '@material-ui/core/styles';

/* COLOR SCHEME: 
Yellow: #F8E9A1
Red:    #F76C6C
Teal:   #A8D0E6
Blue:   #374785
Navy:   #24305E

*/

const colours = {
  yellow: '#F8E9A1',
  red: '#F76C6C',
  teal: '#A8D0E6',
  blue: '#374785',
  navy: '#24305E',
}

// Create a theme instance.
const theme = createMuiTheme({
  overrides: {
    // Name of the component ⚛️ / style sheet
    MuiButton: {
      // Name of the rule
      text: {
        // Some CSS
        //background: 'linear-gradient(45deg, #FFC371 30%, #FF5F6D 90%)',
        background: colours.red,
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 36,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      },
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
