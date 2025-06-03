import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Button, Link } from '@mui/material';

const OnboardingIcon = "/icons/licensing/Onboarding.svg"
const AppReviewIcon = "/icons/licensing/Review.svg"
const VerificationIcon = "/icons/licensing/Verification.svg"
const MonitorIcon = "/icons/licensing/Monitor.svg"
const ChatIcon = "/icons/licensing/Communication.svg"

const ProcessStep = ({ number, title, icon, content, isImage }) => (
  <Box sx={{ position: 'relative', textAlign: 'center', pb: 3 }}>
    {isImage && (
      <>
        <Box
          sx={{
            width: { xs: '100px !important', sm: '100px !important', md: '100px !important' },
            height: { xs: '50px !important', sm: '50px !important', md: '50px !important' },
            background: 'rgba(90, 175, 253, 0.4)', 
            borderRadius: '50px 50px 0 0',
            position: 'absolute',
            top: { xs: '-47px', sm: '-47px', md: '-50px !important' },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 0,
          }}
        />
        <img
          src={icon}
          alt={title}
          style={{
            width: '70px',
            height: '70px',
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            borderRadius: '50%',
          }}
        />
      </>
    )}
    <Card
      sx={{
        width: { xs: '280px', sm: '320px', md: '400px' },
        height: { xs: '280px', sm: '300px', md: '295px' },
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 0px 10px 0px #00000040',
        pt: isImage ? 5 : 0,
        mt: isImage ? 3 : 0,
        borderRadius: '2px 0px 0px 0px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          align="center"
          sx={{
            fontSize: { xs: '18px', sm: '22px', md: '24px !important' },
            fontWeight: '700 !important',
            color: '#2872C1',
            textAlign: 'center',
          }}
        >
          {number}. {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '14px', sm: '16px', md: '18px !important' },
            fontWeight: '400 !important',
            textAlign: 'center !important',
            color: '#0A1C2C !important',
          }}
        >
          {content}
        </Typography>
      </CardContent>
    </Card>
  </Box>
);

const LicensingProcessPage = () => {
  const steps = [
    {
      number: '01',
      title: 'Onboarding',
      icon: OnboardingIcon,
      isImage: true,
      content: (
        <>
          Connect with our expert team by{' '}
          <Link
            href="https://landing.medtigo.com/licensing/FreeConsultation/"
            underline="hover"
            target="_blank"
            sx={{
              fontSize: { xs: '14px', sm: '16px', md: '18px !important' },
              fontWeight: '600 !important',
              color: '#2872C1',
            }}
          >
            booking a call
          </Link>
          {" to discuss your licensing needs. Once ready, you'll be integrated into our dashboard to upload your CV and manage your application seamlessly."}
        </>
      ),
    },
    {
      number: '02',
      title: 'Application Review',
      icon: AppReviewIcon,
      isImage: true,
      content:
        'You will receive a draft application from your analyst for your review. Once you confirm its accuracy, it will be submitted to the State Medical Board.',
    },
    {
      number: '03',
      title: 'Verifications Requested',
      icon: VerificationIcon,
      isImage: true,
      content:
        "Our team will handle all primary source verifications required by the medical board. If needed, we'll also assist with coordinating background screenings to ensure a smooth process.",
    },
    {
      number: '04',
      title: 'Monitor Until Approval',
      icon: MonitorIcon,
      isImage: true,
      content:
        'Your licensing analyst will maintain constant communication with the State Medical Board, ensuring all necessary requirements are met and continuously following up until your license is granted.',
    },
    {
      number: '05',
      title: 'Communication',
      icon: ChatIcon,
      isImage: true,
      content:
        'You will receive weekly updates on the status of your application from your Medtigo licensing analyst. Additionally, our dashboard is available 24/7 for real-time updates, keeping you informed every step of the way.',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, 
    px: { xs: 2, sm: 3, md: 5 },
    padding: '40px',
     }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          fontSize: { xs: '24px', sm: '28px', md: '32px !important' },
          color: '#3A3A3A',
          fontWeight: '600',
          pb: { xs: 3, sm: 4, md: 5 },
        }}
      >
        Overview of the Medical Licensing Process
      </Typography>
      <Grid container spacing={3} justifyContent="center">
      <Grid>
          <ProcessStep {...steps[0]} />
        </Grid>
        <Grid>
          <ProcessStep {...steps[1]} />
        </Grid>
        <Grid>
          <ProcessStep {...steps[2]} />
        </Grid>
        <Grid>
          <ProcessStep {...steps[3]} />
        </Grid>
        <Grid>
          <ProcessStep {...steps[4]} />
        </Grid>
      </Grid>
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant='contained' 
          href="https://landing.medtigo.com/licensing/FreeConsultation/"
          target="_blank"
          size='large'
          style={{fontSize:'18px', padding:'12px 36px'}}
        >
          Book A Free Consultation
        </Button>
      </Box>
    </Box>
  );
};

export default LicensingProcessPage;
