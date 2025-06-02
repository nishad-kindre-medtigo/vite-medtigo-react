import React from 'react';
import { Skeleton, Card, CardContent, Grid, Box } from '@mui/material';
import { courses } from '../data';
import { CourseCard, ImageBox, CourseImage, CardActions } from '../ui';

export const CourseCardSkeleton = ({ CONNECT_COURSES }) => {
  return (
    <Grid container rowSpacing={3} columnSpacing={3}>
      {CONNECT_COURSES.map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <CourseCard>
            <ImageBox>
              <CourseImage
                src={courses[index].image}
                alt={courses[index].title}
              />
            </ImageBox>
            <CardActions>
              <Skeleton variant="rounded" animation="wave" width="25%" height={32} sx={{ my: 0.5, background: '#E9F2FC' }}/>
            </CardActions>
          </CourseCard>
        </Grid>
      ))}
    </Grid>
  );
};

export const OldCertificateSkeleton = () => {
  return (
    <Grid container rowSpacing={3} columnSpacing={3} justifyContent="center">
      {[...Array(4)].map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card p={1} sx={{border: '1px solid #dfdfdf', borderRadius: '2px', boxShadow: '0px 4px 6px -1px #efefef',}} elevation={0}>
            <Skeleton variant="rectangular" animation="wave" width="100%" height={186} sx={{ background: '#E9F2FC' }}/>
            <CardContent p={1} pb={0}>
              <Grid container alignItems="flex-end" justifyContent="space-between">
                <Grid item>
                  <Skeleton variant="text" animation="wave" height={24} width={130} sx={{ background: '#E9F2FC' }}/>
                  <Skeleton variant="text" animation="wave" height={24} width={130} sx={{ background: '#E9F2FC' }}/>
                </Grid>
                <Grid item display='flex' gap={1} >
                  <Skeleton variant="circular" animation="wave" height={24} width={24} sx={{ background: '#E9F2FC' }}/>
                  <Skeleton variant="circular" animation="wave" height={24} width={24} sx={{ background: '#E9F2FC' }}/>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export const CertificateSkeletonList = ({ isCME, isSmallMobile, grid=6, cards=4 }) => {
  return (
    <>
      {isCME && (
        <Skeleton variant="text" animation="wave" width="10%" sx={{ background: '#E9F2FC', marginBottom: '6px' }}/>
      )}
      <Grid container rowSpacing={2} columnSpacing={2}>
        {[...Array(cards)].map((_, index) => (
          <Grid item xs={12} sm={grid} key={index}>
            <Box
              sx={{
                border: '1px solid #dfdfdf',
                borderRadius: '2px',
                boxShadow: '0px 4px 6px -1px #efefef',
                p: 2,
                width: '100%',
                // minHeight: '120px'
              }}
            >
              <Grid container>
                <Grid item xs={8} sm={6} display='flex' gap={1}>
                  <Skeleton variant="circular" animation="wave" width={40} height={40} sx={{ background: '#E9F2FC' }}/>
                  <Box>
                    <Skeleton variant="text" animation="wave" width={40} sx={{ background: '#E9F2FC' }}/>
                    <Skeleton variant="text" animation="wave" width={100} sx={{ background: '#E9F2FC' }}/>
                    <Skeleton variant="text" animation="wave" width={120} sx={{ background: '#E9F2FC' }}/>
                    {isCME && !isSmallMobile && (
                      <Skeleton variant="text" animation="wave" width={130} sx={{ background: '#E9F2FC' }}/>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={4} sm={6} display='flex' justifyContent="flex-end" alignItems="flex-end" gap={1} >
                  {!isSmallMobile && (
                    <>
                      <Skeleton variant="circular" animation="wave" height={24} width={24} sx={{ background: '#E9F2FC' }}/>
                      <Skeleton variant="circular" animation="wave" height={24} width={24} sx={{ background: '#E9F2FC' }}/>
                    </>
                  )}
                  {!isCME && (
                    <Skeleton variant="rounded" animation="wave" width={80} height={26} sx={{ background: '#E9F2FC' }}/>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
