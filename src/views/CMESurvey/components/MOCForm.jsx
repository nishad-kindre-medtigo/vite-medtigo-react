import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, FormControl, FormLabel, Grid, TextField, Typography } from '@mui/material';
import Page from 'src/components/Page';
import LearningService from 'src/services/learningService';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import FormSubmitBackdrop from './FormSubmitBackdrop';
import FormSubmissionPopup from './FormSubmissionPopup';

// SECONDARY OPTIONAL FORM OPIOID & NIHSS COURSE
const MOCForm = (props) => {
  const { dataForm, courseID, setActiveCertificateData, activeCertificateData } = props;

  const openSnackbar = useOpenSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSuccessPopup, setOpenSuccessPopup] = useState(false);

  const formik = useFormik({
    initialValues: {
      certifyingBoard: '',
      name: '',
      boardCertificationNumber: '',
      DOB: ''
    },
    validationSchema: Yup.object({
      certifyingBoard: Yup.string().required('Certifying Board is required'),
      name: Yup.string().required('Name is required'),
      boardCertificationNumber: Yup.string().required(
        'Board Certification Number is required'
      ),
      DOB: Yup.string()
        .matches(/^\d{2}\/\d{2}$/, 'Date of Birth must be in MM/DD format')
        .required('Date of Birth is required')
    }),
    onSubmit: async values => {
      setIsSubmitting(true);
      try {
        const response = await LearningService.OpioidFormSubmit(values);
        if (response) {
          const nonCMECertId = activeCertificateData.id;
          setActiveCertificateData({
            ...dataForm,
            id: dataForm.certificate_id,
            nonCMECertId
          });
          setOpenSuccessPopup(true);
        }
      } catch (error) {
        openSnackbar(
          error.error ||
            'An error occurred while submitting form. Please contact support.',
          'error'
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleSkip = () => {
    const nonCMECertId = activeCertificateData.id;
    setActiveCertificateData({
      ...dataForm,
      id: dataForm.certificate_id,
      nonCMECertId
    });
    setOpenSuccessPopup(true);
  };

  const handleCloseSuccessPopup = () => {
    setOpenSuccessPopup(false);

    // REDIRECT TO COURSE LEARNING PAGE AFTER GENERATING CERTIFICATE
    window.location.href = `/learning/course/${courseID}`;
  };

  return (
    <Page title="MOC/MOCA">
      <Grid container justifyContent="center" spacing={2} sx={{ p: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            sx={{
              py: 2,
              color: '#2872C1',
              fontSize: '32px',
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            MOC/MOCA
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              textAlign: 'center',
              mb: 3
            }}
          >
            Please provide your details below if your certifying board
            participates in MOC/MOCA credit and you would like to report credit
            hours. If your board does not participate or you do not want to
            report credit hours, please click the <b>SKIP</b> button.
          </Typography>
          <form autoComplete="off" onSubmit={formik.handleSubmit}>
            {[
              {
                label: '1. Name of Certifying Board*',
                name: 'certifyingBoard',
                placeholder: 'Type your response here'
              },
              {
                label:
                  '2. Name (your name as it appears on your board certificate)*',
                name: 'name',
                placeholder: 'Type your response here'
              },
              {
                label: '3. Board Certification Number*',
                name: 'boardCertificationNumber',
                placeholder: 'Type your response here'
              },
              {
                label: '4. Date of Birth - (MM/DD)*',
                name: 'DOB',
                placeholder: 'MM/DD',
                inputProps: { maxLength: 5 }
              }
            ].map(({ label, name, placeholder, inputProps }, index) => (
              <FormControl
                key={index}
                component="fieldset"
                fullWidth
                sx={{ mb: 3 }}
              >
                <FormLabel sx={{ mb: 1, color: '#000' }}>
                  {label}
                </FormLabel>
                <TextField
                  required
                  variant="outlined"
                  size="small"
                  name={name}
                  placeholder={placeholder}
                  value={formik.values[name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched[name] && Boolean(formik.errors[name])}
                  helperText={formik.touched[name] && formik.errors[name]}
                  inputProps={inputProps}
                />
              </FormControl>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                size="large"
                sx={{ minWidth: '150px' }}
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                SKIP
              </Button>
              <Button
                variant="contained"
                size="large"
                sx={{ minWidth: '150px' }}
                type="submit"
                disabled={isSubmitting}
              >
                SUBMIT
              </Button>
            </Box>
          </form>
        </Grid>
      </Grid>
      <FormSubmitBackdrop open={isSubmitting && !openSuccessPopup} />
      <FormSubmissionPopup open={openSuccessPopup} handleClose={handleCloseSuccessPopup} />
    </Page>
  );
};

export default MOCForm;
