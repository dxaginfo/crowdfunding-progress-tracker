import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Container, Divider } from '@mui/material';
import { Campaign, TrendingUp, Groups, CreditCard } from '@mui/icons-material';

const HomePage: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          borderRadius: 2,
          mb: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Fund Your Music Projects
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            A comprehensive platform for musicians to create, manage, and track crowdfunding campaigns with real-time analytics and supporter engagement tools.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Get Started
                </Button>
              </Grid>
              <Grid item>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  color="primary"
                  size="large"
                >
                  Sign In
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Typography
        component="h2"
        variant="h3"
        color="text.primary"
        align="center"
        sx={{ mb: 4, fontWeight: 600 }}
      >
        Key Features
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <Campaign fontSize="large" color="primary" />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h3" align="center">
                Campaign Management
              </Typography>
              <Typography align="center">
                Create and manage customizable campaigns with funding goals, milestones, and reward tiers.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <TrendingUp fontSize="large" color="primary" />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h3" align="center">
                Real-time Analytics
              </Typography>
              <Typography align="center">
                Track funding progress with visual representations and milestone achievements in real time.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <Groups fontSize="large" color="primary" />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h3" align="center">
                Supporter Management
              </Typography>
              <Typography align="center">
                Communicate with backers, track reward fulfillment, and build stronger connections with fans.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <CreditCard fontSize="large" color="primary" />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h3" align="center">
                Secure Payments
              </Typography>
              <Typography align="center">
                Process payments securely with integrated payment gateways and detailed financial reporting.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* How It Works Section */}
      <Box sx={{ mt: 8, mb: 6 }}>
        <Typography
          component="h2"
          variant="h3"
          color="text.primary"
          align="center"
          sx={{ mb: 4, fontWeight: 600 }}
        >
          How It Works
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                1. Create Your Campaign
              </Typography>
              <Typography variant="body1" paragraph>
                Set up your crowdfunding campaign with a compelling title, description, funding goal, and timeline.
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                2. Add Milestones & Rewards
              </Typography>
              <Typography variant="body1" paragraph>
                Define milestones to track progress and create enticing reward tiers for your supporters.
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                3. Launch & Promote
              </Typography>
              <Typography variant="body1" paragraph>
                Launch your campaign and share it with your audience through integrated social media connections.
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                4. Monitor & Engage
              </Typography>
              <Typography variant="body1">
                Track your campaign's performance in real-time and engage with supporters through updates and messages.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: 3,
              }}
              alt="How it works illustration"
              src="https://via.placeholder.com/600x400?text=Campaign+Dashboard+Preview"
            />
          </Grid>
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 6,
          borderRadius: 2,
          mt: 6,
          mb: 6,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ready to Fund Your Music Project?
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          Join thousands of musicians who have successfully funded their projects using our platform.
        </Typography>
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          color="secondary"
          size="large"
        >
          Start Your Campaign
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
