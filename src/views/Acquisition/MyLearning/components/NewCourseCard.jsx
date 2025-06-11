import React from 'react';
import { Box } from '@mui/material';
import { courses, COURSE_ICONS } from '../data';
import { useNavigate } from 'react-router-dom';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import { CourseCard, ImageBox, ImageOverlay, CourseImage, CardActions, CourseProgress, ExpiryText,  ActionIcon, PrimaryText, ActionButton } from '../ui';

const NewCourseCard = React.memo(({ courseID, courseData, handleOpenDialog, handleButtonClick, setIsOrderTypeFullAccess }) => {
    const navigate = useNavigate();
    const openSnackbar = useOpenSnackbar();
    const { isOrderExpired, buttonText, progressSummary, order, providerCardData, cmeCertificateData } = courseData;
    const coursePlan = order?.plan || "no_access";
    const isOrderTypeFullAccess = order?.order_type == "Full_Access";
    const hash = order?.hash || null;
    const hasCME = order?.hasCME || false;
    const hasFullSizeCertificate = order?.hasFullSizeCertificate || false;

    const disableActionButton = courseID === 130360 && buttonText === "RENEW";

    const { progressPercentage, isCourseCompleted } = progressSummary;

    const hideLinearProgress = progressPercentage === 0 || progressPercentage === 100 || isOrderExpired || isCourseCompleted; // Hide Linear Progress Bar only when course is not started & if course plan is expired
    const currentCourse = courses.find(item => item.id == courseID); // Store static data for course (e.g. images, title, id)

    const unlockCourse = buttonText == 'EXPLORE PLANS' || buttonText == 'FREE COURSE';

    // Action when course image is clicked - Redirect to course page or open dialog box
    const handleCourseImageClick = () => {
      if(unlockCourse) handleButtonClick(buttonText, null, currentCourse);
      else handleButtonClick('VIEW COURSE', null, currentCourse);
    }
    
    // Open Provider Card / CME Certificate in new tab when clicked on View Certificate / View CME Certificate
    const openCertificate = (url) => {
      window.open(url, '_blank');
    }

    // Redirect to CME Survey Form with hash & courseID as query params
    const handleClaimCME = () => {  
      if (hasCME && hash) {
        navigate(`/learning/cme-survey?hash=${hash}&courseID=${courseID}`);
      } else {
        openSnackbar('Something went wrong! Please contact support', 'error');
      }
    };

    // Action when card button is clicked - Redirect to course page or open dialog box
    const handleActionButtonClick = () => {
      setIsOrderTypeFullAccess(isOrderTypeFullAccess);
      handleButtonClick(buttonText, coursePlan, currentCourse)
    }

    return (
      <CourseCard>
        <ImageBox onClick={handleCourseImageClick}>
          <CourseImage src={currentCourse.image} alt={currentCourse.title}/>

          {/* Image Hover Effect - Overlay */}
          <ImageOverlay unlockCourse={unlockCourse} courseID={courseID} />
        </ImageBox>

        {/* COURSE PROGRESS BAR */}
        <CourseProgress percent={progressPercentage} hide={hideLinearProgress} />

        <CardActions hide={hideLinearProgress}>
          {/* Display Renew Plan text when order is expired Else show Course Progress Text  */}
          {isOrderExpired ? 
            <Box sx={{flexGrow: 1}}>
              <ExpiryText />
              <PrimaryText>Please choose plan to renew</PrimaryText>
            </Box>
             :
          <PrimaryText sx={{ flexGrow: 1, display: hideLinearProgress && 'none' }}>
            {progressPercentage}% Completed
          </PrimaryText>
          }

          {/* Text displayed when no plan purchased for Opioid */}
          {buttonText.includes('FREE') &&
            <Box sx={{flexGrow: 1}}>
              <PrimaryText>Available at no cost with</PrimaryText>
              <PrimaryText>medtigo benefits</PrimaryText>
            </Box>
          }

          <Box pt={0.5}>
            {/* REQUEST FULL SIZE CERTIFICATE */}
            {/* ONLY ONE TIME - FOR ACLS, BLS, PALS - BEST VALUE & FULL ACCESS WHEN COURSE IS COMPLETED */}
            {hasFullSizeCertificate && isCourseCompleted && (
              <ActionIcon
                title="Send Request For Full Size Certificate"
                onClick={() => handleOpenDialog('certificate', currentCourse)}
                src={COURSE_ICONS.fullSizeCertificate}
                alt="Request Full Size Certificate"
              />
            )}

            {/* VIEW CERTIFICATE ICON */}
            {/* ONLY IF CERTIFICATE EXISTS & COURSE COMPLETED - FOR ALL COURSES EXCEPT OPIOID & NIHSS */}
            {providerCardData && isCourseCompleted && (
              <ActionIcon
                title="View Certificate"
                onClick={() => openCertificate(providerCardData.path)}
                src={COURSE_ICONS.viewCertificate}
                alt="View Certificate"
              />
            )}

            {/* CLAIM CME ICON */}
            {/* ONLY IF HASH IS PRESENT & FOR FULL ACCESS & BEST VALUE PLANS ( ONLY ACLS, BLS, PALS, OPIOID & NIHSS ) WHEN COURSE IS COMPLETED */}
            {hash && hasCME && isCourseCompleted && (
              <ActionIcon
                title="Claim CME"
                onClick={handleClaimCME}
                src={COURSE_ICONS.claimCME}
                alt="Claim CME"
              />
            )}

            {/* VIEW CME CERTIFICATE ICON */}
            {/* ONLY IF HASH IS NULL & CME CERTIFICATE EXISTS FOR FULL ACCESS & BEST VALUE PLANS ( ONLY ACLS, BLS, PALS, OPIOID & NIHSS ) WHEN COURSE IS COMPLETED */}
            {!hash && hasCME && cmeCertificateData && isCourseCompleted && (
              <ActionIcon
                title="View CME Certificate"
                onClick={() => openCertificate(cmeCertificateData.path)}
                src={COURSE_ICONS.claimCME}
                alt="View CME Certificate"
              />
            )}
          </Box>

          {/* ACTION BUTTON */}
          <ActionButton onClick={handleActionButtonClick} buttonText={buttonText} disabled={disableActionButton} />
        </CardActions>
      </CourseCard>
    );
})

NewCourseCard.displayName = "NewCourseCard"; // Set the displayName explicitly

export default NewCourseCard