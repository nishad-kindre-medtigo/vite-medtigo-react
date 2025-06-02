import React, { useEffect, useState, useContext } from 'react';
import { Box } from '@mui/material';
import CartIcon from '@mui/icons-material/ShoppingCartRounded';
import AdminFilledIcon from '@mui/icons-material/AdminPanelSettings';
import AdminOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import moment from 'moment';
import { StaffingContext } from '../../../context/StaffingContext';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useOpenSnackbar } from '../../../hooks/useOpenSnackbar';
import { useBlockNavigation } from '../../../hooks/useBlockNavigation';
import { logout } from '../../../actions/accountActions';
import { AUTH_URL, SERVER_URL, CONNECT_URL } from '../../../settings';
import { SearchBar } from './SearchBar';
import UserDetailsPopup from './UserDetailsPopup';
import axios from 'axios';
import useBreakpoints from '../../../hooks/useBreakpoints';
import { Root, ToolbarContainer, StyledToolbar, FlexGrow, Section, DividerStyled, StyledLink, DateText, StyledBadge, StyledMenu, MenuItemWithSeparator, TruncatedUserName } from './components';

const TopBar = () => {
  const { isTablet } = useBreakpoints();
  const { blockNavigationWhenActiveQuiz } = useBlockNavigation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.account);
  const openSnackbar = useOpenSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState('/icons/header/account.svg');
  const { showAdminView, toggleAdminView } = useContext(StaffingContext);

  const wpToken = user['wp_token'];

  let username = user['email'].split('@')[0];
  username = username.charAt(0).toUpperCase() + username.slice(1);

  const displayName = user['first_name']
  ? `${user['first_name']} ${user['last_name']}`
  : username;

  // FETCH COUNT OF PRODUCTS IN METIGO CART FOR USER 
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const email = user.email;
        const response = await axios.get(
          `https://medtigo.store/wp-json/user_cart_info/v2/cart/?email=${email}&request_mood=root`
        );
        const data = response.data;

        if (data.user_data_have) {
          setCartCount(data.number_of_item_in_cart);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        setCartCount(0);
      }
    };

    if (user.email) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [user.email]);

  // SET THE PROFILE PICTURE OF USER IN HEADER
  useEffect(() => {
    if (user.profilePicture) {
      const pictureUrl = user.profilePicture.includes('http')
        ? user.profilePicture
        : `${SERVER_URL}${user.profilePicture}`;
      const isPlaceholder =
        pictureUrl === `${CONNECT_URL}/no-photo.jpg`;
      setProfilePicture(
        isPlaceholder ? '/icons/header/account.svg' : pictureUrl
      );
    }
  }, [user]);

  const showUserMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const closeUserMenu = () => {
    setAnchorEl(null);
  };

  const switchView = () => {
    const confirm = blockNavigationWhenActiveQuiz();
    if(confirm){
      toggleAdminView();
    }
  };

  const goToNotificationCenter = () => {
    const confirm = blockNavigationWhenActiveQuiz();
    if(confirm){
      navigate('/state-licensing');
    }
  }

  // METHODS TO REDIRECT TO PAGES FROM USER MENU
  const goToProfileSettings = () => {
    const confirm = blockNavigationWhenActiveQuiz();
    if(confirm){
      navigate('/setting');
      setAnchorEl(null);
    }
  };

  const goToNewsletter = () => {
    const confirm = blockNavigationWhenActiveQuiz();
    if(confirm){
      window.location.href = `https://medtigo.com/newsletter-edit/?t=${user.wp_token}`;
      setAnchorEl(null);
    }
  };

  const goToMyOrders = () => {
    const confirm = blockNavigationWhenActiveQuiz();
    if(confirm){
      navigate('/setting', { activeTab: 'orders' });
      setAnchorEl(null);
    }
  };

  const goToMedtigoOrange = () => {
    const confirm = blockNavigationWhenActiveQuiz();
    if(confirm){
      navigate('/medtigo-orange');
      setAnchorEl(null);
    }
  };
  
  const goToCart = () => {
    const confirm = blockNavigationWhenActiveQuiz();
    if(confirm){
      window.location.href = `https://medtigo.store/cart?t=${wpToken}`;
    }
  };

  const handleLogout = async () => {
    const confirm = blockNavigationWhenActiveQuiz();
    if(confirm){
      try {
        await dispatch(logout());
        localStorage.clear();
        window.location.href = `${AUTH_URL}?path=logout&route=/`;
      } catch {
        openSnackbar('Unable to logout', 'error');
      }
      setAnchorEl(null);
    }
  };

  // MENU COMPONENT
  const UserMenu = () => {
    return (
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeUserMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItemWithSeparator
          icon={<img src="/icons/header/useraccount.svg" alt="user account" />}
          text={<TruncatedUserName userName={displayName} />}
          onClick={goToProfileSettings}
        />
        {isTablet && (user.role === 'admin' || user.role === 'hospital_admin' || user.role === 'department_admin') && (
          <MenuItemWithSeparator
            icon={
              showAdminView ? <AdminOutlinedIcon sx={{ color: '#1C5087' }}/> : <AdminFilledIcon sx={{ color: '#1C5087' }}/>
            }
            text={
              <Box component="span" sx={{ color: '#1C5087' }}>
                {showAdminView ? 'User' : 'Admin'} View
              </Box>
            }
            onClick={switchView}
          />
        )}
        {user.isMedtigoOrange && (
          <MenuItemWithSeparator
            icon={
              <img
                src="/images/medtigoOrange/crown.svg"
                alt="medtigo Orange"
              />
            }
            text="Medtigo Orange"
            onClick={goToMedtigoOrange}
          />
        )}
        <MenuItemWithSeparator
          icon={<img src="/icons/header/mailicon.svg" alt="mail" />}
          text="Newsletter"
          onClick={goToNewsletter}
        />
        <MenuItemWithSeparator
          icon={
            <img src="/icons/header/profileSetting.svg" alt="profileSetting" />
          }
          text="Profile Settings"
          onClick={goToProfileSettings}
        />
        <MenuItemWithSeparator
          icon={<img src="/icons/header/myorders.svg" alt="orders" />}
          text="My Orders"
          onClick={goToMyOrders}
        />
        <MenuItemWithSeparator
          icon={<img src="/icons/header/logout.svg" alt="logout" />}
          text="Log Out"
          onClick={handleLogout}
          showseparator={false}
        />
      </StyledMenu>
    );
  };

  return (
    <>
      <Root position="static" elevation={0}>
        <ToolbarContainer>
          <StyledToolbar>
            <Section>
              <DateText>{moment().format('MMMM D, YYYY')}</DateText>
              <DividerStyled />
              <StyledLink onClick={goToNotificationCenter}>
                <img
                  src="/icons/header/notifications.svg"
                  alt="Notifications"
                />
                {!isTablet && 'Notification Center'}
              </StyledLink>
              <DividerStyled />
              <Box
                component="a"
                href="tel:+413-419-0592"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <img src="/icons/header/phone.svg" alt="Phone" />
                {!isTablet && '413-419-0592'}
              </Box>
              <DividerStyled />
              <div onClick={() => setOpenSearchDialog(true)}>
                <img
                  src="/icons/header/search.svg"
                  alt="Search"
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </Section>
            <FlexGrow />
            <Section>
              <Box sx={{ display: 'flex', gap: 1, cursor: 'pointer' }} onClick={goToCart}>
                {!isTablet && 'Cart'}
                <StyledBadge
                  badgeContent={cartCount || 0}
                  showZero
                >
                  <CartIcon fontSize="small" />
                </StyledBadge>
              </Box>
              <DividerStyled />
              <Box
                sx={{ display: 'flex', gap: 1, cursor: 'pointer' }}
                onClick={showUserMenu}
              >
                {!isTablet && <TruncatedUserName maxWidth='130px' userName={displayName} />}
                <div
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '27px',
                    height: '27px'
                  }}
                >
                  <img
                    src={profilePicture}
                    alt="User"
                    style={{ borderRadius: '50%', width: '27px', height: '27px' }}
                  />
                  {/* Crown only for medtigo Orange Users */}
                  {user.isMedtigoOrange && (
                    <img
                      src="/images/medtigoOrange/crown.svg"
                      alt="Crown"
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '85%',
                        transform: 'translateX(-50%) rotate(30deg)',
                        width: '16px'
                      }}
                    />
                  )}
                </div>
              </Box>
              <UserMenu />
            </Section>
          </StyledToolbar>
        </ToolbarContainer>
      </Root>

      <UserDetailsPopup />
      <SearchBar
        openSearchDialog={openSearchDialog}
        setOpenSearchDialog={setOpenSearchDialog}
      />
    </>
  );
}

export default TopBar;