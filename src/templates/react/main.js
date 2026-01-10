export const getApp = (options) => {
  const { addRouter, addContext } = options;
  let appImports = `import { Layout } from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
`;

  if (addRouter) {
    appImports += `import { BrowserRouter, Routes, Route } from 'react-router-dom';\n`;
  }
  if (addContext) {
    appImports += `import { AppProvider } from './context/AppContext';\n`;
  }

  let appContent = `
    ${addRouter ? `
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
    ` : `
    <Layout>
      <Home />
    </Layout>
    `}
  `;

  if (addContext) {
    appContent = `
      <AppProvider>
        ${appContent}
      </AppProvider>
    `;
  }

  return `
${appImports}

function App() {
  return (
    ${appContent}
  );
}

export default App;
`;
};

export const getAppContext = (options) => {
  const { isTypescript, addShadcn } = options;
  const useTs = isTypescript || addShadcn;
  
  return `import React, { createContext, useContext, useState${useTs ? ', ReactNode' : ''} } from 'react';

${useTs ? 'interface AppContextType {\n  theme: string;\n  toggleTheme: () => void;\n}\n' : ''}
const AppContext = createContext${useTs ? '<AppContextType | undefined>(undefined)' : '()'};

export const AppProvider = ({ children }${useTs ? ': { children: ReactNode }' : ''}) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
`;
};

export const getViteConfig = () => {
  return `import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
`;
};
