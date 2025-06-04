import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { PrimaryTabPanel } from 'src/ui/Tabs';
import { SERVER_URL } from 'src/settings';
import { useLocation } from 'react-router-dom';
import { updateProfile } from 'src/actions/accountActions';
import MyOrders from './MyOrders';
import Security from './Security';
import ActiveInactive from './General/ActiveInactive';
import GeneralSettings from './General/GeneralSettings';
import ProfileDetails from './General/ProfileDetails';

const EditIcon = '/icons/settings/editIcon.svg';
const lineBreak = '/icons/settings/lineBreak.svg';
const mailIcon = '/icons/settings/MailIcon.svg';
const SchoolIcon = '/icons/settings/SchoolIcon.svg';
const CallIcon = '/icons/settings/CallIcon.svg';

const tabs = [
  { value: 'institutions', label: 'MY INSTITUTIONS' },
  { value: 'security', label: 'SECURITY' },
  { value: 'orders', label: 'MY ORDERS' }
];

function AccountView() {
  const location = useLocation();
  const { state } = location;
  const { user } = useSelector(state => state.account);
  const [currentTab, setCurrentTab] = useState(
    state?.activeTab || 'institutions'
  );
  const [profilePicture, setProfilePicture] = React.useState(
    user['profilePicture'] && user['profilePicture'] !== 'no-photo.jpg'
      ? user['profilePicture'].includes('files')
        ? SERVER_URL + user['profilePicture']
        : user['profilePicture']
      : '/icons/settings/profile.png'
  );
  const [userData, setUserData] = useState(user);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (state?.activeTab) {
      setCurrentTab(state.activeTab);
    }
  }, [state]);

  useEffect(() => {
    if (user.profilePicture) {
      setProfilePicture(
        user.profilePicture.includes('files')
          ? SERVER_URL + user.profilePicture
          : user.profilePicture
      );
    }
  }, [user]);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const handleTabsChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleProfilePictureUpdate = newPicture => {
    dispatch(updateProfile(newPicture));
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <Box
        sx={{
          maxWidth: '998px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: { xs: 1, sm: 2 }
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: { xs: '20px', sm: '24px' },
            fontWeight: 400,
            letterSpacing: '0.04em',
            mb: 2,
            maxWidth: '996px',
            width: '100%'
          }}
        >
          Settings
        </Typography>

        <Box
          sx={{
            p: 2,
            mb: 2,
            width: '100%',
            maxWidth: '996px',
            backgroundColor: '#FFFFFF',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'flex-start',
            border: '1px solid #DCDEE0',
            flexWrap: 'wrap'
          }}
        >
          <ProfileDetails
            user={userData}
            onProfilePictureUpdate={handleProfilePictureUpdate}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                  flexWrap: 'wrap'
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#102048',
                    mr: { xs: 0, sm: 1 }
                  }}
                >
                  {`${userData.first_name} ${userData.last_name}`}
                </Typography>
                <ActiveInactive user={userData} />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: '#2872C1'
                }}
                onClick={handleOpen}
              >
                <img src={EditIcon} alt="Edit" />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1,
                flexWrap: 'wrap'
              }}
            >
              <img src={SchoolIcon} alt="icon" style={{ marginRight: '8px' }} />
              <Typography
                sx={{
                  fontSize: { xs: '11px', sm: '14px' },
                  color: '#102048',
                  fontWeight: 500
                }}
              >
                {userData.designation_name}
              </Typography>
              {user.country === 'United States' &&
                [
                  'Dentist',
                  'Nurse Practitioner',
                  'Physician Assistant',
                  'Doctor',
                  'Anesthesia Assistant'
                ].includes(user.designation_name) && (
                  <>
                    <img
                      src={lineBreak}
                      alt="icon"
                      style={{ margin: '0 8px' }}
                    />
                    <Typography
                      sx={{
                        fontSize: { xs: '11px', sm: '14px' },
                        color: '#102048',
                        fontWeight: 500
                      }}
                    >
                      <span>NPI:</span> {userData.npi_number || 'N/A'}
                    </Typography>
                  </>
                )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <img src={mailIcon} alt="icon" style={{ marginRight: '8px' }} />
              <Typography
                sx={{
                  fontSize: { xs: '11px', sm: '14px' },
                  color: '#102048',
                  fontWeight: 500
                }}
              >
                {userData.email}
              </Typography>
              <img src={lineBreak} alt="icon" style={{ margin: '0 8px' }} />
              <img src={CallIcon} alt="icon" style={{ marginRight: '8px' }} />
              <Typography
                sx={{
                  fontSize: { xs: '11px', sm: '14px' },
                  color: '#102048',
                  fontWeight: 500
                }}
              >
                {userData.phoneNumber || 'N/A'}
              </Typography>
            </Box>
          </Box>
          <GeneralSettings
            user={user}
            setUser={setUserData}
            open={open}
            handleClose={handleClose}
          />
        </Box>

        <Box style={{ width: '100%' }}>
          <PrimaryTabPanel
            tabs={tabs}
            currentTab={currentTab}
            handleTabsChange={handleTabsChange}
          />
        </Box>

        {currentTab === 'institutions' && (
          <Box
            sx={{
              width: '100%',
              height: '45vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F8F8F8',
              fontSize: '16px',
              mt: 2
            }}
          >
            Currently, there are no institutions added.
          </Box>
        )}
        {currentTab === 'security' && <Security />}
        {currentTab === 'orders' && <MyOrders />}
      </Box>
    </Box>
  );
}

export default AccountView;
