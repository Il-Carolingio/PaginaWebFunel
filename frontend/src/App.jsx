// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Funnel from './pages/Funnel';
import Catalogo from './pages/Catalogo';
import Reclutamiento from './pages/Reclutamiento';
import Crm from './pages/Crm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Box minH="100vh" bg="gray.50">
          <Navbar />
          <Box pt="100px">
          <Container maxW="container.xl" py={6}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rifa" element={<Funnel />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/reclutamiento" element={<Reclutamiento />} />
              <Route path="/crm" element={<Crm />} />
            </Routes>
          </Container>
          </Box>
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;
