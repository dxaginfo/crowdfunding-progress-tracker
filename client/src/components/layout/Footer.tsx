import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { GitHub, Twitter, Instagram } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.background.paper,
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              CrowdFund Tracker
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A platform for musicians to manage music project fundraisers with comprehensive pledge tracking.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Features
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Campaign Management
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Real-time Progress Tracking
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Supporter Management
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <Link href="#" color="inherit">
                Documentation
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <Link href="#" color="inherit">
                FAQ
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <Link href="#" color="inherit">
                Support
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Connect With Us
            </Typography>
            <Box>
              <IconButton aria-label="github" color="inherit">
                <GitHub />
              </IconButton>
              <IconButton aria-label="twitter" color="inherit">
                <Twitter />
              </IconButton>
              <IconButton aria-label="instagram" color="inherit">
                <Instagram />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' CrowdFund Tracker. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
