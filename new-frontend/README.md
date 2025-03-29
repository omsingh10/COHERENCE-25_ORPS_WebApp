# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# OPRS Dashboard

## About
OPRS Dashboard (Operations Dashboard) is a modern web application for monitoring and managing operations data. It provides a clean interface for visualizing data and interacting with operational systems.

## The Issue (Previously Fixed)
The original frontend application was experiencing a module resolution error where the application couldn't find imports like:
- `./App`
- `./reportWebVitals`
- `./components/Navbar`
- etc.

## The Solution
We created a new frontend application using Vite instead of Create React App. This resolved the module resolution issues.

Key steps to fix:
1. Create a new React TypeScript application using Vite
   ```
   npm create vite@latest . -- --template react-ts
   ```

2. Install dependencies
   ```
   npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion react-router-dom
   ```

3. Create a new App.tsx file with proper styling

## Why This Works
Vite has a different module resolution strategy than Create React App, which worked better for this environment. Vite uses native ES modules and is generally faster and more modern than the older webpack-based CRA.

## Next Steps
To complete the project, you should:

1. Copy the components from the original project into this new structure
2. Update imports and paths as needed
3. Test the application to ensure it works correctly

## Original Components to Transfer
- `AuthContext.tsx`
- `Login.tsx`
- `Register.tsx`
- `Dashboard.tsx`
- `Navbar.tsx`

## Running the App
```
npm run dev
```
