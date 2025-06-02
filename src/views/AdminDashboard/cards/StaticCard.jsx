import React from 'react';
import { CardTitle, ClickText, DetailBox, GreyBox } from '../../../views/dashboard/components';
import { Box, Typography } from '@mui/material';

const StaticCard = () => {
  return (
    <DetailBox>
      <CardTitle title="Health Care Certificate" />
      <GreyBox sx={{flexGrow: 1, mt: 1, minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Typography style={{color: '#808080', fontSize: '20px', fontWeight: 500}}>
          Adding Soon
        </Typography>
      </GreyBox>
      <Box style={{ visibility: 'hidden'}}>
        <ClickText link="/cme-compliance" />
      </Box>
    </DetailBox>
  );
};

export default StaticCard;
