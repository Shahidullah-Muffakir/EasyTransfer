import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateRequest from './pages/CreateRequest';
import EditRequest from './pages/EditRequest';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/create"
                element={
                  <PrivateRoute>
                    <CreateRequest />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <PrivateRoute>
                    <EditRequest />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
