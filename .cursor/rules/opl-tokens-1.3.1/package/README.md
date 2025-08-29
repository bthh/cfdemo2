# opl-tokens

Design tokens for Orion’s product language (colors, typography, motion, borders, shadows), built with Style Dictionary v5.

## Install

```bash
npm i @orion-advisor-tech/opl-tokens
```

## Usage

### CSS variables

Choose one:

- Import in a global stylesheet:

```css
@import "@orion-advisor-tech/opl-tokens/css";
```

- Angular (angular.json):
  Add the package stylesheet to the `styles` array if you are using scss, since css files can not be imported directly into scss files:

```json
{
  "projects": {
    "app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.css",
              "node_modules/@orion-advisor-tech/opl-tokens/dist/css/index.css"
            ]
          }
        }
      }
    }
  }
}
```

### Tailwind (v4 @theme)

```css
@import "tailwindcss";
@import "@orion-advisor-tech/opl-tokens/tailwind";
```

### Dark mode

Semantic color variables are emitted for both light and dark modes. Switch themes by toggling a `data-theme` attribute on the root element:

```html
<html data-theme="light">
  ...
</html>
```

```html
<html data-theme="dark">
  ...
</html>
```

Under the hood, the package generates two scopes:

```css
:root {
  /* light variables */
}
:root[data-theme="dark"] {
  /* dark variables */
}
```

Set or toggle `data-theme` at runtime (e.g., based on user preference or OS `prefers-color-scheme`).

### Build options

Requires Node >= 22.

- Partial builds (faster local iteration):

```bash
ONLY=css:semantic-color,tw:typography npm run build
# or
npm run build -- --only=css:semantic-color,tw:typography
```

- Logging verbosity (silent by default):

```bash
SD_VERBOSITY=verbose npm run build
```

## Develop

```bash
npm run build     # one-off build
npm run watch     # rebuild on token changes
```

## Notes

- Source tokens are organized into `style-dictionary/tokens/primitives/**` and `style-dictionary/tokens/semantic/**`.
- Distributed CSS is generated under `dist/**`. Use the package exports (`@orion-advisor-tech/opl-tokens/css` and `/tailwind`) rather than deep imports.
