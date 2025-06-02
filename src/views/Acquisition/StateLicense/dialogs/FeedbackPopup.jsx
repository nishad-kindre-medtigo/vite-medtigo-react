import React from 'react';
import { Dialog, DialogContent, Box, Button, FormControl, FormControlLabel, RadioGroup, Radio, Typography, Stack, TextareaAutosize, useTheme } from '@mui/material';
import { useOpenSnackbar } from '../../../../hooks/useOpenSnackbar';
import alertPage from '../../../../services/alertPage';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader } from '../../../../ui/Progress';
import { motion } from 'framer-motion';
import useBreakpoints from '../../../../hooks/useBreakpoints';

export const StarRating = ({ value, onChange, error }) => {
  const labels = ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'];

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
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
              fill={index < value ? '#FFD700' : '#ccc'}
              width="42px"
              height="42px"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.2 }}
            >
              <path d="M12 .587l3.668 7.435 8.21 1.193-5.938 5.788 1.402 8.162L12 18.896l-7.342 3.861 1.402-8.162L.122 9.215l8.21-1.193L12 .587z" />
            </motion.svg>
            <Typography sx={{ fontSize: { xs: '8px', sm: '12px'} }}>{label}</Typography>
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

const FeedbackPopup = ({ open, setOpen }) => {
  const theme = useTheme();
  const { isMobile } = useBreakpoints();
  const openSnackbar = useOpenSnackbar();
  const user = useSelector((state) => state.account.user);

  const formik = useFormik({
    initialValues: {
      Rating: 0,
      Feedback: '',
      contact: 'yes'
    },
    validationSchema: Yup.object({
      Rating: Yup.number()
        .min(1, 'Please select a rating')
        .required('Rating is required'),
      Feedback: Yup.string().required('Feedback is required'),
      contact: Yup.string().required('Please select an option')
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const payload = {
          User_Name: user.first_name + ' ' + user.last_name,
          UserId: user.id,
          ...values
        };

        await alertPage.submitFeedbackFromEmail(payload);
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
      onClose={() => setOpen(false)}
      fullWidth
      fullScreen={isMobile}
      aria-labelledby="feedback-popup"
      aria-describedby="licensing-feedback-popup"
      maxWidth="sm"
    >
      <DialogContent>
        <Stack spacing={3}>
          {/* Header */}
          <Box textAlign="center">
            <img
              src="/icons/licensing/feedback.svg"
              alt="Feedback"
              style={{ height: '40px' }}
            />
            <Typography variant="h5" fontWeight="bold">
              Feedback
            </Typography>
          </Box>

          {/* Star Rating */}
          <Box>
            <Typography align="center" fontWeight={500} mb={1}>
              Rate your overall satisfaction with our service to help us improve
              and serve you better
            </Typography>
            <StarRating
              value={formik.values.Rating}
              onChange={(newValue) => formik.setFieldValue('Rating', newValue)}
              error={formik.touched.Rating && formik.errors.Rating}
            />
          </Box>

          {/* Feedback Text */}
          <Box>
            <Typography mb={2} fontWeight={500}>
              What is the main reason for your score?
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

          {/* Contact Option */}
          <FormControl>
            <Typography fontWeight={500}>
              Would you like a representative to contact you?
            </Typography>
            <RadioGroup
              name="contact"
              value={formik.values.contact}
              onChange={formik.handleChange}
              row
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button fullWidth variant="outlined" onClick={() => setOpen(false)}>
              CANCEL
            </Button>
            <Button fullWidth variant="contained" onClick={formik.handleSubmit}>
              {formik.isSubmitting ? <Loader width="24" /> : 'SUBMIT'}
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackPopup;
