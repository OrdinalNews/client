// Chakra style overrides
export const styles = {
  global: {
    root: {
      fontSize: '18px',
      lineHeight: '24px',
      bg: 'black',
      color: 'white',
      fontSynthesis: 'none',
      textRendering: 'optimizeLegibility',
      webkitFontSmoothing: 'antialiased',
      mozOsxFontSmoothing: 'grayscale',
      webkitTextSizeAdjust: '100%',
    },
    body: {
      bg: 'var(--ons-colors-gray-800)',
      color: 'white',
      minHeight: '100vh',
    },
    a: {
      color: 'var(--ons-colors-muted)',
      _hover: {
        color: 'var(--ons-colors-bright)',
      },
    },
  },
};
