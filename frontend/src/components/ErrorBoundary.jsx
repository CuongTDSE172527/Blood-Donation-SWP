import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    // Here you could send error to logging service
    // logErrorToService(error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: 64, color: '#f44336', mb: 2 }} />
            <Typography variant="h4" gutterBottom color="error">
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </Typography>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleRefresh}
              sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
            >
              Refresh Page
            </Button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Typography variant="h6" gutterBottom>
                  Error Details (Development):
                </Typography>
                <Typography variant="body2" component="pre" sx={{ 
                  bgcolor: '#f5f5f5', 
                  p: 2, 
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.75rem'
                }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 