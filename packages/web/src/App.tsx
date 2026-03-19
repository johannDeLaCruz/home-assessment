import { Component, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider, Alert, AlertIcon, AlertTitle, AlertDescription, Button, Box } from '@chakra-ui/react';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { CreateEvent } from './pages/CreateEvent';
import { EditEvent } from './pages/EditEvent';
import { MyEvents } from './pages/MyEvents';
import { MyRegistrations } from './pages/MyRegistrations';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 0, refetchOnWindowFocus: false },
  },
});

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <Box p={8} maxW="xl" mx="auto">
          <Alert status="error" flexDirection="column" alignItems="stretch">
            <AlertIcon />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              {this.state.error.message}
            </AlertDescription>
            <Button
              mt={4}
              size="sm"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </Button>
          </Alert>
        </Box>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ChakraProvider>
      <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/events" replace />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route
                path="me/events"
                element={
                  <ProtectedRoute role="organizer">
                    <MyEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="me/registrations"
                element={
                  <ProtectedRoute>
                    <MyRegistrations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="events/new"
                element={
                  <ProtectedRoute role="organizer">
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="events/:id/edit"
                element={
                  <ProtectedRoute role="organizer">
                    <EditEvent />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default App;
