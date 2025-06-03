import React, { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { FadeTransition } from '../../../../../layouts/NewLayout/TopBar/SearchBar';
import staffingServices from '../../../../../services/staffingServices';
import { StaffingContext } from '../../../../../context/StaffingContext';
import { Grid, Typography, Box, Dialog, DialogTitle, DialogContent, CircularProgress } from '@mui/material';
import { Loader } from '../../../../../ui/Progress';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import { StyledInputLabel, SubmitButton, OutlinedButton, CustomTextfield, VisuallyHiddenInput } from '../../../../new_staffing/components';

const ApplyForJobPopup = props => {
  const { open, setOpen, id, title, owner } = props;
  const { email, first_name, last_name, phoneNumber } = useSelector(state => state.account.user);
  const userName = `${first_name} ${last_name}`;
  const openSnackbar = useOpenSnackbar();
  const { isMobile } = useBreakpoints();
  const [selectedFile, setSelectedFile] = useState(null);
  const { refreshJobs } = useContext(StaffingContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => setOpen(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .max(256, 'Character limit of 256 exceeded')
      .matches(/^[A-Za-zÀ-ÿ-' ]+$/, 'Only English Letters Allowed')
      .required('Required*'),
    email: Yup.string()
      .email('Invalid Email')
      .required('Required*'),
    phoneNumber: Yup.string()
      .matches(/^(?=.*\d)[+\d\s()-]{5,20}$/, 'Invalid Phone number')
      .required('Required*'),
    cv: Yup.mixed()
      .required('Required*')
      .test(
        'fileSize',
        'File size exceeds the limit. Please upload a file smaller than 5MB.',
        value => !value || (value && value.size <= 5 * 1024 * 1024) // 5MB limit
      )
      .test(
        'fileType',
        'Unsupported file format',
        value =>
          !value ||
          (value &&
            [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ].includes(value.type))
      )
  });

  const handleSubmit = async values => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('phone', values.phoneNumber);
    formData.append('file', selectedFile || values.cv);
    formData.append('intendedID', id);
    formData.append('title', title);
    formData.append('owner', owner);

    try {
      await staffingServices.submitResume(formData);
      refreshJobs();
      handleClose();
      openSnackbar('Job Application Submitted Successfully!');
    } catch (error) {
      openSnackbar('Failed to submit application. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog fullWidth fullScreen={isMobile} open={open} TransitionComponent={FadeTransition}>
        <DialogTitle align="center" style={{ fontWeight: 600, fontSize: '24px', color: '#2872C1' }}>
          SUBMIT YOUR CV
        </DialogTitle>
        <DialogContent>
          <Typography align="center" style={{ fontSize: '18px', fontWeight: 500, lineHeight: '27px' }}>
            Please fill out the form below
          </Typography>

          <Formik
            initialValues={{
              name: userName || '',
              email: email || '',
              phoneNumber: phoneNumber || '',
              cv: null // Add initial value for file input
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <StyledInputLabel htmlFor="name">Name</StyledInputLabel>
                    <Field
                      as={CustomTextfield}
                      size="small"
                      id="name"
                      name="name"
                      variant="outlined"
                      fullWidth
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      placeholder="Enter Name"
                    />
                  </Grid>
                  <Grid size={12}>
                    <StyledInputLabel htmlFor="email">Email</StyledInputLabel>
                    <Field
                      as={CustomTextfield}
                      size="small"
                      id="email"
                      name="email"
                      variant="outlined"
                      fullWidth
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      placeholder="Enter Email"
                    />
                  </Grid>
                  <Grid size={12}>
                    <StyledInputLabel htmlFor="phoneNumber">
                      Phone Number
                    </StyledInputLabel>
                    <Field
                      as={CustomTextfield}
                      size="small"
                      id="phoneNumber"
                      name="phoneNumber"
                      variant="outlined"
                      fullWidth
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phoneNumber}
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                      placeholder="Enter Phone Number"
                    />
                  </Grid>

                  {/* Upload CV Section */}
                  <Grid size={12}>
                    <StyledInputLabel htmlFor="upload-cv">
                      Upload CV
                    </StyledInputLabel>
                    <label htmlFor="upload-cv">
                      <Box
                        p={1}
                        borderRadius={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="1px dashed #2872C1"
                        sx={{
                          height: '56px',
                          cursor: 'pointer'
                        }}
                      >
                        <CloudUploadRoundedIcon style={{ color: '#2872C1' }} />
                        <Typography color="textSecondary" ml={1} style={{ fontSize: '16px' }}>
                          {selectedFile ? selectedFile.name : 'Upload CV'}
                        </Typography>
                      </Box>
                    </label>
                    {/* Hidden File Input Field */}
                    <VisuallyHiddenInput
                      id="upload-cv"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={event => {
                        setSelectedFile(event.target.files[0]);
                        setFieldValue('cv', event.target.files[0]); // Set formik value for file
                      }}
                    />
                    {touched.cv && errors.cv && (
                      <Typography color="error" variant="caption">
                        {errors.cv}
                      </Typography>
                    )}
                  </Grid>

                  <Grid size={12} mt={1} display="flex" gap={2} justifyContent="flex-end" flexWrap="wrap">
                    <OutlinedButton variant="outlined" onClick={handleClose}>
                      SKIP FOR NOW
                    </OutlinedButton>
                    <SubmitButton type="submit" variant="contained" disabled={isSubmitting} disableElevation sx={{ minWidth: '100px' }}>
                      {isSubmitting ? <Loader width="24" /> : 'SUBMIT'}
                    </SubmitButton>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplyForJobPopup;
