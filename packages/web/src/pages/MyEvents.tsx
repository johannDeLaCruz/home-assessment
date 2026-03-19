import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Button,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Icon,
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { myEvents } from '../api';

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const MyEvents = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myEvents'],
    queryFn: myEvents,
  });

  return (
    <Box>
      <Heading size="lg" mb={6}>
        My Events
      </Heading>
      <Button as={Link} to="/events/new" colorScheme="blue" mb={6}>
        Create Event
      </Button>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {(error as Error).message}
        </Alert>
      )}
      {isLoading ? (
        <Spinner size="lg" />
      ) : !data?.length ? (
        <Text color="gray.500">You have not created any events yet</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {data.map((evt) => (
            <Card key={evt.id}>
              <CardBody>
                <Heading size="sm" noOfLines={1}>
                  {evt.name}
                </Heading>
                <Text fontSize="sm" color="gray.600" noOfLines={2} mt={2}>
                  {evt.description}
                </Text>
                <Text fontSize="xs" mt={2} display="flex" alignItems="center" gap={1}>
                  <Icon as={CalendarIcon} />
                  {formatDate(evt.date)}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {evt.location} · {evt.capacity} spots
                </Text>
              </CardBody>
              <CardFooter pt={0}>
                <Button as={Link} to={`/events/${evt.id}`} size="sm" colorScheme="blue">
                  View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
