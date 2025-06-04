import React from 'react';
import PropTypes from 'prop-types';
import { Typography  } from '@mui/material';
import { CardTitle,  DetailBox, DonutChart, GreyBox } from '../components';

const CMEComplianceCard = ({ claimedCreditPoints, cmeClaimPendingCount, userAddedCreditPoints }) => {

  return (
    <DetailBox>
      <CardTitle
        title="CME Compliance"
        description="CME compliance helps you monitor your CME credits and claim credit for completed courses. Additionally, generate compliance reports for all 50 states in the USA."
        link="/monitoring-renewal/ce-cme"
      />
      <GreyBox sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography mt={1} mb={2} style={{ fontSize: '14px', fontWeight: 600 }}>
          Check CME Credit Count Below
        </Typography>
        
        {/* Chart and Legend */}
        <DonutChart
          dataOne={claimedCreditPoints}
          dataTwo={cmeClaimPendingCount} 
          dataThree={userAddedCreditPoints}
          labelOne="Claimed CME Credit"
          labelTwo="Claim Pending"
          labelThree="Added by you"
        />
      </GreyBox>
    </DetailBox>
  );
};

CMEComplianceCard.propTypes = {
  claimedCreditPoints: PropTypes.number.isRequired,
  cmeClaimPendingCount: PropTypes.number.isRequired,
  userAddedCreditPoints: PropTypes.number.isRequired
};

export default CMEComplianceCard;
