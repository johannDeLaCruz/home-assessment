import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  Card,
  CardBody,
  Heading,
} from '@chakra-ui/react';
import { useAuthStore } from '../store/authStore';
import { auth } from '../api';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/events';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await auth.signIn(email, password);
      setAuth(res.token, res.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" pt={8}>
      <Card>
        <CardBody>
          <Heading size="lg" mb={6}>
            Log in
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!error}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </FormControl>
              <FormControl isInvalid={!!error}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <FormErrorMessage>{error}</FormErrorMessage>
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full" isLoading={loading}>
                Log in
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
};
