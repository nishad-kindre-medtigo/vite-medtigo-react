import React from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  Paper,
  Divider,
  Grid
} from "@mui/material";

const ClerkChat = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Logo Section */}
        <Box sx={{
          width: "100%",
          bgcolor: "white",
          display: "flex",
          justifyContent: "center",
          mb: 4
        }}>
          <img
            src="https://medtigo.com/wp-content/uploads/2024/05/medtigo_2-1.svg"
            alt="medtigo Logo"
            style={{
              height: "50px",
              width: "168px"
            }}
          />
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Left Column - iframe */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ height: "100%" }}>
            <iframe
              src="https://clerk.chat/misc/sms-opt-in/?widgetId=472a3861-4a04-43f3-afdf-d0b39a295cc6"
              style={{ display: 'flex', height: '100%', width: '100%', minWidth: '320px', minHeight: '650px', border: 'none'}}
              id="clerk-opt-in-form"
              title="Clerk Chat Opt-in Form"
            />
            </Box>
          </Grid>

          {/* Right Column - Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography 
                variant="subtitle1" 
                gutterBottom 
                sx={{ 
                  mt: 3, 
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}
              >
                Message Frequency
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • You will receive messages as per number of licensing applications you have applied for.
              </Typography>
              <Typography variant="body2">
                • Frequency may increase based on your account activity and preferences.
              </Typography>

              <Typography 
                variant="subtitle1" 
                gutterBottom 
                sx={{ 
                  mt: 3, 
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}
              >
                Text Commands
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Text HELP to {"508-310-4810"} for assistance.
              </Typography>
              <Typography variant="body2">
                • Text STOP to {"508-310-4810"} to opt-out of messages.
              </Typography>

              <Typography 
                variant="subtitle1" 
                gutterBottom 
                sx={{ 
                  mt: 3, 
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}
              >
                Support Contact Information
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Email: <Link href="mailto:support@medtigo.com">support@medtigo.com</Link>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Email: <Link href="mailto:licensing@medtigo.com">licensing@medtigo.com</Link>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Phone: {"508-310-4810"}
              </Typography>
              <Typography variant="body2">
                • Website: <Link href="https://www.medtigo.com" target="_blank" rel="noopener noreferrer">www.medtigo.com</Link>
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '1.1rem'
                  }}
                >
                  Legal Information
                </Typography>
                <Link 
                  href="https://medtigo.com/privacy-policy" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  sx={{ 
                    mr: 3,
                    fontSize: '0.875rem' // Matches body2
                  }}
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="https://medtigo.com/term-of-use"
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ 
                    fontSize: '0.875rem' // Matches body2
                  }}
                >
                  Terms of Use
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ClerkChat;
