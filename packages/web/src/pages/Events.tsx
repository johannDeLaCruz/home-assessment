import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
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
import { CalendarIcon, SearchIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { events } from '../api';

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const Events = () => {
  const [dateFilter, setDateFilter] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['events', dateFilter],
    queryFn: () => events.list(dateFilter || undefined),
  });

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Discover Events
      </Heading>
      <InputGroup maxW="sm" mb={6}>
        <InputLeftElement>
          <Icon as={SearchIcon} />
        </InputLeftElement>
        <Input
          type="date"
          placeholder="Filter by date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </InputGroup>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {(error as Error).message}
        </Alert>
      )}
      {isLoading ? (
        <Spinner size="lg" />
      ) : !data?.length ? (
        <Text color="gray.500">No events found</Text>
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
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
