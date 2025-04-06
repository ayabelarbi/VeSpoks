import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { App } from './app/app.tsx'
import './index.css'

// Thème de base pour Chakra UI
const theme = extendTheme({
  colors: {
    brand: {
      500: '#641AE6', // Violet/purple
    },
    blue: {
      500: '#3182CE',
    },
    red: {
      500: '#E53E3E',
      100: '#FED7D7',
    },
  },
});

// Point d'entrée principal
console.log("Application starting...");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
