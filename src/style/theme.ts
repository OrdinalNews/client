// Extending the base Chakra theme

import { extendTheme } from '@chakra-ui/react';
import { config } from './theme/config';
import { colors } from './theme/colors';
import { fonts } from './theme/fonts';
import { styles } from './theme/styles';
import { components } from './theme/components';

const themeOptions = {
  config,
  colors,
  fonts,
  styles,
  components,
};

// extend the theme using all values above
const theme = extendTheme(themeOptions);

export default theme;
