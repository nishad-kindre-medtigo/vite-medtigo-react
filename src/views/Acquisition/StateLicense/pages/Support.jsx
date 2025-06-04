import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Phone } from '@mui/icons-material';
import { SupportCard, PageBackText } from '../ui';
import useBreakpoints from 'src/hooks/useBreakpoints';

const ContactCard = ({ name, title, email, showIcon = true }) => (
  <SupportCard>
    <Box display="flex" gap={2}>
      {showIcon && (
        <img
          alt="Support"
          height="29px"
          width="22px"
          src="/icons/licensing/supportNotification.svg"
        />
      )}
      <Box>
        <Typography style={{ fontSize: '16px', fontWeight: 500 }}>
          {name}
        </Typography>
        <Typography mt={1} style={{ fontSize: '16px', fontWeight: 500, color: '#5E5E5E' }} >
          {title}
        </Typography>
        <Typography variant="body2" color="primary" mt={1}>
          <a
            style={{
              color: '#006CDE',
              textDecoration: 'underline',
              fontWeight: '500'
            }}
            href={`mailto:${email}`}
          >
            {email}
          </a>
        </Typography>
      </Box>
    </Box>
  </SupportCard>
);

const BookMeetingCard = () => {
  return (
    <SupportCard>
      <Box>
        <Typography variant="body2" color="primary" mt={1}>
          <a
            href="mailto:licensing@medtigo.com"
            style={{
              color: '#006CDE',
              textDecoration: 'underline',
              fontWeight: '500'
            }}
          >
            licensing@medtigo.com
          </a>
        </Typography>
        <Box
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}
          mt={1}
        >
          <Phone
            style={{
              height: '20px',
              color: '#206BBA'
            }}
          />
          <a
            style={{
              color: '#000000',
              textDecoration: 'none',
              fontWeight: '500'
            }}
            href="tel:+508-310-4810"
          >
            508-310-4810
          </a>
        </Box>
      </Box>
    </SupportCard>
  );
};

const SupportPage = ({ supportData, goBack }) => {
  const { isMobile } = useBreakpoints();
  const { analyst, lead } = supportData;

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <PageBackText goBack={goBack} text={isMobile ? "Contact our support team" : "Contact our support team for licensing queries"} />
      </Grid>
      {analyst && (
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ContactCard name={analyst?.name} title="Analyst" email={analyst.email} />
        </Grid>
      )}
      {lead && (
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ContactCard name={lead?.name} title="Lead Analyst" email={lead?.email} />
        </Grid>
      )}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <ContactCard
          name="Rajashree Shinde"
          title="Licensing Manager"
          email="rshinde@medtigo.com"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <BookMeetingCard />
      </Grid>
    </Grid>
  );
};

export default SupportPage;
