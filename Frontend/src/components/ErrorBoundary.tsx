import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { ErrorOutlineRounded } from '@mui/icons-material';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5',
            padding: 3,
          }}
        >
          <Stack alignItems="center" spacing={3} maxWidth={500}>
            <ErrorOutlineRounded sx={{ fontSize: 80, color: 'error.main' }} />
            <Typography variant="h4" fontWeight="bold" textAlign="center">
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" textAlign="center" color="textSecondary">
              An unexpected error occurred. Please try refreshing the page or go back to the home page.
            </Typography>
            {import.meta.env.DEV && this.state.error && (
              <Box
                sx={{
                  backgroundColor: '#ffebee',
                  border: '1px solid #ef5350',
                  borderRadius: 1,
                  padding: 2,
                  width: '100%',
                  overflow: 'auto',
                  maxHeight: 200,
                }}
              >
                <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button variant="contained" onClick={this.handleReset}>
                Go Home
              </Button>
            </Stack>
          </Stack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
