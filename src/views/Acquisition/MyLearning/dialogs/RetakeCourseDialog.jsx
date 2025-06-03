import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress } from '@mui/material';
import { Loader } from '../../../../ui/Progress';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import authService from 'src/services/authService';
import orderServices from 'src/services/orderServices';
import { useMyLearningContext } from 'src/context/MyLearningContext';
import { SERVER_URL } from '../../../../settings';

// Course Plans To place order for TeamHealth User when clicked on Renew
const TEAMHEALTH_COURSE_PLANS = {
  4526: 19986, // ACLS
  9985: 19981, // BLS
  9238: 19984, // PALS
  151904: 17475, // ASC CE
  79132: 17474, // NRP
  192797: 77817, // NIHSS
  11159: 6025 // OPIOID
};

const RetakeCourseDialog = ({ course_id, handleRefresh }) => {
  const { email } = useSelector((state) => state.account.user);
  const { dialogs, handleCloseDialog } = useMyLearningContext();
  const openSnackbar = useOpenSnackbar();
  const token = authService.getAccessToken();
  const [loading, setLoading] = useState(false);

  const isOnlyCME = [11159, 192797].includes(course_id);
  const certificate = isOnlyCME ? 'CME Certificate' : 'Provider Card';
  const page = isOnlyCME ? 'CE/CME' : 'Clinical Certificates';

  const handleClose = () => {
    handleCloseDialog('retake');
  };

  // Reset Course Progress & Place Order for TeamHealth User
  const resetCourseProgress = async (email, course_id, token) => {
    try {
      setLoading(true);
      const devParameter = SERVER_URL === "https://dev.medtigo.com/" ? '&platform=dev' : ''
      const apiUrl = `https://backend.medtigo.com/wp-json/ldlms/v1/reset_course_progress?email=${email}&course_id=${course_id}&token=${token}${devParameter}`;
      const response = await axios.get(apiUrl);

      if (response) {
        const order_number = await orderServices.getRecentOrderNumber();
        const orderPlan = TEAMHEALTH_COURSE_PLANS[course_id.toString()]; // Select Best Value Plan
        const orderData = await orderServices.addOrderFromMarket({
          items: [orderPlan],
          order_number: order_number,
          bill_amount: 0,
          order_status: 'processing',
          email: email
        });
        return response;
      } else {
        throw new Error(`Unexpected response status: ${response}`);
      }
    } catch (error) {
      setLoading(true);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle Retake Course Button Click Event
  const handleRetakeCourse = async () => {
    try {
      await resetCourseProgress(email, course_id, token);
      openSnackbar('Course Renewed Successfully!');
      handleClose();
      handleRefresh();
    } catch (error) {
      openSnackbar('Failed to Renew Course!', 'error');
    }
  };

  return (
    <Dialog open={dialogs.retake} onClose={handleClose} disableEnforceFocus>
      <DialogTitle
        id="form-dialog-title"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'grey.400',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          py: 1
        }}
      >
        <img
          src="/icons/myLearning/warning_icon.svg"
          alt="Warning Icon"
        />
        RENEW COURSE
      </DialogTitle>
      <DialogContent sx={{ mt: 2, color: '#333' }}>
        Renewing the course resets progress, allowing you to reattempt the quiz
        for a new {certificate}. The old {certificate} will be saved in the{' '}
        <strong style={{ color: '#555' }}>
          Monitoring & Renewal {page}
        </strong>{' '}
        section.
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleRetakeCourse}>
          {loading ? (
            <Loader width="24" />
          ) : (
            'Renew'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(RetakeCourseDialog);
