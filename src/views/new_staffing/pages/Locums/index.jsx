import React, { useState, useEffect, useRef } from 'react';
import { specialties, features, whyJobBoard, blogs } from '../../data';
import { Grid, Typography, Box, CircularProgress, Card, CardContent, useTheme, useMediaQuery, Paper, Button, CardMedia, TextField, } from '@mui/material';
import useBreakpoints from '../../../../hooks/useBreakpoints';
import { LearnMoreButton, StyledInputLabel, SubmitButton } from '../../components';
import { useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import { useSelector } from 'react-redux';
import { useOpenSnackbar } from '../../../../hooks/useOpenSnackbar';
import staffingServices from '../../../../services/staffingServices';
import { CONNECT_URL } from '../../../../settings';

const LocumsHeader = '/images/staffing/locumsheader.svg';
const jobboardinterface = '/images/staffing/Job board mobile.svg';
const Fillthegap = '/images/staffing/fillthegap.svg';
const TickIcon = '/images/staffing/tickIcon.svg';
const MailIconFillGap = '/images/staffing/MailIconFillGap.svg';
const PhoneIconFillGap = '/images/staffing/PhoneIconFillGap.svg';
const phoneIconLine = '/images/staffing/phoneIconLine.svg';
const mailIconLine = '/images/staffing/mailIconLine.svg';

const useStyles = {
  bannerContainer: {
    background: '#E4EFFFB2',
    padding: '0px 75px',
    '@media (max-width: 600px)': {
      padding: '32px 24px 0px'
    }
  },
  contentContainer: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontWeight: 600,
    fontSize: '40px',
    fontFamily: 'Poppins',
    lineHeight: '55px',
    textAlign: 'left',
    '@media (max-width: 600px)': {
      fontSize: '32px',
      lineHeight: '42px',
      textAlign: 'center'
    }
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    marginTop: '32px',
    justifyContent: 'flex-start',
    '@media (max-width: 600px)': {
      justifyContent: 'center'
    }
  },
  icon: {
    marginRight: '22px',
    width: '22px',
    '@media (max-width: 600px)': {
      width: '20px'
    }
  },
  contactContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  contactText: {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '27px',
    letterSpacing: '3%',
    textDecoration: 'underline',
    color: '#000',
    '@media (max-width: 600px)': {
      fontSize: '16px'
    }
  },
  connectButton: {
    backgroundColor: '#2872C1',
    color: 'white',
    padding: '12px 28px',
    fontSize: '18px',
    fontWeight: 600,
    borderRadius: '5px',
    marginTop: '30px',
    textTransform: 'none',
    display: 'block',
    width: 'auto',
    margin: '30px 0 0',
    '&:hover': {
      backgroundColor: '#1565c0'
    },
    '@media (max-width: 600px)': {
      fontSize: '16px',
      margin: '30px auto 0'
    }
  },
  illustrationContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '0',
    '@media (max-width: 600px)': {
      marginTop: '32px'
    }
  },
  illustration: {
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
    '@media (max-width: 600px)': {
      maxWidth: '280px'
    }
  }
};

const LocumsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const contactRef = useRef(null);

  const scrollToContact = () => {
    setTimeout(() => {
      contactRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  useEffect(() => {
    if (location.pathname === '/career/contact') {
      scrollToContact();
    }
  }, [location.pathname]);

  const handleConnectWithExperts = () => {
    scrollToContact();
  };

  const HeroContainer = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
      <Grid
        container
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          py: 4,
          width: '100vw',
          backgroundColor: '#E4EFFFB2'
        }}
      >
        <Box
          sx={{
            maxWidth: '1400px',
            px: isMobile ? 2 : '',
            paddingLeft: '12px'
          }}
        >
          <Grid container spacing={isMobile ? 2 : 4}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                pl: { xs: 0, md: 5 },
                paddingRight: isMobile ? '0px !important' : '140px !important',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: { xs: 'center', md: 'flex-start' },
                textAlign: { xs: 'center', md: 'left' },
                px: { xs: 3, md: 'inherit' }
              }}
            >
              <Typography
                mb={1}
                style={{
                  color: '#000000',
                  fontSize: isMobile ? '28px' : '36px',
                  fontWeight: 600,
                  lineHeight: isMobile ? '42px' : '54px',
                  letterSpacing: '3%'
                }}
              >
                medtigo <span style={{ color: '#2872C1' }}>Staffing</span>
              </Typography>
              <Typography
                mb={1}
                style={{
                  color: '#0C0C0C',
                  fontSize: isMobile ? '22px' : '26px',
                  fontWeight: 500,
                  lineHeight: isMobile ? '33px' : '39px'
                }}
              >
                Explore Locum Tenens Positions Tailored To You
              </Typography>
              <Typography
                mb={3}
                style={{
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 400,
                  lineHeight: isMobile ? '24px' : '27px',
                  color: '#4C4B4B'
                }}
              >
                At medtigo, we are dedicated to connecting healthcare
                professionals with locum tenens opportunities across the
                country. Our platform is designed to simplify the job search
                process for healthcare providers, offering a comprehensive and
                user-friendly experience.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  width: '100%'
                }}
              >
                <LearnMoreButton
                  variant="contained"
                  disabled={isSubmitting}
                  disableElevation
                  href="https://staffing.medtigo.com/"
                  onClick={() => setIsSubmitting(true)}
                  sx={{ width: isMobile ? 'auto' : 'auto' }}
                >
                  {isSubmitting ? (
                    <CircularProgress
                      size={28}
                      style={{
                        color: '#fff',
                        background: '#2872C1',
                        fontSize: '16px',
                        fontWeight: '500'
                      }}
                    />
                  ) : (
                    'Learn More'
                  )}
                </LearnMoreButton>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                component="img"
                src={LocumsHeader}
                alt="locums header"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  padding: isMobile ? '0 16px' : 0
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    );
  };

  const FeatureCard = ({ icon, title, description }) => {
    const [expanded, setExpanded] = useState(false);

    const truncateText = (text, maxLength = 135) => {
      if (text.length <= maxLength) return text;
      return expanded ? text : text.slice(0, maxLength);
    };

    return (
      <Grid
        item
        xs={12}
        sm={isMobile ? 12 : 6}
        md={4}
        style={{
          paddingLeft: isMobile ? '24px' : '38px',
          paddingTop: isMobile ? '24px' : '38px'
        }}
      >
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: isMobile ? '16px' : '24px',
            borderRadius: '1px',
            boxShadow: '0px 4px 8px -2px #091E4240',
            backgroundColor: 'white'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '16px'
            }}
          >
            <Box
              component="img"
              src={icon}
              alt={title}
              style={{ width: 40, height: 40, color: '#1976d2' }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '600',
              textAlign: 'center',
              marginBottom: '8px',
              letterSpacing: '0.03em',
              wordBreak: 'break-word',
              whiteSpace: 'pre-line', // Allows line break
              lineHeight: '1.3',
              maxWidth: '100%'
            }}
          >
            {title.split(' ').slice(0, 2).join(' ') +
              '\n' +
              title.split(' ').slice(2).join(' ')}
          </Typography>

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: '16px',
                color: '#4C4B4B',
                textAlign: 'center',
                lineHeight: '1.5',
                fontWeight: '400'
              }}
            >
              {truncateText(description)}
              {description.length > 135 && (
                <>
                  <Typography
                    component="span"
                    sx={{
                      color: '#4C4B4B', // Keeping "..." in the same color
                      fontSize: '16px',
                      cursor: 'default' // No pointer effect
                    }}
                  >
                    ...
                  </Typography>
                  <Typography
                    component="span"
                    onClick={() => setExpanded(!expanded)}
                    sx={{
                      color: '#1976d2',
                      fontSize: '16px',
                      cursor: 'pointer',
                      textDecoration: 'underline', // Underline only for Read More / Read Less
                      marginLeft: '4px' // Adds space between "..." and the link
                    }}
                  >
                    {expanded ? 'Read Less' : 'Read More'}
                  </Typography>
                </>
              )}
            </Typography>
          </Box>
        </Card>
      </Grid>
    );
  };

  const FeatureCardGrid = () => {

    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: '1440px', // Add max-width for large screens
          margin: '0 auto', // Center the container
          paddingLeft: isMobile ? '0px' : '16px',
          paddingRight: isMobile ? '24px' : '46px'
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            justifyContent: 'center',
            width: '100%',
            margin: '0 auto'
          }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </Grid>
      </Box>
    );
  };

  const JobBoardSection = () => (
    <Paper
      style={{
        backgroundColor: '#1756B0',
        color: 'white',
        padding: isMobile ? '30px 20px' : '50px 120px 50px 75px',
        borderRadius: 'none'
      }}
    >
      <Box>
        <Grid container spacing={6} alignItems="center">
          <Grid
            item
            xs={12}
            md={6}
            style={{ paddingLeft: isMobile ? '55px' : '55px' }}
          >
            <div
              style={{
                display: isMobile ? 'flex' : '',
                justifyContent: isMobile ? 'center' : '',
                alignItems: isMobile ? 'center' : '',
                width: isMobile ? '100%' : '',
                textAlign: isMobile ? 'center' : ''
              }}
            >
              <Typography
                style={{
                  color: 'white',
                  fontSize: '36px',
                  fontWeight: '600',
                  marginBottom: '50px',
                  marginRight: '15px'
                }}
              >
                Why Choose Our Job Board?
              </Typography>
            </div>

            <Box
              style={{
                marginBottom: '24px',
                paddingRight: isMobile ? '0px' : '160px'
              }}
            >
              {whyJobBoard.map((item, index) => (
                <Box
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    marginBottom: '16px'
                  }}
                >
                  <Box
                    style={{
                      flexShrink: 0, // Prevents shrinking
                      marginRight: '15px' // Adds spacing between icon and text
                    }}
                  >
                    <Box
                      component="img"
                      src={TickIcon}
                      alt="Tick Icon"
                      style={{ width: '24px', height: '24px' }}
                    />
                  </Box>
                  <div>
                    <Typography
                      style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '15px'
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '20px'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </div>
                </Box>
              ))}
            </Box>
            <div
              style={{
                display: isMobile ? 'flex' : '',
                justifyContent: isMobile ? 'center' : '',
                alignItems: isMobile ? 'center' : '',
                width: isMobile ? '100%' : '',
                textAlign: isMobile ? 'center' : ''
              }}
            >
              <Button
                variant="contained"
                style={{
                  backgroundColor: 'white',
                  color: '#1756B0',
                  padding: '12px 24px',
                  marginLeft: isMobile ? '0px' : '36px',
                  letterSpacing: '0.03em',
                  fontFamily: 'Poppins'
                }}
                href={`${CONNECT_URL}/career/job-board`}
              >
                EXPLORE JOB BOARD
              </Button>
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            style={{
              paddingLeft: '0px',
              marginLeft: isMobile ? '46px' : '0px'
            }}
          >
            <Box
              component="img"
              src={jobboardinterface}
              alt="Job Board Interface"
              style={{
                width: isMobile ? '100%' : '100%'
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );

  const SpecialtiesSection = () => {
    return (
      <Box
        style={{
          marginBottom: isMobile ? '45px' : '90px',
          padding: isMobile ? '0 20px' : '0 75px'
        }}
      >
        <Typography
          align="center"
          style={{
            fontSize: '40px',
            fontWeight: 600,
            lineHeight: '48px',
            marginTop: '60px'
          }}
        >
          Our Practice Areas
        </Typography>
        <Typography
          align="center"
          style={{
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: '27px',
            color: '#4C4B4B',
            marginTop: '20px'
          }}
        >
          {
            "Nationwide opportunities across multiple specialties. You shouldn't need to settle in life or in your career."
          }
        </Typography>

        <Grid
          container
          spacing={5}
          my={1}
          alignItems="stretch"
          justifyContent="center"
        >
          {specialties.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.title}>
              <Box
                sx={{
                  p: 4,
                  boxShadow: '0px 4px 8px -2px #091E4240',
                  border: '1px solid #EBEBEB',
                  textAlign: 'center',
                  height: '100%'
                }}
              >
                <Box
                  component="img"
                  src={`/icons/specialty/${index + 1}.svg`}
                  alt="Specialty Icon"
                  loading="lazy"
                />
                <Typography
                  mb={1}
                  mt={2}
                  align="center"
                  style={{ fontSize: '18px', fontWeight: 600 }}
                >
                  {item.title.toUpperCase()}
                </Typography>
                <Typography
                  align="center"
                  style={{
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#4C4B4B'
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const ContactSection = () => {
    const classes = useStyles;
    const { email, first_name, last_name } = useSelector(
      (state) => state.account.user
    );
    const userName = `${first_name} ${last_name}`;
    const openSnackbar = useOpenSnackbar();
    const { isMobile } = useBreakpoints();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validationSchema = Yup.object().shape({
      name: Yup.string()
        .max(256, 'Character limit of 256 exceeded')
        .matches(/^[A-Za-zÀ-ÿ-' ]+$/, 'Only English Letters Allowed')
        .required('Required*'),
      email: Yup.string().email('Invalid Email').required('Required*'),
      message: Yup.string()
        .max(256, 'Character limit of 256 exceeded')
        .required('Required*')
    });

    const submitForm = async (values) => {
      try {
        const apiUrl =
          'https://staffing.medtigo.com/wp-json/myplugin/v1/submit-form';
        const response = await axios.post(apiUrl, {
          name: values.name,
          email: values.email,
          message: values.message
        });

        const payload = {
          user_name: values.name,
          email: values.email,
          message: values.message
        };
        const contactResponse =
          await staffingServices.submitContactForm(payload);
        if (response.status === 200) {
          return response;
        } else {
          throw new Error(`Unexpected response status: ${response.data}`);
        }
      } catch (error) {
        console.error('Form submission error:', error); // Error log
        throw error;
      }
    };

    const handleSubmit = async (values, { resetForm }) => {
      if (isSubmitting) return; // Prevent multiple submissions

      try {
        setIsSubmitting(true); // Disable button immediately after click

        await submitForm(values);
        openSnackbar('Form submitted Successfully!');

        setTimeout(() => {
          openSnackbar('Our Staff will reach out to you soon!', 'info');
        }, 3000);
        resetForm();
      } catch (error) {
        openSnackbar('Failed to Submit Form!', 'error');
      } finally {
        setTimeout(() => {
          setIsSubmitting(false);
        }, 5000);
      }
    };

    return (
      <Box
        ref={contactRef}
        sx={{
          bgcolor: '#1756B0',
          color: 'white',
          padding: isMobile ? '30px 20px' : '75px',
          textAlign: isMobile ? 'center' : 'left'
        }}
      >
        <Box>
          <Grid
            container
            spacing={4}
            justifyContent={isMobile ? 'center' : 'flex-start'}
          >
            {/* Left Section */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                paddingRight: isMobile ? '0px' : '200px',
                textAlign: isMobile ? 'center' : 'left'
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  fontSize: '36px',
                  letterSpacing: '4%',
                  lineHeight: '54px'
                }}
              >
                Contact Us
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 500,
                  fontSize: '26px'
                }}
              >
                Tell us how we can help you & your organization
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  lineHeight: '27px',
                  fontSize: '18px',
                  fontWeight: '400'
                }}
              >
                Are you curious about a healthcare services organization that
                cares about your needs? We help healthcare organizations with
                traditional and innovative solutions to staffing needs. We
                provide healthcare providers with access to well-paid and vetted
                work opportunities. We offer membership to an unique healthcare
                oriented ecosystem with extraordinary and exclusive benefits. We
                are medtigo. Contact us today.
              </Typography>
              <Box
                style={{
                  display: isMobile ? 'grid' : '',
                  justifyContent: isMobile ? 'center' : '',
                  width: isMobile ? '100%' : ''
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box component="img" src={mailIconLine} sx={classes.icon} />
                  <Typography
                    component="a"
                    href="mailto:staffing@medtigo.com"
                    sx={{
                      color: 'white',
                      textDecoration: 'underline',
                      fontSize: '18px',
                      fontWeight: '600',
                      '&:hover': { opacity: 0.8 }
                    }}
                  >
                    staffing@medtigo.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="img" src={phoneIconLine} sx={classes.icon} />
                  <Typography
                    component="a"
                    href="tel:413-419-0592"
                    sx={{
                      color: 'white',
                      textDecoration: 'underline',
                      fontSize: '18px',
                      fontWeight: '600',
                      '&:hover': { opacity: 0.8 }
                    }}
                  >
                    413-419-0592
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Section - Contact Form */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: '1px !important',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography
                  variant="h4"
                  component="h3"
                  sx={{
                    color: '#000',
                    fontWeight: 600,
                    mb: 2,
                    fontSize: '32px',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  Get In Touch
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                >
                  Complete the form below and our staff will reach out to you
                  right away!
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
                          <StyledInputLabel
                            style={{ textAlign: isMobile ? 'justify' : '' }}
                            htmlFor="name"
                          >
                            Name
                          </StyledInputLabel>
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
                          <StyledInputLabel
                            style={{ textAlign: isMobile ? 'justify' : '' }}
                            htmlFor="email"
                          >
                            Email
                          </StyledInputLabel>
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
                          <StyledInputLabel
                            style={{ textAlign: isMobile ? 'justify' : '' }}
                            htmlFor="message"
                          >
                            Message
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
                        <Grid
                          item
                          xs={12}
                          display="flex"
                          justifyContent="center"
                        >
                          <SubmitButton
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            disableElevation
                            sx={{ minWidth: '140px', marginTop: '12px' }}
                          >
                            {isSubmitting ? (
                              <CircularProgress
                                size={28}
                                style={{ color: '#fff' }}
                              />
                            ) : (
                              'SUBMIT NOW'
                            )}
                          </SubmitButton>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };

  const BlogCard = ({ image, title, link }) => {
    const isHowToBecomeLocum = title === 'How do I become a locum tenens?';

    const handleReadMore = () => {
      window.location.href = link;
    };

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '10px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: isMobile ? 'none' : 'translateY(-8px)'
          }
        }}
      >
        <Box
          sx={{
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CardMedia
            component="img"
            image={image}
            alt={title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center'
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              mb: 2,
              fontWeight: 500,
              fontSize: '22px',
              lineHeight: '33px'
            }}
          >
            {title}
          </Typography>
          <Button
            onClick={handleReadMore}
            color="primary"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '18px',
              p: 0,
              textDecoration: 'underline',
              '&:hover': {
                background: 'none',
                textDecoration: 'underline'
              },
              position: isHowToBecomeLocum ? 'relative' : 'initial',
              top: isHowToBecomeLocum ? '0px' : 'initial'
            }}
          >
            Read More
          </Button>
        </CardContent>
      </Card>
    );
  };

  const BlogSection = () => {

    const handleViewMore = () => {
      window.location.href = 'https://medtigo.com/blog/';
    };

    return (
      <Box
        style={{
          padding: isMobile ? '30px 20px' : '75px'
        }}
      >
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{
            mb: 6,
            fontWeight: 600,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Career Blogs
        </Typography>
        <Grid container spacing={4}>
          {blogs.map((blog, index) => (
            <Grid item xs={12} md={4} key={index}>
              <BlogCard {...blog} />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            onClick={handleViewMore}
            color="primary"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '18px',
              textDecoration: 'underline'
            }}
          >
            View More
          </Button>
        </Box>
      </Box>
    );
  };

  const HealthcareStaffingBanner = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles;

    return (
      <Box sx={classes.bannerContainer}>
        <Box>
          <Grid
            container
            spacing={isMobile ? 2 : 3}
            sx={classes.contentContainer}
          >
            <Grid item xs={12} md={6} style={{ paddingTop: '0px' }}>
              <Typography sx={classes.title}>We Fill The Gaps,</Typography>
              <Typography sx={classes.title}>You Deliver The Care</Typography>
              <Box
                style={{
                  display: isMobile ? 'flex' : '',
                  justifyContent: isMobile ? 'center' : '',
                  width: isMobile ? '100%' : ''
                }}
              >
                <Box sx={classes.contactContainer}>
                  <Box sx={classes.contactItem}>
                    <Box
                      component="img"
                      src={MailIconFillGap}
                      sx={classes.icon}
                    />
                    <Typography
                      component="a"
                      href="mailto:staffing@medtigo.com"
                      sx={classes.contactText}
                    >
                      staffing@medtigo.com
                    </Typography>
                  </Box>

                  <Box sx={classes.contactItem}>
                    <Box
                      component="img"
                      src={PhoneIconFillGap}
                      sx={classes.icon}
                    />
                    <Typography
                      component="a"
                      href="tel:413-419-0592"
                      sx={classes.contactText}
                    >
                      413-419-0592
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Button
                variant="contained"
                onClick={handleConnectWithExperts}
                sx={classes.connectButton}
              >
                CONNECT WITH EXPERTS
              </Button>
            </Grid>

            <Grid item xs={12} md={6} sx={classes.illustrationContainer}>
              {/* People illustration would go here. You could use an SVG or image */}
              <Box
                component="img"
                alt="Healthcare professionals connecting"
                src={Fillthegap}
                style={{ width: isMobile ? '100%' : '' }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <HeroContainer />
      <Box
        style={{
          padding: isMobile ? '32px 0' : '64px 0', // Remove horizontal padding here since it's handled in FeatureCardGrid
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography
          align="center"
          style={{
            marginBottom: isMobile ? '0px' : '32px',
            fontWeight: '600',
            fontSize: isMobile ? '32px' : '40px'
          }}
        >
          Why medtigo Staffing?
        </Typography>
        <Grid container>
          <FeatureCardGrid />
        </Grid>
      </Box>
      <JobBoardSection />
      <SpecialtiesSection />
      <ContactSection />
      <BlogSection />
      <HealthcareStaffingBanner />
    </>
  );
};

export default LocumsPage;
