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
        p: { value: "Inter, sans-serif" },
        mono: { value: '"Fira Code", monospace' },
      },
      colors: {
        brand: {
          200: { value: "rgb(228, 228, 231)" },
          300: { value: "rgb(253, 253, 253)" },
          700: { value: "rgb(70,123,149)" },
          900: { value: "rgb(37,66,80)" },
        },
      },
    },
    semanticTokens: {
      fontSizes: {
        "heading.sm": { value: "1rem" },
      },
      colors: {
        ...semanticTokens.colors,
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
        brand: {
          contrast: { value: "{colors.brand.200}" },
          subtle: { value: "{colors.brand.700}" },
          solid: {
            value: "{colors.brand.900}",
          },
          outline: {
            value: "{colors.brand.200}",
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, themeConfig);
