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
import { myRegistrations } from '../api';

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const MyRegistrations = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myRegistrations'],
    queryFn: myRegistrations,
  });

  return (
    <Box>
      <Heading size="lg" mb={6}>
        My Registrations
      </Heading>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {(error as Error).message}
        </Alert>
      )}
      {isLoading ? (
        <Spinner size="lg" />
      ) : !data?.length ? (
        <Text color="gray.500">You have not registered for any events</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {data
            .filter((r) => r.event)
            .map((r) => (
              <Card key={r.eventId}>
                <CardBody>
                  <Heading size="sm" noOfLines={1}>
                    {r.event!.name}
                  </Heading>
                  <Text fontSize="sm" color="gray.600" noOfLines={2} mt={2}>
                    {r.event!.description}
                  </Text>
                  <Text fontSize="xs" mt={2} display="flex" alignItems="center" gap={1}>
                    <Icon as={CalendarIcon} />
                    {formatDate(r.event!.date)}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {r.event!.location}
                  </Text>
                </CardBody>
                <CardFooter pt={0}>
                  <Button
                    as={Link}
                    to={`/events/${r.eventId}`}
                    size="sm"
                    colorScheme="blue"
                  >
                    View Event
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
