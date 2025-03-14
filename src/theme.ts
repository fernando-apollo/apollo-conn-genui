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
  },
});

export default createSystem(defaultConfig, config);
