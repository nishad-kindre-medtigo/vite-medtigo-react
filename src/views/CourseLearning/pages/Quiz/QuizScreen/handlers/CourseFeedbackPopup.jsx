import React, { useState } from 'react';
import { Dialog, Box, Button, Collapse, Typography, Stack, TextareaAutosize, useTheme } from '@mui/material';
import Confetti from 'react-dom-confetti';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import useBreakpoints from 'src/hooks/useBreakpoints';
import LearningService from 'src/services/learningService';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader } from '../../../../../../ui/Progress';
import { motion } from 'framer-motion';
import { config } from '../data';

const StarRating = ({ value, onChange, error }) => {
  const labels = ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'];

  return (
    <>
      <Box
        sx={{
          py: 1,
          background: '#F2F8FF',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: 2, sm: 3 }
        }}
      >
        {labels.map((label, index) => (
          <Box
            key={index}
            onClick={() => onChange(index + 1)}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="50px"
              height="50px"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.2 }}
            >
              <path
                d="M12 2.587l2.668 5.435 6.21 0.893-4.538 4.438 1.072 6.242L12 16.896l-5.41 2.839 1.072-6.242-4.538-4.438 6.21-0.893L12 2.587z"
                fill={index < value ? '#FFC727' : '#C6C5BD'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
            <Typography
              sx={{ fontSize: { xs: '10px', sm: '12px' }, color: '#7B7777' }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
      {error && (
        <Typography variant="caption" color="error" mt={1}>
          {error}
        </Typography>
      )}
    </>
  );
};

const CourseFeedbackPopup = ({ open, setOpen, courseID, percentage }) => {
  const theme = useTheme();
  const { isMobile } = useBreakpoints();
  const openSnackbar = useOpenSnackbar();
  const user = useSelector(state => state.account.user);
  const [startConfetti, setStartConfetti] = useState(false); // start confetti

  const isOpioid = courseID === 11159;
  const isNIHSS = courseID === 192797;
  const totalQuestionsCount = isOpioid ? 24 : isNIHSS ? 25 : 50;

  const hasProviderCard = !isOpioid && !isNIHSS;

  const formik = useFormik({
    initialValues: {
      Rating: 0,
      Feedback: ''
    },
    validationSchema: Yup.object({
      Rating: Yup.number()
        .min(1, 'Please select a rating')
        .required('Rating is required'),
      Feedback: Yup.string().test(
        'feedback-required',
        'Required',
        function (value) {
          const { Rating } = this.parent;
          if (Rating < 4) {
            return !!value; // Feedback must not be empty if Rating < 4
          }
          return true; // No validation error for other cases
        }
      )
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const payload = {
          User_Name: user.first_name + ' ' + user.last_name,
          UserId: user.id,
          email: user.email,
          contact: 'N/A',
          phoneNumber: user.phoneNumber,
          ...values
        };

        await LearningService.submitCourseFeedback(payload);
        openSnackbar('Feedback Submitted.', 'success');
        resetForm(); // Reset the form after successful submission
        setOpen(false);
      } catch (error) {
        console.error(error);
        openSnackbar('Something went wrong.', 'error');
      } finally {
        setSubmitting(false); // End the submitting state
      }
    }
  });

  return (
    <Dialog
      open={open}
      fullWidth
      fullScreen={isMobile}
      aria-labelledby="feedback-popup"
      aria-describedby="course-feedback-popup"
      maxWidth="sm"
    >
      <Box className="confetti-container">
        <Confetti
          ref={() => {
            setStartConfetti(true);
          }}
          active={startConfetti}
          config={config}
        />
      </Box>
      <Stack
        spacing={2}
        sx={{
          background: '#FBFFFB',
          borderBottom: '1px solid #CBCBCB',
          textAlign: 'center',
          p: 4
        }}
      >
        {/* Header */}
        <img
          src="/images/lms/well_done.svg"
          alt="Feedback"
          style={{ height: '60px' }}
        />
        <Typography variant="h5" fontWeight="bold" color="success.main">
          Well Done!
        </Typography>
        <Typography align="center" fontWeight={400} px={2} color="#3A3A3A">
          you have successfully passed the quiz with a score of{' '}
          {Math.round((percentage / 100) * totalQuestionsCount)} out of{' '}
          {totalQuestionsCount}{' '}
          {hasProviderCard && (
            <span>
              and earned your <strong>provider card</strong>, which has been
              emailed to {user.email}.
            </span>
          )}
        </Typography>
      </Stack>
      <Stack spacing={2} sx={{ p: { xs: 2, sm: 4 } }}>
        {/* Header */}
        <Box textAlign="center">
          <img
            src="/images/lms/share_feedback.svg"
            alt="Feedback"
            style={{ height: '60px' }}
          />
          <Typography variant="h5" fontWeight={600} color="#3A3A3A">
            Share Your Feedback
          </Typography>
        </Box>

        {/* Star Rating */}
        <Box>
          <Typography align="center" px={3} mb={1} color="#3A3A3A">
            we would love to have your feedback please take a moment to rate
            your experience with us.
          </Typography>
          <StarRating
            value={formik.values.Rating}
            onChange={newValue => formik.setFieldValue('Rating', newValue)}
            error={formik.touched.Rating && formik.errors.Rating}
          />
        </Box>

        {/* Feedback Text */}
        <Collapse
          in={formik.values.Rating && formik.values.Rating < 4}
          timeout="auto"
          unmountOnExit
        >
          <Box>
            <Typography mb={1} fontWeight={500}>
              {"What's the main reason for your rating?"}
            </Typography>
            <TextareaAutosize
              placeholder="Write your feedback here..."
              value={formik.values.Feedback}
              onChange={formik.handleChange}
              name="Feedback"
              style={{
                minHeight: 50,
                maxHeight: 150,
                resize: 'vertical',
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '4px',
                border: `1px solid ${
                  formik.touched.Feedback && formik.errors.Feedback
                    ? theme.palette.error.main
                    : '#ccc'
                }`,
                outline: 'none'
              }}
            />
            {formik.touched.Feedback && formik.errors.Feedback && (
              <Typography variant="caption" color="error">
                {formik.errors.Feedback}
              </Typography>
            )}
          </Box>
        </Collapse>

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={formik.handleSubmit}
            sx={{ width: '200px' }}
          >
            {formik.isSubmitting ? <Loader width="24" /> : 'SUBMIT FEEDBACK'}
          </Button>
        </Box>
      </Stack>
    </Dialog>
  );
};

export default CourseFeedbackPopup;
