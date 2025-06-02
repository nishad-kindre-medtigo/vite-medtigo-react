import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, List, ListItem } from '@mui/material';
import { Arrow, CardTitle, ClickText, DetailBox, GreyBox } from '../components';

const CertificateListItem = ({ title, count }) => {
  return (
    <ListItem style={{ padding: 0, marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
      <Typography style={{ fontSize: '14px', fontWeight: 500, width: '190px' }}>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1}}>
        <Arrow />
      </Box>
      <Typography style={{ fontSize: '14px', fontWeight: 500, width: '10px' }}>
        {count}
      </Typography>
    </ListItem>
  );
};

const CertificateCard = ({generatedCertificatesCount, addedCertificatesCount, oldCertificatesCount}) => {
  return (
    <DetailBox>
      <CardTitle
        title="Certificates"
        description="Track your generated provider card, and with the 'Add Certificate' feature, you can easily upload your existing provider cards. We will also keep your old certificates."
      />
      <GreyBox sx={{ flexGrow: 1 }}>
        <List style={{ padding: 0, paddingTop: '20px', flexGrow: 1 }}>
          <CertificateListItem title="Generated Provider Cards" count={generatedCertificatesCount} />
          <CertificateListItem title="Added Provider Cards" count={addedCertificatesCount} />
          <CertificateListItem title="Old Provider Cards" count={oldCertificatesCount} />
        </List>
      </GreyBox>
      <ClickText link="/monitoring-renewal/clinical-certificate" />
    </DetailBox>
  );
};

CertificateCard.propTypes = {
  generatedCertificatesCount: PropTypes.number.isRequired,
  addedCertificatesCount: PropTypes.number.isRequired,
  oldCertificatesCount: PropTypes.number.isRequired
};

export default CertificateCard;
