import React from 'react';
import { Dialog, DialogContent, Grid, Box, Typography } from '@mui/material';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import { BasicPlanCard, StandardPlanCard, BestValuePlanCard, FullAccessPlanCard, SingleCard, COLORS, FONT } from '../components/DialogCards';
import { Transition } from '../../../../ui/Transition';
import { useMyLearningContext } from '../../../../context/MyLearningContext';
import useBreakpoints from '../../../../hooks/useBreakpoints';

const ExplorePlansDialog = ({ fullAccess }) => {
  const { isMobile, isTablet } = useBreakpoints();
  const { dialogs, courseData, handleCloseDialog, currentPlan } = useMyLearningContext();
  const { title, id, cmeCredits, color, dialogImage, courseImage, courseMobileImage, creditsBadge, cardImg1, cardImg2 } = courseData;

  const handleClose = () => {
    handleCloseDialog('explore');
  }

  // const addonPrice = currentPlan === 'basic' ? '$20' : '$5';

  const CoursePlanCards = ({ fullAccess }) => {
    // Display Single Plan Card for NRP, ASC CE
    if (id == 79132 || id == 151904) {
      return (
        <Grid container my={2} justifyContent="center">
          <Grid item xs={12}>
            <SingleCard title={title} cardImg1={cardImg1} isMobile={isMobile} fullAccess={fullAccess} currentPlan={currentPlan} />
          </Grid>
        </Grid>
      );
    }

    // Display Three Plan Cards - Basic, Standard, Best Value/ Addon for ACLS, BLS & PALS Course
    return (
      <Grid item xs={12} container my={2} columnSpacing={2} rowSpacing={isTablet && 2}>
        <Grid item xs={12} md={4}>
          <BasicPlanCard title={title} cardImg1={cardImg1} currentPlan={currentPlan} isMobile={isMobile}/>
        </Grid>
        <Grid item xs={12} md={4}>
          <StandardPlanCard title={title} cardImg1={cardImg1} currentPlan={currentPlan} isMobile={isMobile}/>
        </Grid>
        <Grid item xs={12} md={4}>
          <BestValuePlanCard title={title} creditsBadge={creditsBadge} cardImg2={cardImg2} isMobile={isMobile} cmeCredits={cmeCredits} currentPlan={currentPlan} fullAccess={fullAccess}/>
          {/* REMOVED ADDON PLAN CARD */}
          {/* {currentPlan === 'basic' || currentPlan === 'standard' ? (
            <AddonBestValuePlanScreenCard currentPlan={currentPlan} title={title} cardImg2={cardImg2} isMobile={isMobile} creditsBadge={creditsBadge} cmeCredits={cmeCredits}/>
          ) : (
            <BestValuePlanCard title={title} creditsBadge={creditsBadge} cardImg2={cardImg2} isMobile={isMobile} cmeCredits={cmeCredits} currentPlan={currentPlan} fullAccess={fullAccess}/>
          )} */}
        </Grid>
      </Grid>
    );
  };

  const CurrentCourseText = ({ currentPlan, isMobile, addonPrice }) => {
    if (currentPlan === 'basic' || currentPlan === 'standard') {
      return (
        <Typography mt={1} sx={{ color: COLORS.darkRed, fontWeight: 600, fontSize: isMobile ? FONT.normal : FONT.normal }}>
          You have already purchased the {currentPlan} plan. Unlock the best value with just {addonPrice} more!
        </Typography>
      );
    }
  
    return null;
  };

  return (
    <Dialog fullScreen maxWidth='xl' open={dialogs.explore} onClose={handleClose} TransitionComponent={Transition}>
      <CancelIcon fontSize='large' sx={{ position: 'absolute', top: { xs: '28px', sm: '16px' }, right: '24px', zIndex: 999, cursor: 'pointer', color: { xs: '#aaa', sm: 'white' } }} onClick={handleClose}/>
      <DialogContent sx={{ m: 0, p: 0 , position: 'relative', background: '#F7FBFF', display: 'flex', justifyContent: 'center' }}>
        <Box style={{ width: '100%', height: isMobile ? '120px' : '180px', background: color, display: 'flex', justifyContent: 'center' }}>
          <img src={ isMobile ? courseMobileImage : courseImage} alt="Dialog Image" height={70}/>
        </Box>
        <Box sx={{ position: 'absolute', top: 70, backgroundColor: '#F7FBFF', mx: { xs: '4%', sm: '2%'}, maxWidth: '1377px' }}>
          <Grid container >
            <FullAccessPlanCard isMobile={isMobile} courseID={id} currentPlan={currentPlan} fullAccess={fullAccess} />
            {/* REMOVED ADDON PLAN CARD */}
            {/* <CurrentCourseText currentPlan={currentPlan} isMobile={isMobile} addonPrice={addonPrice} />  */}
            <CoursePlanCards fullAccess={fullAccess} />
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ExplorePlansDialog);
