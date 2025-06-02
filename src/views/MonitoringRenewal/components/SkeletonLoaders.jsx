import React from 'react';
import { Skeleton, Grid, Box } from '@mui/material';
import { StyledCard, CertificateContent, ActionContainer } from '../ui';
import useBreakpoints from '../../../hooks/useBreakpoints';

export const CertificateSkeletonList = ({ isCME = false, cards = 6 }) => {
  const { isMobile } = useBreakpoints();

  return (
    <>
      <Grid container spacing={3}>
        {[...Array(cards)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="circular" animation="wave" width={40} height={40} sx={{ background: '#E9F2FC' }} />
                <CertificateContent>
                  <Skeleton variant="text" animation="wave" width={40} sx={{ background: '#E9F2FC' }} />
                  <Skeleton variant="text" animation="wave" width={100} sx={{ background: '#E9F2FC' }} />
                  <Skeleton variant="text" animation="wave" width={120} sx={{ background: '#E9F2FC' }} />
                  {isCME && (
                    <Skeleton variant="text" animation="wave" width={150} sx={{ background: '#E9F2FC' }} />
                  )}
                </CertificateContent>
              </Box>
              {!isMobile && (
                <ActionContainer>
                  <Skeleton variant="circular" animation="wave" height={24} width={24} sx={{ background: '#E9F2FC' }} />
                  <Skeleton variant="circular" animation="wave" height={24} width={24} sx={{ background: '#E9F2FC' }} />
                  <Skeleton variant="rounded" animation="wave" width={80} height={26} sx={{ background: '#E9F2FC' }} />
                </ActionContainer>
              )}
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
