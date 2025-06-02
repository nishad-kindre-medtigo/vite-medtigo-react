import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography, TextField, Box, CircularProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useOpenSnackbar } from '../../../../hooks/useOpenSnackbar';
import useBreakpoints from '../../../../hooks/useBreakpoints';
import { contactData } from '../../data';
import { boxStyles, ContentBox, StyledInputLabel, SubmitButton, ContactInfoBox } from '../components';

const ContactPage = () => {
  const { email, first_name, last_name } = useSelector(state => state.account.user);
  const userName = `${first_name} ${last_name}`;
  const openSnackbar = useOpenSnackbar();
  const { isMobile } = useBreakpoints();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .max(256, 'Character limit of 256 exceeded')
      .matches(/^[A-Za-zÀ-ÿ-' ]+$/, 'Only English Letters Allowed')
      .required('Required*'),
    email: Yup.string()
      .email('Invalid Email')
      .required('Required*'),
    subject: Yup.string()
      .max(256, 'Character limit of 256 exceeded')
      .required('Required*'),
    message: Yup.string()
      .max(256, 'Character limit of 256 exceeded')
      .required('Required*')
  });

  // Wordpress API Call
  const submitForm = async (values) => {
    const apiUrl =
      'https://staffing.medtigo.com/wp-json/myplugin/v1/submit-form';
    const response = await axios.post(apiUrl, {
      name: values.name,
      email: values.email,
      subject: values.subject,
      message: values.message
    });

    if (response.status === 200) {
      return response;
    } else {
      throw new Error(`Unexpected response status: ${response.data}`);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      await submitForm(values);
      openSnackbar('Form submitted Successfully!');
      setTimeout(
        () => openSnackbar('Our Staff will reach out to you soon!', 'info'),
        3000
      );
    } catch (error) {
      setIsSubmitting(true);
      openSnackbar('Failed to Submit Form!', 'error');
    } finally {
      resetForm();
      setIsSubmitting(false);
    }
  };

  const HeroContainer = () => {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          py: 4,
          mt: 1,
          pb: { sm: 0, xs: 0 },
          width: '100vw',
          backgroundColor: '#F8F9FA'
        }}
      >
        <Box sx={boxStyles}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography mb={1} style={{ fontSize: '32px', fontWeight: 600, lineHeight: '48px', letterSpacing: '4%' }}>
                {contactData.title}
              </Typography>
              <Typography mb={1} style={{ fontSize: '24px', fontWeight: 500, lineHeight: '36px' }}>
                Tell us how we can help you &{!isMobile && <br />} your organization.
              </Typography>
              <Typography style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px', color: '#4C4B4B' }}>
                {contactData.h2}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={contactData.heroImg}
                alt={contactData.title}
                loading="lazy"
                sx={{
                  width: '100%',
                  maxWidth: '400px',
                  mx: 'auto',
                  display: 'block'
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    );
  };

  const FormSection = () => {
    return (
      <>
        <Typography my={2} style={{ fontSize: '24px', fontWeight: 600, lineHeight: '36px' }} align="center">
          {"Let's Get Started"}
        </Typography>

        <Box display="flex" justifyContent="center" alignItems="center">
          <Box
            sx={{
              p: 3,
              maxWidth: '750px',
              boxShadow: '0px 6px 12px -2px #32325D40',
              border: '1px solid #EBEBEB',
              borderRadius: 1
            }}
          >
            <Typography mb={2} align="center" style={{ fontSize: '18px', fontWeight: 500, lineHeight: '27px' }}>
              Complete the form below and our staff will reach out to you right away!
            </Typography>

            <Formik
              initialValues={{
                name: userName || '',
                email: email || '',
                subject: '',
                message: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleBlur, errors, touched }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <StyledInputLabel htmlFor="name">Name</StyledInputLabel>
                      <Field
                        as={TextField}
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
                    <Grid item xs={12}>
                      <StyledInputLabel htmlFor="email">Email</StyledInputLabel>
                      <Field
                        as={TextField}
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
                    <Grid item xs={12}>
                      <StyledInputLabel htmlFor="subject">
                        Subject
                      </StyledInputLabel>
                      <Field
                        as={TextField}
                        id="subject"
                        name="subject"
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={1}
                        maxRows={4}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.subject}
                        error={touched.subject && Boolean(errors.subject)}
                        helperText={touched.subject && errors.subject}
                        placeholder="Enter Subject"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledInputLabel htmlFor="message">
                        Your Message
                      </StyledInputLabel>
                      <Field
                        as={TextField}
                        id="message"
                        name="message"
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={1}
                        maxRows={4}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.message}
                        error={touched.message && Boolean(errors.message)}
                        helperText={touched.message && errors.message}
                        placeholder="Enter your message here"
                      />
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="center">
                      <SubmitButton type="submit" variant="contained" disabled={isSubmitting} disableElevation sx={{ minWidth: '140px' }}>
                        {isSubmitting ? <CircularProgress size={28} style={{ color: '#fff'}} /> : 'SUBMIT NOW'}
                      </SubmitButton>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </>
    );
  };

  const ContactInformation = () => {
    return (
      <Box sx={{ maxWidth: '750px', margin: '0 auto' }}>
        <Grid container spacing={4} my={3} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <ContactInfoBox
              icon={contactData.contactIcon}
              title="Phone"
              link="tel: 413-419-0592"
              linkText=" 413-419-0592"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ContactInfoBox
              icon={contactData.emailIcon}
              title="Email"
              link="mailto:staffing@medtigo.com"
              linkText="staffing@medtigo.com"
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <>
      <HeroContainer />
      <ContentBox>
        <FormSection />
        <ContactInformation />
      </ContentBox>
    </>
  );
};

export default ContactPage;
