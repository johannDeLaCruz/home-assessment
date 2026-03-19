import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Heading,
  Text,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  HStack,
  VStack,
  Divider,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { CalendarIcon, InfoIcon, ViewIcon } from '@chakra-ui/icons';
import { events, registrations, myRegistrations } from '../api';
import { useAuthStore } from '../store/authStore';

const formatDate = (s: string) => {
  try {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    return d.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return s;
  }
};

export const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { user, isOrganizer } = useAuthStore();

  const { data: evt, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => events.get(id!),
    enabled: !!id,
  });

  const { data: regs } = useQuery({
    queryKey: ['registrations', id],
    queryFn: () => registrations.listByEvent(id!),
    enabled: !!id && !!user && isOrganizer(),
  });

  const { data: myRegs } = useQuery({
    queryKey: ['myRegistrations'],
    queryFn: myRegistrations,
    enabled: !!user,
  });

  const registerMu = useMutation({
    mutationFn: () => registrations.register(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      queryClient.invalidateQueries({ queryKey: ['myRegistrations'] });
      toast({ title: 'Registered!', status: 'success' });
    },
    onError: (err) => toast({ title: (err as Error).message, status: 'error' }),
  });

  const unregisterMu = useMutation({
    mutationFn: () => registrations.unregister(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      queryClient.invalidateQueries({ queryKey: ['myRegistrations'] });
      toast({ title: 'Registration cancelled', status: 'success' });
    },
    onError: (err) => toast({ title: (err as Error).message, status: 'error' }),
  });

  const deleteMu = useMutation({
    mutationFn: () => events.delete(id!),
    onSuccess: () => {
      navigate('/events');
      toast({ title: 'Event deleted', status: 'success' });
    },
    onError: (err) => toast({ title: (err as Error).message, status: 'error' }),
  });

  const isRegistered = myRegs?.some((r) => r.eventId === id);
  const isOwnEvent = user && evt && evt.organizerId === user.id;
  const isFull = evt && regs && regs.length >= evt.capacity;

  if (!id) return null;
  if (isLoading) return <Spinner size="lg" />;
  if (error || !evt)
    return (
      <Alert status="error">
        <AlertIcon />
        {(error as Error)?.message ?? 'Event not found'}
      </Alert>
    );

  return (
    <Box>
      <HStack justify="space-between" mb={6} flexWrap="wrap" gap={4}>
        <Heading size="lg">{evt.name}</Heading>
        {isOrganizer() && isOwnEvent && (
          <HStack>
            <Button as={Link} to={`/events/${id}/edit`} size="sm">
              Edit
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              onClick={() => deleteMu.mutate()}
              isLoading={deleteMu.isPending}
            >
              Delete
            </Button>
          </HStack>
        )}
      </HStack>
      <VStack align="stretch" spacing={3}>
        <Text display="flex" alignItems="center" gap={2}>
          <Icon as={CalendarIcon} /> {formatDate(evt.date)}
        </Text>
        <Text display="flex" alignItems="center" gap={2}>
          <Icon as={InfoIcon} /> {evt.location}
        </Text>
        <Text display="flex" alignItems="center" gap={2}>
          <Icon as={ViewIcon} /> {regs?.length ?? 0} / {Number(evt.capacity) || 0} registered
        </Text>
      </VStack>
      <Text mt={6}>{evt.description}</Text>
      <Divider my={6} />
      {user && !isOwnEvent && (
        <Box>
          {isRegistered ? (
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() => unregisterMu.mutate()}
              isLoading={unregisterMu.isPending}
            >
              Cancel Registration
            </Button>
          ) : isFull ? (
            <Badge colorScheme="red" fontSize="md" p={2}>
              Event is full
            </Badge>
          ) : (
            <Button
              colorScheme="blue"
              onClick={() => registerMu.mutate()}
              isLoading={registerMu.isPending}
            >
              Register for Event
            </Button>
          )}
        </Box>
      )}
      {isOrganizer() && isOwnEvent && regs && regs.length > 0 && (
        <Box mt={8}>
          <Heading size="sm" mb={3}>
            Registrations
          </Heading>
          <VStack align="stretch" spacing={2}>
            {regs.map((r) => (
              <Text key={r.userId} fontSize="sm">
                {r.user?.email ?? r.userId}
              </Text>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};
