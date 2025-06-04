import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography, Tooltip } from '@mui/material';
import simulationService from 'src/services/simulationServices';
import { useSelector } from 'react-redux';
import RetryIcon from '@mui/icons-material/Refresh';
import CompleteIcon from '@mui/icons-material/CheckCircle';
import PlayIcon from '@mui/icons-material/PlayCircleFilledWhite';
import CloseIcon from '@mui/icons-material/Close';
import CachedIcon from '@mui/icons-material/Cached';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import CallMadeIcon from '@mui/icons-material/CallMade';
import VerifiedIcon from '@mui/icons-material/Verified';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { simulationCasesData } from '../data';
import { LearningContext } from 'src/context/LearningContext';
import { AutoProviderCardBox } from '../handlers';

const QuizSimulationCard = ({ parent, endQuiz }) => {
  // console.log("parent: ", parent);

  const { setSimulationStatus } = useContext(LearningContext);
  const [simualtionCaseDilog, showSimualtionCaseDilog] = useState(false);
  const [all_cases_done, setAllCasesDone] = useState(false);
  const [skipSim, setSkipSim] = useState(false);
  const [case_status, setCaseStatuses] = useState(simulationCasesData);
  const { user } = useSelector(state => state.account);
  const [case_started, SetCaseStarted] = useState(null);
  const [updatePage, SetUpdatePage] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [simualtionMobileDilog, showSimualtionMobileDilog] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { isMobile } = useBreakpoints();

  const openPopup = url => {
    setIframeUrl(url); // Set iframe URL
    setIsPopupOpen(true); // Open the popup
  };

  const closePopup = () => {
    setIframeUrl(''); // Clear iframe URL
    setIsPopupOpen(false); // Close the popup
    SetCaseStarted(null);
  };
  // need to check quiz passing
  // need to check simulation cases completion status
  useEffect(() => {
    getCasesStatus();
    if (!all_cases_done || !isMobile || !skipSim) {
      const intervalId = setInterval(getCasesStatus, 5000);
      setIntervalId(intervalId);
      return () => clearInterval(intervalId);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (sessionStorage.getItem('skipSim') && endQuiz) {
        all_cases_done && sessionStorage.removeItem('skipSim');
      }
    };
  }, [all_cases_done, case_started, skipSim, updatePage]);

  const getCasesStatus = async () => {
    try {
      const skipped = sessionStorage.getItem('skipSim');

      if (skipped) {
        setSkipSim(true);
        setSimulationStatus('done');
        clearInterval(intervalId);
        return;
      }

      if (!all_cases_done) {
        const res = await simulationService.getSimulationCaseAttempt(
          user.email
        );
        let copy_cases = case_status;
        let cases_completed = true;
        let cases_completed_count = 0;
        let started_cases = case_started;
        copy_cases.map((item, index) => {
          let found = res.find(
            item2 =>
              item.case.includes(item2.case_name.toLowerCase()) &&
              item2.source != null &&
              ['connect_acls', 'featured_simulation'].some(type =>
                item2.source.includes(type)
              )
          );
          if (!found) {
            cases_completed = false;
          } else {
            let foundStartedCase =
              started_cases == found.case_name.toLowerCase();
            if (foundStartedCase) {
              SetCaseStarted(null);
            }
            copy_cases[index].status = found ? true : false;
            cases_completed_count = cases_completed_count + 1;
          }
        });
        SetUpdatePage(cases_completed_count);
        setAllCasesDone(cases_completed);
        setSimulationStatus(cases_completed ? 'done' : 'incomplete');
        setCaseStatuses(copy_cases);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const completeSimulation = () => {
    if (isMobile) showSimualtionMobileDilog(true);
    else showSimualtionCaseDilog(true); // Comment to enable Simulation Hack
    // setSimulationStatus('done'); // Uncomment to enable Simulation Hack
    // setAllCasesDone(true); // Uncomment to enable Simulation Hack
  };

  return (
    <>
      <AutoProviderCardBox
        sx={{ justifyContent: endQuiz ? 'normal' : 'space-between' }}
      >
        <div>
          <Typography style={{ fontWeight: 400, fontSize: '24px' }}>
            Step 1
          </Typography>
          <img
            style={{ marginTop: '0px', padding: '20px 0px' }}
            width={isMobile ? 100 : 170}
            src="/images/lms/simulation_card.png"
          />
          <Typography
            variant="h4"
            style={{
              color: all_cases_done ? '#008000' : '#000',
              paddingBottom: '10px',
              fontSize: '22px',
              fontWeight: 600
            }}
          >
            {all_cases_done
              ? 'Congratulations'
              : skipSim
              ? 'Skipped'
              : 'Attempt Simulations'}
          </Typography>
          <Typography paragraph>
            {all_cases_done ? (
              <>Completed 6 out of 6 simulation cases</>
            ) : skipSim ? (
              <>You have skipped the simulation.</>
            ) : isMobile ? (
              'Note: All ACLS course simulation cases can be attempted from your desktop. Simulation is not available on mobile devices.'
            ) : (
              'you are required to attempt all ACLS course simulation cases without needing to fully complete them.'
            )}
          </Typography>
        </div>
        {all_cases_done ? (
          <Grid container spacing={2} justifyContent="center">
            <Grid size={{ sm: 10, md: 6 }}>
              {/* <Button
                fullWidth
                disableRipple
                disableElevation
                variant="contained"
                color="success"
                sx={{
                  pointerEvents: 'none', // Disables interactions like hover, click
                  '&:hover': {
                    backgroundColor: 'success.main' // Ensures no hover effect
                  }
                }}
                endIcon={<CompleteIcon />}
              >
                Completed
              </Button> */}
            </Grid>
          </Grid>
        ) : skipSim ? (
          <Grid container justifyContent="space-around" alignItems="center">
            <Grid size={6}>
              <Button
                disableElevation
                fullWidth
                sx={{ minWidth: '150px', marginBottom: '10px' }}
                variant="contained"
                color="success"
                // endIcon={<VerifiedIcon />}
              >
                Skipped
              </Button>
            </Grid>

            {/* <Grid item>
              <Tooltip title="Retake" placement="bottom" arrow>
                <IconButton
                  color="primary"
                  onClick={() => {
                    setSkipSim(false);
                    sessionStorage.removeItem('skipSim');
                  }}
                >
                  <CachedIcon />
                </IconButton>
              </Tooltip>
            </Grid> */}
          </Grid>
        ) : (
          <Grid container justifyContent="center" spacing={2}>
            {/* {isMobile && <Grid item xs={6}>
              <Button
                disableElevation
                fullWidth
                variant="outlined"
                sx={{minWidth: '150px', marginBottom: '10px'}}
                onClick={() => {
                  setSkipSim(true);
                  // setEndQuiz(true);
                  clearInterval(intervalId);
                  sessionStorage.setItem('skipSim', true);
                }}
              >
                Skip
              </Button>
            </Grid>} */}
            {!isMobile && (
              <Grid size={6}>
                <Button
                  disableElevation
                  fullWidth
                  variant="contained"
                  // endIcon={<CallMadeIcon />}
                  onClick={completeSimulation}
                >
                  Complete
                </Button>
              </Grid>
            )}
          </Grid>
        )}
      </AutoProviderCardBox>
      <CustomPopup
        isOpen={isPopupOpen}
        iframeUrl={iframeUrl}
        onClose={closePopup}
      />

      <Dialog
        open={simualtionMobileDilog}
        PaperProps={{
          sx: {
            // padding: '20px', // Padding inside the dialog
            borderRadius: '10px', // Rounded corners
            boxShadow: 24, // Custom shadow
            minWidth: 'fit-content',
            height: 'fitContent'
          }
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>Note</DialogTitle>
          <IconButton>
            <CloseIcon onClick={() => showSimualtionMobileDilog(false)} />
          </IconButton>
        </div>
        <DialogContent className="my-dialog">
          <Typography>
            Simulation is unavailable on mobile. Please use desktop for access.
          </Typography>
        </DialogContent>
      </Dialog>

      <Dialog
        open={simualtionCaseDilog}
        PaperProps={{
          sx: {
            // padding: '20px', // Padding inside the dialog
            borderRadius: '10px', // Rounded corners
            boxShadow: 24, // Custom shadow
            minWidth: 'fit-content',
            height: '915px'
          }
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle sx={{ m: 0, p: 2 }}>Cardiology</DialogTitle>
          <div style={{ padding: '20px', cursor: 'pointer' }}>
            <CloseIcon onClick={() => showSimualtionCaseDilog(false)} />
          </div>
        </div>
        <DialogContent className="my-dialog">
          {simulationCasesData.map((el, index) => {
            return (
              <React.Fragment key={index}>
                <Box
                  style={{
                    width: '680px',
                    marginBottom: '20px',
                    height: '120px',
                    border: el.status
                      ? '2px solid #008000'
                      : '2px solid #DF5338',
                    borderRadius: '5px'
                  }}
                >
                  <Grid
                    container
                    direction="row"
                    spacing={2}
                    style={{ padding: '10px', flexWrap: 'nowrap' }}
                  >
                    <Grid>
                      <img
                        style={{ borderRadius: '10px 0 0 10px' }}
                        height={100}
                        width={'80px'}
                        src={el.image}
                        alt="case-image"
                      />
                    </Grid>
                    <Grid
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}
                      >
                        {el.case[3]}
                      </Typography>
                      <Typography
                        style={{ marginBottom: '3px', fontSize: '14px' }}
                        paragraph
                      >
                        {el.desc}
                      </Typography>
                      {el.status ? (
                        <div>
                          <Button
                            style={{
                              cursor: 'default',
                              width: '150px',
                              marginBottom: '10px'
                            }}
                            disableElevation
                            variant="contained"
                            color="success"
                            endIcon={<CompleteIcon />}
                          >
                            Attempted
                          </Button>
                          <Button
                            sx={{
                              '&:hover': {
                                backgroundColor: '#0288D1', // Prevent background change on hover
                                color: '#fff'
                              }
                            }}
                            onClick={() => {
                              SetCaseStarted(el.case[0]);
                              let UserName =
                                user.first_name + ' ' + user.last_name;
                              let email = user.email;
                              let Source = 'connect_acls';
                              openPopup(
                                `https://simulation.medtigo.com/cases/${el.case[0]}/?email=${email}&id=${user.id}&name=${UserName}&source=${Source}`,
                                'popupWindow',
                                '_self'
                              );
                            }}
                            style={{
                              marginLeft: '2%',
                              cursor: 'default',
                              width: '100px',
                              marginBottom: '10px'
                            }}
                            disableElevation
                            variant="outlined"
                            color="info"
                            endIcon={<RetryIcon sx={{ marginLeft: '0px' }} />}
                          >
                            Retry
                          </Button>
                        </div>
                      ) : (
                        <Button
                          style={{ width: '150px', marginBottom: '10px' }}
                          disableElevation
                          variant="contained"
                          color="primary"
                          disabled={case_started == el.case[0]}
                          endIcon={case_started != el.case[0] && <PlayIcon />}
                          onClick={() => {
                            SetCaseStarted(el.case[0]);
                            let UserName =
                              user.first_name + ' ' + user.last_name;
                            let email = user.email;
                            let Source = 'connect_acls';
                            openPopup(
                              `https://simulation.medtigo.com/cases/${el.case[0]}/?email=${email}&id=${user.id}&name=${UserName}&source=${Source}`,
                              'popupWindow',
                              '_self'
                            );
                          }}
                        >
                          {case_started == el.case[0]
                            ? 'Case Started...'
                            : 'Start Case'}
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </React.Fragment>
            );
          })}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizSimulationCard;

const CustomPopup = ({ isOpen, iframeUrl, onClose }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <div
          className="close-btn"
          style={{ background: '#FFF', borderRadius: '2px' }}
          onClick={onClose}
        >
          <CloseIcon />
        </div>
        <iframe
          allow="camera; microphone"
          width="100%"
          height="100%"
          src={iframeUrl}
          title="Popup Iframe"
        />
      </div>
    </div>
  );
};
