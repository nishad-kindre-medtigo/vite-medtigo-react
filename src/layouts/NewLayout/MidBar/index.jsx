import React, { useEffect, useState, useContext } from 'react';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import HeaderMenu from './HeaderMenu';
import Backdrop from './Backdrop';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { useBlockNavigation } from 'src/hooks/useBlockNavigation';
import { useSelector } from 'react-redux';
import { StaffingContext } from '../../../context/StaffingContext';

const StyledAppBar = styled(Box)({
  backgroundColor: '#fff',
  fontSize: '16px',
  marginBottom: '5px',
  boxShadow: '0px 4px 4px 0px #00000014',
});

const ToolbarContainer = styled(Box)({
  maxWidth: 1440,
  margin: '0 auto',
  width: '100%',
});

const StyledToolbar = ({ children, ...props }) => (
  <Box
    sx={{
      backgroundColor: '#fff',
      px: { xs: 2, sm: 4, md: 5 },
      py: { xs: 1, sm: 0 },
      display: 'flex',
      alignItems: 'center',
      fontWeight: 500,
    }}
    {...props}
  >
    {children}
  </Box>
);

const FlexGrow = styled(Box)({
  flexGrow: 1,
});

const LogoContainer = styled(Box)({
  display: 'flex',
  gap: '17px',
  '@media (max-width: 600px)': {
    gap: '10px',
  },
});

const StyledTabs = styled(Tabs)({
  display: 'flex',
  gap: '26px',
  alignItems: 'center',
  '& .MuiTabs-indicator': {
    backgroundColor: '#2872C1',
    height: '3px',
    bottom: 0,
  },
});

const StyledTab = styled(Tab)({
  color: '#000',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: '24px',
  height: '64px',
  minWidth: 'auto',
  paddingInline: 0,
  marginLeft: '20px',
  '&.Mui-selected': {
    color: '#2872C1',
  },
});

const MenuIcon = styled(MenuRoundedIcon)({
  color: '#2872C1',
  fontSize: 35,
});

const tabs = [
  { value: 'home', label: 'Home', link: 'https://staging17.medtigo.com/' },
  { value: 'news', label: 'News & Opinion', link: 'https://staging17.medtigo.com/news/' },
  { value: 'reference', label: 'Reference', link: 'https://staging17.medtigo.com/drugs/' },
  { value: 'journal', label: 'Journals', link: 'https://staging2.journal.medtigo.com/' },
  { value: 'education', label: 'Education', link: 'https://staging2.courses.medtigo.com/' },
  { value: 'services', label: 'Services', link: '/services' },
];

function MidBar() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('services');
  const [page, setPage] = useState('services');
  const { isMobile } = useBreakpoints();
  const { blockNavigationWhenActiveQuiz } = useBlockNavigation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [functionalTabs, setFunctionalTabs] = useState(tabs);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const { user } = useSelector(state => state.account);
  const { setShowAdminView } = useContext(StaffingContext);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabsChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleTabClick = (event, tab) => {
    event.preventDefault();

    // Check if the quiz is in progress
    const confirm = blockNavigationWhenActiveQuiz();
    if(!confirm){
      return
    }
  
    // Logic for handling non-services tabs
    if (tab.value !== 'services') {
      setPage(tab.label);
      setOpenBackdrop(true);
    }
  
    // Logic for handling 'services' tab
    if (tab.value === 'services') {
      setShowAdminView(false);
      navigate('/dashboard');
    } else {
      window.location.href = tab.link;
    }
  };

  const goToDashboard = () => {
    const confirm = blockNavigationWhenActiveQuiz();
    if (confirm) {
      navigate('/dashboard');
    }
  };

  const getCoursesToken = async () => {
    try {
      const newToken = await authService.generateToken();
      return newToken;
    } catch (error) {
      console.error('Error generating token:', error);
      return null;
    }
  };

  const handleLogoClick = async () => {
    const connectTokensForWordpress = await getCoursesToken();
    const courses_connect_token = connectTokensForWordpress ? "&t1=" + connectTokensForWordpress : '';

    // Check if the quiz is in progress
    const confirm = blockNavigationWhenActiveQuiz();
    if(!confirm){
      return
    }
    window.location.href = 'https://medtigo.com/?t=' + user.wp_token + courses_connect_token;
  };

  useEffect(() => {
    (async () => {
      const connectTokensForWordpress = await getCoursesToken();
      const courses_connect_token = connectTokensForWordpress ? "&t1=" + connectTokensForWordpress : '';
      setFunctionalTabs(...[functionalTabs.map(tab => {
          if(tab.value === 'services') return tab
          return {...tab, link: tab.link+'?t='+ user.wp_token + courses_connect_token}
        })])
    })()
  }, [])

  return (
    <StyledAppBar position="static" elevation={0}>
      <ToolbarContainer>
        <StyledToolbar>
          <LogoContainer>
            <img
              src="https://medtigo.com/wp-content/uploads/2024/05/medtigo_2-1.svg"
              alt="Logo"
              height="50px"
              width="168px"
              onClick={handleLogoClick}
              style={{ cursor: 'pointer' }}
            />
          </LogoContainer>
          <FlexGrow />
          {isMobile ? (
            <>
              <Typography
                onClick={goToDashboard}
                sx={{ color: 'black', fontSize: '16px', fontWeight: 600, paddingInline: '12px' }}
              >
                SERVICES
              </Typography>
              <MenuIcon onClick={handleClick} />
              <HeaderMenu
                tabs={functionalTabs}
                anchorEl={anchorEl}
                handleClose={handleClose}
                setOpenBackdrop={setOpenBackdrop}
              />
            </>
          ) : (
            <StyledTabs value={currentTab}>
              {functionalTabs.map(tab => (
                <StyledTab
                  key={tab.value}
                  value={tab.value}
                  label={tab.label}
                  href={tab.link}
                  onClick={event => handleTabClick(event, tab)}
                />
              ))}
            </StyledTabs>
          )}
        </StyledToolbar>
      </ToolbarContainer>
      <Backdrop page={page} open={openBackdrop} />
    </StyledAppBar>
  );
}

export default MidBar;
