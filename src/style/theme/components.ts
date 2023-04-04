// Chakra component overrides
export const components = {
  Heading: {
    baseStyle: {
      fontSize: '3.2em',
      lineHeight: 1.1,
      color: 'var(--ons-colors-bright)',
    },
    defaultProps: {
      variant: null,
    },
  },
  Button: {
    baseStyle: {
      backgroundColor: 'var(--ons-colors-muted)',
      color: 'white',
      borderRadius: '8px',
      padding: '0.6em 1.2em',
      fontSize: '1em',
      _hover: {
        backgroundColor: 'var(--ons-colors-btc-orange)',
      },
    },
    defaultProps: {
      variant: null,
    },
  },
  Link: {
    baseStyle: {
      color: 'var(--ons-colors-muted)',
      _hover: {
        color: 'var(--ons-colors-bright)',
      },
    },
    defaultProps: {
      variant: null,
    },
  },
  Input: {
    baseStyle: {
      field: {
        bg: 'inherit',
        borderColor: 'var(--ons-colors-whiteAlpha-50)',
        borderWidth: 2,
        color: 'white',
        ':focus': {
          borderColor: 'var(--ons-colors-muted)',
        },
        '::placeholder': {
          color: 'var(--ons-colors-gray-500)',
        },
      },
    },
    defaultProps: {
      variant: null,
    },
  },
  TextArea: {
    baseStyle: {
      bg: 'inherit',
      outline: 'var(--ons-colors-whiteAlpha-50)',
      color: 'black',
      ':focus-visible': {
        borderColor: 'var(--ons-colors-muted)',
        boxShadow: '0 0 1px red',
        color: 'red',
        backgroundColor: 'green',
      },
      '::placeholder': {
        color: 'var(--ons-colors-red-500)',
      },
    },
    defaultProps: {
      variant: null,
    },
  },
};
