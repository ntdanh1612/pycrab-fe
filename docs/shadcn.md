# Installation
Create project
Start by creating a new React project using vite. Select the React + TypeScript template:

pnpm create vite@latest

Add Tailwind CSS

pnpm add tailwindcss @tailwindcss/vite

Replace everything in src/index.css with the following:

src/index.css
```
@import "tailwindcss";
```

Edit tsconfig.json file
The current version of Vite splits TypeScript configuration into three files, two of which need to be edited. Add the baseUrl and paths properties to the compilerOptions section of the tsconfig.json and tsconfig.app.json files:
```
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Edit tsconfig.app.json file
Add the following code to the tsconfig.app.json file to resolve paths, for your IDE:
```
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // ...
  }
}
```
Update vite.config.ts
Add the following code to the vite.config.ts so your app can resolve paths without error:

```
pnpm add -D @types/node
```

vite.config.ts
```
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```
Run the CLI
Run the shadcn init command to setup your project:
```
pnpm dlx shadcn@latest init
```
You will be asked a few questions to configure components.json.
```
Which color would you like to use as base color? › Neutral
```
Add Components
You can now start adding components to your project.
```
pnpm dlx shadcn@latest add button
```
The command above will add the Button component to your project. You can then import it like this:

src/App.tsx
```
import { Button } from "@/components/ui/button"
 
function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Button>Click me</Button>
    </div>
  )
}
 
export default App
```