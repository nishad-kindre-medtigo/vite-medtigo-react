import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Stack,
  CircularProgress,
  TextareaAutosize,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import alertPage from '../../services/alertPage';
import { useMediaQuery } from '@mui/material';


const StarRating = ({ value, onChange, error, isMobile  }) => {
  const labels = ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'];

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" gap={isMobile ? 1: 2} flexWrap={isMobile ? 'wrap' : 'nowrap'}>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={index < value ? '#FFD700' : '#ccc'}
              width="40px"
              height="40px"
            >
              <path d="M12 .587l3.668 7.435 8.21 1.193-5.938 5.788 1.402 8.162L12 18.896l-7.342 3.861 1.402-8.162L.122 9.215l8.21-1.193L12 .587z" />
            </svg>
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

function CoursesFeedbackView() {
  const openSnackbar = useOpenSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [openDialog, setOpenDialog] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      Rating: 0,
      Feedback: '',
      contact: 'yes',
      name: queryParams.get('first_name')
        ? `${queryParams.get('first_name') || ''} ${queryParams.get('last_name') || ''}`
        : '',
      email: '',
      phone: ''
    },
    validationSchema: Yup.object({
      Rating: Yup.number().min(1, 'Please select a rating').required('Rating is required'),
      Feedback: Yup.string().required('Feedback is required'),
      contact: Yup.string().required('Please select an option'),
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string().matches(/^[0-9]{5,15}$|^$/, 'Phone number must be 5 to 15 digits.')
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
        resetForm();
        setOpenDialog(true); // show dialog
      } catch (error) {
        console.error(error);
        openSnackbar('Something went wrong.', 'error');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <>
      {/* Main Page */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#F8F9FA',
          overflowY: 'auto',
          position: 'relative',
          padding: '80px 20px 20px'
        }}
      >
        {/* Sticky Header */}
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
          width: '100%',
          maxWidth: isMobile ? '100%' : 600,
          background: 'white',
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          p: isMobile ? 2 : 4,
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

            {/* Contact Info */}
            <Box>
              <Typography fontWeight={600} mb={2}>
                Contact Information
              </Typography>
              <Stack spacing={2}>
                {/* Name */}
                <Box>
                  <Typography variant="body2" mb={1}>
                    Name <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle(formik, 'name')}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <Typography variant="caption" color="error">
                      {formik.errors.name}
                    </Typography>
                  )}
                </Box>

                {/* Email */}
                <Box>
                  <Typography variant="body2" mb={1}>
                    Email <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle(formik, 'email')}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <Typography variant="caption" color="error">
                      {formik.errors.email}
                    </Typography>
                  )}
                </Box>

                {/* Phone */}
                <Box>
                  <Typography variant="body2" mb={1}>
                    Phone Number (Optional)
                  </Typography>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formik.values.phone}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, '').slice(0, 15);
                      formik.setFieldValue('phone', cleaned);
                    }}
                    onBlur={formik.handleBlur}
                    style={inputStyle(formik, 'phone')}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <Typography variant="caption" color="error">
                      {formik.errors.phone}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>

            {/* Rating */}
            <Box>
              <Typography  textAlign={isMobile ? 'left' : 'center'} fontWeight={600} mb={1} fontSize={isMobile ? '15px' : '16px'} letterSpacing={isMobile ? '0.02em' : ''}>
                Your overall satisfaction with our courses <span style={{ color: 'red' }}>*</span>
              </Typography>
              <StarRating
                value={formik.values.Rating}
                onChange={(newValue) => formik.setFieldValue('Rating', newValue)}
                error={formik.touched.Rating && formik.errors.Rating}
                isMobile={isMobile}
              />
            </Box>

            {/* Feedback */}
            <Box>
              <Typography mb={2} fontWeight={600} fontSize={isMobile ? '15px' : '16px'} letterSpacing={isMobile ? '0.03em' : ''}>
                What is the main reason for your score? <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextareaAutosize
  placeholder="Write your feedback here..."
  name="Feedback"
  value={formik.values.Feedback}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  minRows={4}
  maxRows={6} // 👈 this enables scroll when limit is hit
  style={{
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: `1px solid ${
      formik.touched.Feedback && formik.errors.Feedback
        ? theme.palette.error.main
        : '#ccc'
    }`,
    outline: 'none',
    overflow: 'auto' // 👈 makes sure scrollbar appears
  }}
              />
              {formik.touched.Feedback && formik.errors.Feedback && (
                <Typography variant="caption" color="error">
                  {formik.errors.Feedback}
                </Typography>
              )}
            </Box>

            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={formik.handleSubmit}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{ sx: { zIndex: 1400 } }}
      >
        <DialogTitle>Thank You!</DialogTitle>
        <DialogContent>
          <Typography>Your feedback has been submitted successfully.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Helper: input style with error handling
const inputStyle = (formik, name) => ({
  height: '40px',
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  borderRadius: '4px',
  border: `1px solid ${
    formik.touched[name] && formik.errors[name] ? '#f44336' : '#ccc'
  }`,
  outline: 'none',
  boxSizing: 'border-box'
});

export default CoursesFeedbackView;
