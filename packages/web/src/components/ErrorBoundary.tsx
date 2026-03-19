import { Component, type ReactNode } from 'react';
import { Box, Button, Heading, Text } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <Box p={8} bg="red.50" borderRadius="md">
          <Heading size="md" color="red.700" mb={2}>
            Something went wrong
          </Heading>
          <Text fontSize="sm" color="gray.700" mb={4} fontFamily="mono">
            {this.state.error.message}
          </Text>
          <Button
            size="sm"
            colorScheme="red"
            onClick={() => window.location.reload()}
          >
            Reload page
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
