import React from 'react';
import { Box, Typography, Link, Button } from '@mui/material';
import { SOCIAL_LINKS, ABOUT_LINKS, CONTACT_MAILS } from './data';

const classes = {
  root: {
    '& .MuiTypography-root, & .MuiLink-root, & .MuiButton-root': {
      '@media (min-width: 600px) and (max-width: 1279px)': {
        fontSize: '11.7px !important'
      }
    }
  },
  footer: {
    backgroundColor: '#143961',
    color: 'white'
  },
  section: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px 40px',
    maxWidth: '1440px',
    margin: '0 auto',
    boxSizing: 'border-box',
    '@media (max-width: 960px)': {
      padding: '30px 32px'
    },
    '@media (max-width: 600px)': {
      padding: '30px 16px',
      flexDirection: 'column'
    }
  },
  logo: {
    width: '200px',
    marginBottom: '6px',
    '@media (max-width: 960px)': {
      width: '150px' // Adjust for medium screens
    },
    '@media (max-width: 600px)': {
      width: '50% !important'
    }
  },
  socialIcon: {
    height: '30px',
    width: '30px',
    backgroundColor: '#466382',
    borderRadius: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  link: {
    color: 'white !important',
    textDecoration: 'none !important',
    fontWeight: '300 !important',
    fontSize: '15px !important',
    letterSpacing: '0.03em !important',
    lineHeight: '24px !important',
    '@media (min-width: 600px) and (max-width: 1280px)': {
      fontSize: '11.7px !important'
    },
    '@media (max-width: 960px)': {
      fontSize: '11.7px !important'
    },
    '@media (max-width: 600px)': {
      fontSize: '12px !important'
    }
  },
  contactlink: {
    color: 'white !important',
    textDecoration: 'underline !important',
    textDecorationColor: 'white !important',
    fontWeight: 300,
    '@media (max-width: 600px)': {
      fontSize: '12px !important'
    }
  },
  contactlinkNoUnderline: {
    color: 'white !important',
    textDecoration: 'none !important',
    fontWeight: 300,
    '@media (max-width: 600px)': {
      fontSize: '12px !important'
    }
  },
  title: {
    fontWeight: '600 !important',
    fontSize: '1.25rem !important',
    letterSpacing: '0.03em !important',
    lineHeight: '27px !important',
    marginBottom: '25px !important',
    marginTop: '12px !important',
    '@media (min-width: 600px) and (max-width: 1280px)': {
      fontSize: '14px !important'
    },
    '@media (max-width: 960px)': {
      fontSize: '18px !important' // Adjust for medium screens
    },
    '@media (max-width: 600px)': {
      fontSize: '14px !important'
    }
  },
  addressTitle: {
    fontWeight: '600 !important',
    fontSize: '15px !important',
    letterSpacing: '0.03em !important',
    marginBottom: '8px !important',
    lineHeight: '24px !important',
    '@media (min-width: 600px) and (max-width: 1280px)': {
      fontSize: '11.7px !important'
    },
    '@media (max-width: 960px)': {
      fontSize: '13px !important' // Adjust for medium screens
    },
    '@media (max-width: 600px)': {
      fontSize: '12px !important'
    }
  },
  address: {
    fontWeight: '300 !important',
    marginBottom: '20px !important',
    fontSize: '15px !important',
    letterSpacing: '0.03em !important',
    lineHeight: '26px !important',
    '@media (min-width: 600px) and (max-width: 1280px)': {
      fontSize: '11.7px !important'
    },
    '@media (max-width: 960px)': {
      fontSize: '12px !important' // Adjust for medium screens
    },
    '@media (max-width: 600px)': {
      fontSize: '12px !important'
    }
  },
  contact: {
    fontWeight: '300 !important',
    fontSize: '15px !important',
    letterSpacing: '0.03em !important',
    lineHeight: '28px !important',
    color: '#ffffff',
    '@media (min-width: 600px) and (max-width: 1280px)': {
      fontSize: '11.7px !important'
    },
    '@media (max-width: 960px)': {
      fontSize: '11.7px !important'
    },
    '@media (max-width: 600px)': {
      fontSize: '12px !important'
    }
  },
  appLink: {
    width: 36,
    height: 36,
    marginRight: '15px'
  },
  joinUs: {
    minWidth: '87px',
    backgroundColor: '#2872C1 !important',
    borderRadius: '3px !important',
    fontWeight: '600 !important',
    fontSize: '13px !important',
    marginBottom: '7px !important',
    padding: '8px 16px',
    color: 'white',
    '&:hover': {
      backgroundColor: '#1e5c9e'
    },
    '@media (max-width: 960px)': {
      fontSize: '10px !important' // Adjust for medium screens
    },
    '@media (max-width: 600px)': {
      fontSize: '11px'
    }
  },
  copyright: {
    backgroundColor: '#10345A',
    padding: '16px',
    borderTop: '1px solid #8C8C8C',
    fontSize: '15px !important',
    '@media (max-width: 960px)': {
      fontSize: '14px !important' // Adjust font size for medium screens
    }
  },
  copyrightText: {
    fontsize: '15px !important',
    fontWeight: '200 !important',
    letterSpacing: '0.03em',
    textAlign: 'center',
    '@media (min-width: 600px) and (max-width: 1280px)': {
      fontSize: '11.7px !important'
    },
    '@media (max-width: 960px)': {
      fontSize: '14px !important' // Adjust for medium screens
    },
    '@media (max-width: 600px)': {
      fontSize: '12px !important'
    }
  },
  description: {
    fontWeight: '300 !important',
    letterSpacing: '0.03em !important',
    marginBottom: '20px !important',
    lineHeight: '26px !important',

    // For screens below 1280px
    width: '200px',
    fontSize: '11.7px !important',

    // For screens 1280px and above
    '@media (min-width: 1281px)': {
      width: '230px',
      fontSize: '15px !important'
    },
    '@media (max-width: 960px)': {
      width: 'auto',
      fontSize: '11.7px !important'
    },
    // For screens smaller than small (max 600px)
    '@media (max-width: 600px)': {
      fontSize: '12px !important',
      lineHeight: '20px !important',
      width: '100%'
    }
  },

  customHr: {
    borderBottom: 'var(--bs-border-width) var(--bs-border-style) var(--bs-border-color)',
    borderColor: '#FFFFFF6E',
    width: '210px',
    marginBlock: '17px ',
    '@media (max-width: 1279px)': {
      width: '180px !important' // Adjust for large screens and below
    },
    '@media (max-width: 960px)': {
      width: '160px !important' // Adjust for medium screens and below
    },
    '@media (max-width: 600px)': {
      width: '100% !important' // Full width for mobile screens
    }
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '2fr 2fr 2fr 2.6fr',
    gap: '40px',
    // Added for absolute positioning of debug info

    '@media (min-width: 1280px)': {
      gridTemplateColumns: '2fr 2fr 2fr 2.8fr !important',
      gap: '40px !important'
    },
    '@media (min-width: 600px) and (max-width: 1366px)': {
      gridTemplateColumns: '2fr 2fr 2fr 2.6fr',
      gap: '30px'
    },
    '@media (min-width: 960px)': {
      gridTemplateColumns: '2fr 2fr 2fr 2.6fr',
      gap: '60px'
    },
    '@media (min-width: 600px) and (max-width: 1280px)': {
      gridTemplateColumns: '2fr 2fr 2fr 2.6fr',
      gap: '30px'
    },
    //  '@media (min-width: 960px)': {
    //   gridTemplateColumns: '1fr 1fr',
    //   gap: '30px',
    // },
    // Mobile
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
      gap: '20px'
    }
  },

  downloadApp: {
    marginRight: '18px !important',
    fontWeight: '600 !important',
    letterSpacing: '0.03em',
    fontSize: '14px !important',
    marginTop: '10px !important',
    lineHeight: '24px !important',
    '@media (min-width: 600px) and (max-width: 1280px)': {
      fontSize: '11.7px !important'
    },
    '@media (max-width: 960px)': {
      fontSize: '10px !important' // Adjust for medium screens
    },
    '@media (max-width: 600px)': {
      fontSize: '12px !important',
      marginRight: '9px !important'
    }
  },
  CopyrightIcon: {
    marginRight: '.5rem !important',
    verticalAlign: 'sub',
    fontSize: '20px',
    '@media (max-width: 600px)': {
      fontSize: '15px !important',
      verticalAlign: 'middle'
    }
  },
  MarginContainer: {
    '@media (min-width: 960px)': {
      marginLeft: '0 !important'
    },
    '@media (max-width: 960px)': {
      marginLeft: '0 !important'
    }
  }
};

const Footer = () => {
  return (
    <>
      <footer style={classes.footer}>
        <Box sx={classes.section}>
          <Box sx={{ width: '100%', margin: '0 auto', maxWidth: '1440px' }}>
            <Box sx={classes.gridContainer}>
              <Box  sx={classes.MarginContainer}>
                <Link href="https://medtigo.com/">
                  <Box component="img"
                    src="https://medtigo.com/wp-content/uploads/2024/05/medtigo_2-1.svg"
                    alt="Medtigo Logo"
                    sx={classes.logo}
                  />
                </Link>
                <Typography sx={classes.description}>
                  Founded in 2014, medtigo is committed to providing
                  high-quality, friendly physicians, transparent pricing, and a
                  focus on building relationships and a lifestyle brand for
                  medical professionals nationwide.
                </Typography>
                <Box sx={{ display: 'flex', gap: '7px' }}>
                  {SOCIAL_LINKS.map((icon, index) => (
                    <Box key={index}>
                      <Link href={icon.href}>
                        <Box sx={classes.socialIcon}>
                          <Box component="img"
                            src={icon.src}
                            alt="link"
                            sx={{ width: '12px', height: '12px' }}
                          />
                        </Box>
                      </Link>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={classes.MarginContainer}>
                <Typography variant="h6" sx={classes.title}>
                  ABOUT
                </Typography>
                {ABOUT_LINKS.map((link, index) => (
                  <Box key={index}>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{
                        display: 'flex',
                        gap: '15px',
                        alignItems: 'center'
                      }}
                    >
                      <Box component="img"
                        width="15px"
                        height="15px"
                        src="https://medtigo.com/wp-content/uploads/2023/04/Vector-15.svg"
                        alt="link"
                      />
                      <Link href={link.href} sx={classes.link}>
                        {link.text}
                      </Link>
                    </Typography>
                    {index < 4 && <Box component="hr" sx={classes.customHr} />}
                  </Box>
                ))}
              </Box>

              <Box sx={classes.MarginContainer}>
                <Typography variant="h6" sx={classes.title}>
                  ADDRESS
                </Typography>
                <Typography sx={classes.addressTitle}>
                  MASSACHUSETTS – USA
                </Typography>
                <Typography sx={classes.address}>
                  medtigo, LLC
                  <br />
                  228 Main Street, Unit 368
                  <br />
                  Williamstown, MA 01267
                </Typography>
                <Typography sx={classes.addressTitle}>
                  MAHARASHTRA – INDIA
                </Typography>
                <Typography sx={classes.address}>
                  H-5020, 5th floor, H-building.
                  <br />
                  Solitaire Business Hub,
                  <br />
                  Opp. Neco Garden Society,
                  <br />
                  Clover Park, Viman Nagar,
                  <br />
                  Pune, Maharashtra 411014
                </Typography>
              </Box>

              <Box sx={{...classes.contactContainer, ...classes.MarginContainer}}
              >
                <Typography variant="h6" sx={classes.title}>
                  CONTACT
                </Typography>
                {CONTACT_MAILS.map((contact, index) => (
                  <Box key={index} sx={{ marginBottom: '0px !important' }}>
                    <Typography sx={classes.contact}>
                      {contact.label}
                      <Link
                        href={contact.href}
                        sx={
                          contact.noUnderline
                            ? classes.contactlinkNoUnderline
                            : classes.contactlink
                        }
                      >
                        {contact.text}
                      </Link>
                    </Typography>
                  </Box>
                ))}

                <Box mt={2}>
                  <Box component="img"
                    src="/images/SocBadge.svg"
                    alt="SOC 2 Type 1 Certified"
                    width="298px"
                    sx={{ marginLeft: '-19px', marginTop: '-12px' }}
                  />
                </Box>
                <Box sx={classes.contactContainer}>
                  <Box
                    mt={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="start"
                    marginTop="-20px"
                  >
                    <Typography variant="body2" sx={classes.downloadApp}>
                      DOWNLOAD APP
                    </Typography>
                    <Box
                      mt={2}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Link href="https://play.google.com/store/apps/details?id=com.medtigo&hl=en_IN&gl=US&pli=1">
                        <Box component="img"
                          src="https://medtigo.com/wp-content/uploads/2023/04/playstore-1.png"
                          alt="Google Play Store"
                          sx={classes.appLink}
                        />
                      </Link>
                      <Link href="https://apps.apple.com/us/app/medtigo/id1519512468">
                        <Box component="img"
                          src="https://medtigo.com/wp-content/uploads/2023/04/PLAYSTOREW.png"
                          alt="Apple App Store"
                          sx={classes.appLink}
                        />
                      </Link>
                      <Button
                        variant="contained"
                        sx={classes.joinUs}
                        href="https://auth.medtigo.com/register"
                      >
                        JOIN US
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={classes.copyright}>
          <Typography sx={classes.copyrightText}>
            <Box component="img" alt="copyright" src='https://medtigo.com/wp-content/uploads/2024/08/Group-1000005825.svg' sx={classes.CopyrightIcon} />
            COPYRIGHT 2025 MEDTIGO, ALL RIGHTS RESERVED
          </Typography>
        </Box>
      </footer>
    </>
  );
};

export default Footer;
