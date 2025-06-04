import React, { useContext, useEffect, useRef } from 'react';
import { Autocomplete, TextField, Button, Box } from '@mui/material';
import { LearningContext } from 'src/context/LearningContext';
// import MapViewer from '../../../map';
import { courseLanguages } from 'src/appConstants';
import useroptionsServices from 'src/services/userOptionsService';
import { useNavigate } from 'react-router-dom';
import useBreakpoints from 'src/hooks/useBreakpoints';

function CourseUnits(props) {
  const { activeStep, steps, activeCourse, goToPreviousUnit, goToNextUnit, courseTitle } = props;
  const { language } = useContext(LearningContext);
  const { isMobile } = useBreakpoints();
  const scrollableDivRef = useRef(null);

  const isOpioid = activeCourse.id === 11159;
  const isACLS = activeCourse.id === 4526;

  const isFirstLesson = activeStep === 0;
  const unitNumber = isOpioid ? activeStep : activeStep + 1;

  const isACLSArabic = activeCourse?.id == 4526 && language === 'Arabic';

  const unitTitle = isOpioid
    ? isFirstLesson
      ? courseTitle
      : `Unit ${unitNumber} - ${courseTitle}`
    : `Unit ${unitNumber} - ${courseTitle}`;
  
  // SCROLL TO TOP OF COURSE CONTENT WHEN USER GOES TO ANY UNIT FROM BUTTONS OR STEPPER
  useEffect(() => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({
        top: 0
      });
    }
  }, [activeStep]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: 'calc(100vh - 58px)'}}>
      {/* BACK TO COURSES BTN & COURSE UNIT NAME */}
      <Topbar isACLS={isACLS} unitTitle={unitTitle} isMobile={isMobile} sx={{ flexDirection: isACLSArabic ? 'row-reverse' : 'row' }} />

      {/* COURSE CONTENT */}
      <div
        ref={scrollableDivRef}
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          direction: isACLSArabic && 'rtl',
        }}
      >
        {isMobile && <UnitTitle title={unitTitle} />}
        <div
          className="course-content-container"
          style={{
            padding: '0px 15px',
            background: '#FFF',
            img: { cursor: 'pointer' }
          }}
        >
          <div
            className="course-html-content"
            dangerouslySetInnerHTML={{
              __html:
                activeCourse && activeStep !== 11 && activeCourse.id === 11159
                  ? activeCourse.lessons[activeStep]?.post_content
                  : ''
            }}
          />
          <div
            className="course-html-content"
            dangerouslySetInnerHTML={{
              __html:
                activeCourse && activeCourse.id !== 11159
                  ? activeCourse.lessons[activeStep]?.post_content
                  : ''
            }}
          />
          {activeCourse && activeStep === 11 && activeCourse.id === 11159 ? (
            <></>
          ) : (
            ''
          )}
          {activeStep + 2 === steps.length && activeCourse.id === 11159 ? (
            <div
              className="course-html-content"
              dangerouslySetInnerHTML={{
                __html:
                  activeStep === 12
                    ? activeCourse.lessons[11]?.post_content
                    : ''
              }}
            />
          ) : (
            ''
          )}
        </div>
      </div>

      {/* PREVIOUS, NEXT UNIT & START QUIZ BUTTON */}
      <Box sx={{ ...navigationBoxSX, justifyContent: isFirstLesson ? 'flex-end' : 'space-between', flexDirection: isACLSArabic ? 'row-reverse' : 'row' }}>
        {!isFirstLesson && (
          <Button variant='contained' onClick={goToPreviousUnit}>
            PREVIOUS UNIT
          </Button>
        )}
          <Button variant='contained' onClick={goToNextUnit}>
            NEXT UNIT
          </Button>
      </Box>
    </div>
  );
}

const topBarSx = {
  width: '100%',
  background: '#fff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexShrink: 0,
  mt: 2,
  mb: 1,
  px: 1
};

const navigationBoxSX = {
  display: 'flex',
  flexShrink: 0,
  mt: 1,
  py: 1,
  px: 2,
  gap: 2,
  flexWrap: 'wrap',
  boxShadow: '0 -4px 6px -2px rgba(0, 0, 0, 0.1)', // top shadow
  backgroundColor: '#fff'
};

// COURSE CONTENT HEADER WITH BACK BUTTON, UNIT TITLE & LANGUAGE SELECTOT
const Topbar = ({ unitTitle, isACLS, isMobile, sx }) => {
  const navigate = useNavigate();

  // LOGIC FOR BACK TO COURSE BUTTON
  const handlebackToCourse = () => {
    const backLink = localStorage.getItem('learning-path');
    if (backLink) {
      navigate(backLink);
    } else {
      navigate('/my-learning');
    }
  };

  return (
    <Box sx={{ ...topBarSx, ...sx }}>
      <Button
        variant="contained"
        onClick={handlebackToCourse}
        style={{
          minWidth: '180px'
        }}
      >
        {'< BACK TO COURSES'}
      </Button>
      {isMobile ? (
        <div style={{ flexGrow: 1 }}></div>
      ) : (
        <UnitTitle title={unitTitle} />
      )}

      {/* LANGUAGE SELECTOR ONLY VISIBLE FOR ACLS COURSE */}
      {isACLS && <LanguageSelector />}
    </Box>
  );
};

const LanguageSelector = () => {
  const { language } = useContext(LearningContext);

  const selectedLanguage = language ? language : 'English';

  // CHANGE COURSE LANGUAGE FOR ACLS COURSE
  const handleLanguageChange = async (e) => {
    const selected_language = courseLanguages.find(
      (it) => it.name == e.target.value
    ).id;
    await useroptionsServices.updateUserOptions({
      selected_language: selected_language
    });
    window.location.reload();
  };

  return (
    <Autocomplete
      disableClearable
      options={courseLanguages.map((item) => item.name)}
      value={selectedLanguage}
      onChange={(event, newValue) =>
        handleLanguageChange({ target: { value: newValue } })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Language"
          variant="outlined"
          size="small"
          sx={{ background: 'white', width: '120px' }}
        />
      )}
    />
  );
};

const UnitTitle = ({ title = '' }) => (
  <Box
    sx={{
      textAlign: 'center',
      fontSize: { xs: '22px', sm: '30px' },
      fontWeight: 600,
      color: '#42A3E5',
      flexGrow: 1
    }}
  >
    {title}
  </Box>
);

export default CourseUnits;
