import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { events } from '../api';

interface FormData {
  name: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
}

export const CreateEvent = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const createMu = useMutation({
    mutationFn: (data: FormData) =>
      events.create({
        name: data.name,
        description: data.description,
        date: data.date,
        location: data.location,
        capacity: Number(data.capacity),
      }),
    onSuccess: (data) => {
      if (!data?.id) {
        toast({ title: 'Event created', status: 'success' });
        navigate('/me/events');
        return;
      }
      toast({ title: 'Event created', status: 'success' });
      navigate(`/events/${data.id}`);
    },
    onError: (err) => toast({ title: (err as Error).message, status: 'error' }),
  });

  const onSubmit = (data: FormData) => createMu.mutate(data);

  return (
    <Box maxW="xl">
      <Heading size="lg" mb={6}>
        Create Event
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.name} mb={4}>
          <FormLabel>Name</FormLabel>
          <Input
            {...register('name', { required: 'Name is required' })}
            placeholder="Event name"
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.description} mb={4}>
          <FormLabel>Description</FormLabel>
          <Textarea
            {...register('description', { required: 'Description is required' })}
            placeholder="Describe your event"
            rows={4}
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.date} mb={4}>
          <FormLabel>Date</FormLabel>
          <Input
            type="datetime-local"
            {...register('date', { required: 'Date is required' })}
          />
          <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.location} mb={4}>
          <FormLabel>Location</FormLabel>
          <Input
            {...register('location', { required: 'Location is required' })}
            placeholder="Event location"
          />
          <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.capacity} mb={6}>
          <FormLabel>Capacity</FormLabel>
          <Input
            type="number"
            min={1}
            {...register('capacity', {
              required: 'Capacity is required',
              min: { value: 1, message: 'Min 1' },
              valueAsNumber: true,
            })}
            placeholder="Max attendees"
          />
          <FormErrorMessage>{errors.capacity?.message}</FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={createMu.isPending}
        >
          Create Event
        </Button>
      </form>
    </Box>
  );
};
