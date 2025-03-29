import { Box, Container, Flex, useColorMode, IconButton, Button } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, signOut } = useAuth();

  return (
    <Box minH="100vh">
      <Box as="nav" bg="white" boxShadow="sm" py={4}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <RouterLink to="/">
              <Box fontSize="xl" fontWeight="bold">
              AfghanLink
              </Box>
            </RouterLink>
            <Flex align="center" gap={4}>
              <IconButton
                aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
              />
              {user ? (
                <>
                  <Button as={RouterLink} to="/create" colorScheme="blue">
                    Create Request
                  </Button>
                  <Button onClick={signOut} variant="ghost">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button as={RouterLink} to="/login" colorScheme="blue">
                  Sign In
                </Button>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 