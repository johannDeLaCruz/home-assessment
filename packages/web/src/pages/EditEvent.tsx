import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Button,
  Spinner,
  Alert,
  AlertIcon,
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

export const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: evt, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => events.get(id!),
    enabled: !!id,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  useEffect(() => {
    if (evt) {
      const d = new Date(evt.date);
      const local = d.toISOString().slice(0, 16);
      reset({
        name: evt.name,
        description: evt.description,
        date: local,
        location: evt.location,
        capacity: evt.capacity,
      });
    }
  }, [evt, reset]);

  const updateMu = useMutation({
    mutationFn: (data: FormData) =>
      events.update(id!, {
        name: data.name,
        description: data.description,
        date: data.date,
        location: data.location,
        capacity: Number(data.capacity),
      }),
    onSuccess: () => {
      toast({ title: 'Event updated', status: 'success' });
      navigate(`/events/${id}`);
    },
    onError: (err) => toast({ title: (err as Error).message, status: 'error' }),
  });

  const onSubmit = (data: FormData) => updateMu.mutate(data);

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
    <Box maxW="xl">
      <Heading size="lg" mb={6}>
        Edit Event
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.name} mb={4}>
          <FormLabel>Name</FormLabel>
          <Input
            {...register('name', { required: 'Name is required' })}
            defaultValue={evt.name}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.description} mb={4}>
          <FormLabel>Description</FormLabel>
          <Textarea
            {...register('description', { required: 'Description is required' })}
            defaultValue={evt.description}
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
            defaultValue={evt.location}
          />
          <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.capacity} mb={6}>
          <FormLabel>Capacity</FormLabel>
          <NumberInput min={1}>
            <NumberInputField
              {...register('capacity', {
                required: 'Capacity is required',
                min: { value: 1, message: 'Min 1' },
              })}
            />
          </NumberInput>
          <FormErrorMessage>{errors.capacity?.message}</FormErrorMessage>
        </FormControl>
        <Button type="submit" colorScheme="blue" isLoading={updateMu.isPending}>
          Save Changes
        </Button>
      </form>
    </Box>
  );
};
