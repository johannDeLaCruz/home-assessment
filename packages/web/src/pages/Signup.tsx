import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Link,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useAuthStore } from '../store/authStore';
import { auth } from '../api';

export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'organizer' | 'attendee'>('attendee');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await auth.signUp(email, password, role);
      setAuth(res.token, res.user);
      navigate('/events', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" pt={8}>
      <Card>
        <CardBody>
          <Heading size="lg" mb={6}>
            Sign up
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
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                />
                <FormErrorMessage>{error}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <RadioGroup value={role} onChange={(v) => setRole(v as 'organizer' | 'attendee')}>
                  <Stack direction="row" spacing={4}>
                    <Radio value="attendee">Attendee</Radio>
                    <Radio value="organizer">Organizer</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full" isLoading={loading}>
                Sign up
              </Button>
              <Link as={RouterLink} to="/login" color="blue.600" fontSize="sm">
                Already have an account? Log in
              </Link>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
};
