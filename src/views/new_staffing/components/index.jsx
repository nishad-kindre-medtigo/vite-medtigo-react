import React from 'react';
import { Typography, Link, Button, InputLabel, TextField, Box, Grid, Skeleton, styled } from '@mui/material';

export const boxStyles = {
  width: '100%',
  maxWidth: '1440px',
  px: { xs: 2, md: 4, lg: 5 }
};

export const ContentBox = ({ children, sx = {}, ...props }) => {
  return (
    <Box
      sx={{
        margin: '0 auto',
        ...boxStyles,
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 500,
  marginBottom: '4px',
  color: '#000',
  '&::after': {
    content: '"*"',
    color: theme.palette.error.main
  }
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#2872C1',
  fontSize: '16px'
}));

export const OutlinedButton = styled(Button)(({ theme }) => ({
  borderColor: '#2872C1',
  background: 'none',
  color: '#2872C1',
  fontSize: '16px'
}));

export const ApplyButton = styled(Button)(({ disabledbutton }) => ({
  backgroundColor: disabledbutton ? '#5EAB43' : '#2872C1',
  color: '#fff',
  '&:hover': {
    backgroundColor: disabledbutton ? '#5EAB43' : '#2872C1'
  }
}));

export const LearnMoreButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#2872C1',
  fontSize: '16px',
  fontWeight: 500,
  letterSpacing: '3%',
  borderRadius: '6px',
  height: '40px',
  width: '146px'
}));

export const CustomTextfield = styled(TextField)(() => ({
  '& .MuiInputBase-root': {
    borderBottom: 'none !important'
  }
}));

export const SearchField = styled(TextField)(() => ({
  borderColor: '#AAAAAA',
  '& .MuiInputBase-root': {
    borderBottom: 'none !important',
    borderRadius: '6px',
    height: '50px !important',
    fontSize: '16px',
    fontWeight: 400
  }
}));

// Visually hidden input component
export const VisuallyHiddenInput = styled('input')({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  border: '0'
});

export const ContactInfoBox = ({ icon, title, link, linkText }) => (
  <Box
    sx={{
      p: 2,
      pb: 4,
      borderRadius: 1,
      boxShadow: '0px 3px 7px -3px #0000004D',
      border: '1px solid #EBEBEB',
      display: 'flex',
      gap: 2,
      alignItems: 'flex-start'
    }}
  >
    <Box component="img" src={icon} alt={title} mt={'4px'} />
    <Box>
      <Typography
        mb={1}
        style={{
          fontSize: '18px',
          fontWeight: 500,
          color: '#2872C1',
          lineHeight: '27px'
        }}
      >
        {title}
      </Typography>
      <Link
        href={link}
        style={{
          textDecoration: 'underline',
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '27px',
          color: '#4C4B4B'
        }}
      >
        {linkText}
      </Link>
    </Box>
  </Box>
);

export const JobCardSkeleton = () => {
  return (
    <Grid container spacing={2}>
      {Array.from(new Array(7)).map((_, index) => (
        <Grid size={12} key={index}>
          <Box
            sx={{
              p: 2,
              border: '1px solid #DADADA',
              borderRadius: '4px',
              boxShadow: '0px 8px 24px 0px #959DA533'
            }}
          >
            <Skeleton variant="text" width="40%" height={30} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="60%" height={30} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
