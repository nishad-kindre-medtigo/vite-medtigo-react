import { useMediaQuery, useTheme } from '@mui/material';

const useBreakpoints = () => {
  const theme = useTheme();

  const isSmallMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return { isSmallMobile, isMobile, isTablet, isDesktop, isLargeDesktop };
};

export default useBreakpoints;
