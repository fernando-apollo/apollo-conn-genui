import {
  defaultConfig,
  defineTextStyles,
  defineTokens,
} from '@chakra-ui/react';
import { createSystem, defineConfig } from '@chakra-ui/react';

const tokens = defineTokens({
  fonts: {
    heading: { value: 'Aeonik, sans-serif' },
    body: { value: 'Aeonik, sans-serif' },
    span: { value: 'Aeonik, sans-serif' },
    mono: { value: '"Fira Code", monospace' },
  },
  fontSizes: {
    // sm: { value: '1.25rem' },
  },
  colors: {
    brand: {
      100: { value: 'rgb(13, 23, 28)' },
      200: { value: 'rgb(228, 228, 231)' },
    },
  },
});

export const textStyles = defineTextStyles({
  body: {
    description: 'The body text style - used in paragraphs',
    value: {
      fontFamily: 'Aeonik',
      fontWeight: '400',
      fontStyle: 'normal',
    },
  },
});

const config = defineConfig({
  globalCss: {
    'html, body': {
      margin: 0,
      padding: 0,
    },
  },
  theme: {
    tokens,
    textStyles,
    semanticTokens: {
      fontSizes: {
        'heading.sm': { value: '1rem' },
      },
      colors: {
        brand: {
          solid: {
            value: '{colors.brand.100}',
          },
        },
        'heading.bg': {
          value: { _light: 'rgb(13, 23, 28)', _dark: 'rgb(13, 23, 28)' },
        },
        'heading.fg': {
          value: { _light: 'rgb(199, 207, 206)', _dark: 'rgb(199, 207, 206)' },
        },
      },
    },
  },
});

export default createSystem(defaultConfig, config);
