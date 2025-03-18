import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { semanticTokens } from "./semantic-tokens";
import { tokens } from "./tokens/index";

const themeConfig = defineConfig({
  theme: {
    tokens: {
      ...tokens,
      fonts: {
        heading: { value: "Aeonik, sans-serif" },
        body: { value: "Aeonik, sans-serif" },
        span: { value: "Aeonik, sans-serif" },
        mono: { value: '"Fira Code", monospace' },
      },
    },
    semanticTokens: {
      fontSizes: {
        "heading.sm": { value: "1rem" },
      },
      colors: {
        ...semanticTokens.colors,
        // 'bg.panel': {
        //   value: { _light: 'rgb(13, 23, 28)', _dark: 'rgb(13, 23, 28)' },
        // },
        "heading.bg": {
          value: { _light: "rgb(13, 23, 28)", _dark: "rgb(13, 23, 28)" },
        },
        "heading.fg": {
          value: { _light: "rgb(199, 207, 206)", _dark: "rgb(199, 207, 206)" },
        },
        "button.primary.bg": {
          value: { _light: "rgb(37,66,80)", _dark: "rgb(70,123,149)" },
        },
        "button.primary.fg": {
          value: {
            _light: "rgb(253, 253, 253)",
            _dark: "rgb(253, 253, 253)",
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, themeConfig);
