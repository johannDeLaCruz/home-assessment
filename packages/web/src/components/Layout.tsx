import { Outlet } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  Spacer,
  Button,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Layout = () => (
  <Box minH="100vh" bg="gray.50">
    <Box as="nav" bg="white" shadow="sm" py={3}>
      <Container maxW="container.xl">
        <Flex align="center" gap={6}>
          <Heading size="md" as={RouterLink} to="/" _hover={{ opacity: 0.8 }}>
            Event Platform
          </Heading>
          <Link as={RouterLink} to="/events" fontWeight="medium">
            Events
          </Link>
          <Spacer />
          <NavAuth />
        </Flex>
      </Container>
    </Box>
    <Container maxW="container.xl" py={8}>
      <Outlet />
    </Container>
  </Box>
);

const NavAuth = () => {
  const { token, user, logout, isOrganizer } = useAuthStore();

  if (token && user) {
    return (
      <Flex align="center" gap={4}>
        {isOrganizer() && (
          <Link as={RouterLink} to="/me/events" fontWeight="medium">
            My Events
          </Link>
        )}
        <Link as={RouterLink} to="/me/registrations" fontWeight="medium">
          My Registrations
        </Link>
        <Box fontSize="sm" color="gray.600">
          {user.email}
        </Box>
        <Button size="sm" variant="outline" onClick={logout}>
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex gap={2}>
      <Button as={RouterLink} to="/login" size="sm" variant="ghost">
        Login
      </Button>
      <Button as={RouterLink} to="/signup" size="sm" colorScheme="blue">
        Sign up
      </Button>
    </Flex>
  );
};
