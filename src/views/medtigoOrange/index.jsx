import React from 'react';
import { Box, Grid, Typography, Divider, Link } from '@mui/material';
import { benefits, aboutInfo } from './data';
import { useSelector } from 'react-redux';
import useBreakpoints from 'src/hooks/useBreakpoints';

const boxStyles = {
  width: '100%',
  maxWidth: '1440px',
  px: { xs: 2, md: 4, lg: 5 }
};

const ContentBox = ({ children, sx = {}, ...props }) => (
  <Box sx={{ margin: '0 auto', ...boxStyles, ...sx }} {...props}>
    {children}
  </Box>
);

const MedtigoOrangePage = () => {
  const { isTablet } = useBreakpoints();
  const { first_name } = useSelector(state => state.account.user);

  const DividerText = ({ text }) => (
    <Box py={1} style={{ position: 'relative' }}>
      <Divider style={{ background: '#D8D8D8' }} />
      <Typography
        px={{ xs: 0.5, md: 2 }}
        style={{
          position: 'absolute',
          fontWeight: 300,
          fontSize: isTablet ? '18px' : '28px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          color: '#1E1E1E'
        }}
      >
        {text}
      </Typography>
    </Box>
  );

  const HeroContainer = () => (
    <Grid container justifyContent="center" alignItems="center" sx={{ py: 4, width: '100vw' }}>
      <Box sx={boxStyles}>
        <Grid container size={{ xs: 2, md: 4 }}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
            <Typography mb={1} style={{ fontWeight: 600, fontSize: isTablet ? '18px' : '32px', lineHeight: '40px', color: '#1C5087', textAlign: isTablet ? 'center' : 'left' }}>
              Congratulations! {first_name}
            </Typography>
            <Typography style={{ fontWeight: 300, fontSize: isTablet ? '13px' : '16px', lineHeight: '20px', textAlign: isTablet ? 'center' : 'left' }}>
              {"You've just been enrolled in a new program medtigo has launched."}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, alignItems: 'center', order: { xs: 1, md: 2 } }}>
            <img src="/images/medtigoOrange/medtigo_orange_tile.svg" alt="Medtigo Orange" loading="lazy" style={{ maxWidth: '100%', height: 'auto' }} />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );

  const Section = ({ title, children }) => (
    <>
      {!isTablet && <DividerText text={title} />}
      <Grid container size={{ xs: 2, md: 5 }} my={2} alignItems="stretch" justifyContent="center">
        {children}
      </Grid>
    </>
  );

  const BenefitsSection = () => (
    <Section title="Your Benefits">
      {benefits.map((item, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.title}>
          <Box sx={{ py: { xs: 2, md: 4 }, px: 6, mb: 2, textAlign: 'center', height: '100%' }}>
            <Box
              component="img"
              src={`/images/medtigoOrange/${index + 1}.svg`}
              alt="Specialty Icon"
              loading="lazy" // Lazy load this image
              sx={{
                height: index === 5 ? '110px' : index === 2 ? '90px' : '100px',
                cursor: 'pointer',
                '&:hover': {
                  content: `url(/images/medtigoOrange/gif/${index + 1}.gif)`,
                }
              }}
            />
            <Typography align="center" style={{ fontSize: '20px', fontWeight: 600 }}>
              {item.title}
            </Typography>
            <Typography mb={0.5} mt={ index === 5 ? 0 : index === 2 ? 1 : 0.5 } px={{ sm: 3, md: 5}} align="center" style={{ fontSize: '16px', fontWeight: 300 }}>
              {item.text}
            </Typography>
            <Link href={item.link} target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer', color: '#2872C1', fontSize: '20px', fontWeight: 600 }}>
              {item.linkText}
            </Link>
          </Box>
        </Grid>
      ))}
    </Section>
  );

  const AboutUsSection = () => (
    <Grid container justifyContent="center" alignItems="center" sx={{ py: { md: 2, lg: 4 }, width: '100vw' }}>
      <Box sx={boxStyles}>
        {!isTablet && <DividerText text="About This Program" />}
        <Grid container spacing={isTablet ? 0 : 4} mt={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography mb={1} style={{ fontWeight: 300, fontSize: isTablet ? '13px' : '18px', textAlign: isTablet ? 'center' : 'left', lineHeight: '36px', color: '#102048' }}>
              {aboutInfo.description}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, alignItems: 'center' }}>
            <img src="/images/medtigoOrange/about.svg" alt="Medtigo Orange" loading="lazy" style={{ maxWidth: '100%', height: 'auto' }} />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );

  const ContactSection = () => (
    <>
      <Typography my={{ xs: 2, sm: 4 }} px={{ xs: 2, sm: 3 }} align="center" style={{ fontWeight: 500, lineHeight: '40px', fontSize: isTablet ? '18px' : '30px' }}>
        If you have any questions, contact:
      </Typography>
      <Grid container justifyContent="center" alignItems="center" sx={{ py: 4, mb: 6, width: '100vw', background: '#F6F6F6' }}>
        <Box sx={{ ...boxStyles, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <img src="/images/medtigoOrange/caroline.svg" alt="Medtigo Orange" loading="lazy" style={{ maxWidth: '141px' }} />
          <Box style={{ fontSize: isTablet ? '13px' : '20px' }}>
            <div style={{ fontWeight: 600, lineHeight: '30px' }}>Caroline Mascarenhas</div>
            <div style={{ fontWeight: 500, lineHeight: '30px' }}>medtigo Services</div>
            <a href={`mailto:cmascarenhas@medtigo.com`} aria-label="mail" style={{ fontWeight: 500, lineHeight: '30px', textDecoration: 'underline', color: '#2872C1' }}>
              cmascarenhas@medtigo.com
            </a>
            <div style={{ fontWeight: 300, lineHeight: '30px' }}>phone: <strong>508-310-4810</strong></div>
          </Box>
        </Box>
      </Grid>
    </>
  );

  return (
    <>
      <HeroContainer />
      {isTablet && <DividerText text="Your Benefits" />}
      <ContentBox>
        <BenefitsSection />
      </ContentBox>
      {isTablet && <DividerText text="About This Program" />}
      <AboutUsSection />
      <ContactSection />
    </>
  );
};

export default MedtigoOrangePage;
