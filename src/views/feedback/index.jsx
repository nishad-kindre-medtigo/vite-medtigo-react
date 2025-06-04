import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Button, FormControl, FormControlLabel, RadioGroup, Radio, Typography, Stack, TextareaAutosize, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import alertPage from 'src/services/alertPage';
import { Loader } from 'src/ui/Progress';
import { motion } from 'framer-motion';

const StarRating = ({ value, onChange, error }) => {
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
            <Typography variant="caption">{label}</Typography>
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

function FeedbackView() {
  const openSnackbar = useOpenSnackbar();
  const theme = useTheme();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

   const formik = useFormik({
    initialValues: {
      Rating: 0,
      Feedback: '',
      contact: 'yes',
      name: queryParams.get('first_name') ? `${queryParams.get('first_name') || ''} ${queryParams.get('last_name') || ''}` : '',
      email: '',
      phone: ''
    },
    validationSchema: Yup.object({
      Rating: Yup.number()
        .min(1, 'Please select a rating')
        .required('Rating is required'),
      Feedback: Yup.string().required('Feedback is required'),
      contact: Yup.string().required('Please select an option'),
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string().matches(/^[0-9]{10}$|^$/, 'Phone number must be 10 digits')
    }),
     onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const payload = {
          User_Name: values.name,
          Rating: values.Rating,
          Feedback: values.Feedback,
          email: values.email,
          phoneNumber: values.phone,
          contact: values.contact
        };

        await alertPage.submitGenericFeedback(payload);
        openSnackbar('Feedback Submitted.', 'success');
        resetForm(); // Reset the form after successful submission
      } catch (error) {
        console.error(error);
        openSnackbar('Something went wrong.', 'error');
      } finally {
        setSubmitting(false); // End the submitting state
      }
    }
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#F8F9FA',
        overflowY: 'auto',
        position: 'relative',
        padding: '80px 20px 20px' // Add padding at top to account for sticky header
      }}
    >
      {/* Header - Made sticky */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '15px 0',
          background: '#F8F9FA',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        <img
          src="https://medtigo.com/wp-content/uploads/2024/05/medtigo_2-1.svg"
          alt="Medtigo Logo"
          height="50px"
          width="168px"
        />
      </Box>
      
      {/* Feedback Form */}
      <Box
        sx={{
          maxWidth: 600,
          width: '100%',
          background: 'white',
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          p: 4,
          mt: 2
        }}
      >
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

         {/* Contact Information */}
          <Box>
            <Typography fontWeight={600} mb={2}>
              Contact Information
            </Typography>
            <Stack spacing={2}>
              {/* Name Field */}
              <Box>
                <Typography variant="body2" mb={1}>
                  Name <span style={{ color: 'red' }}>*</span>
                </Typography>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  name="name"
                  style={{
                    height: '40px',
                    width: '100%',
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '4px',
                    border: `1px solid ${
                      formik.touched.name && formik.errors.name
                        ? '#f44336'
                        : '#ccc'
                    }`,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {formik.touched.name && formik.errors.name && (
                  <Typography variant="caption" color="error">
                    {formik.errors.name}
                  </Typography>
                )}
              </Box>

              {/* Email Field */}
              <Box>
                <Typography variant="body2" mb={1}>
                  Email <span style={{ color: 'red' }}>*</span>
                </Typography>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  name="email"
                  style={{
                    height: '40px',
                    width: '100%',
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '4px',
                    border: `1px solid ${
                      formik.touched.email && formik.errors.email
                        ? '#f44336'
                        : '#ccc'
                    }`,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {formik.touched.email && formik.errors.email && (
                  <Typography variant="caption" color="error">
                    {formik.errors.email}
                  </Typography>
                )}
              </Box>

              {/* Phone Field */}
              <Box>
                <Typography variant="body2" mb={1}>
                  Phone Number (Optional)
                </Typography>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  name="phone"
                  style={{
                    height: '40px',
                    width: '100%',
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '4px',
                    border: `1px solid ${
                      formik.touched.phone && formik.errors.phone
                        ? '#f44336'
                        : '#ccc'
                    }`,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <Typography variant="caption" color="error">
                    {formik.errors.phone}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>

          {/* Star Rating */}
          <Box>
            <Typography align="center" fontWeight={600} mb={1}>
              Your overall satisfaction with our service <span style={{ color: 'red' }}>*</span>
            </Typography>
            <StarRating
              value={formik.values.Rating}
              onChange={newValue => formik.setFieldValue('Rating', newValue)}
              error={formik.touched.Rating && formik.errors.Rating}
            />
          </Box>

          {/* Feedback Text */}
          <Box>
            <Typography mb={2} fontWeight={600}>
              What is the main reason for your score? <span style={{ color: 'red' }}>*</span>
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
            <Typography fontWeight={600}>
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
          <Button
            variant="contained"
            color="primary"
            onClick={formik.handleSubmit}
            // disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <Loader width="24" />
            ) : (
              'Submit'
            )}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default FeedbackView;
