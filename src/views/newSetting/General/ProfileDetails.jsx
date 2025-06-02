import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box } from '@mui/material';
import { SERVER_URL } from "../../../settings";

const EditIcon = "/icons/settings/editIcon.svg"

function ProfileDetails({ user, onProfilePictureUpdate }) {
  const [profilePicture, setProfilePicture] = useState(getInitialProfilePicture(user));
  const fileInputRef = useRef(null);

  useEffect(() => {
    setProfilePicture(getInitialProfilePicture(user));
  }, [user]);

  function getInitialProfilePicture(user) {
    if (user.profilePicture && user.profilePicture !== 'no-photo.jpg') {
      return user.profilePicture.includes('files') ? SERVER_URL + user.profilePicture : user.profilePicture;
    }
    return '/icons/settings/profile.png';
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => setProfilePicture(e.target.result);
      reader.readAsDataURL(file);

      // Update profile picture along with user data (name, email)
      await onProfilePictureUpdate({
        file,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {/* Profile Picture */}
      <Avatar
        src={profilePicture}
        sx={{
          width: { xs: 50, sm: 80 },
          height: { xs: 50, sm: 80 },
          marginRight: { xs: '10px', sm: '20px' },
        }}
      />
      
      {/* Edit Button */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: { xs: 6, sm: 18 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: 20, sm: 24 },
          height: { xs: 20, sm: 24 },
          backgroundColor: 'white',
          borderRadius: '2px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
        }}
        onClick={() => fileInputRef.current.click()}
      >
        <Box
          component="img"
          src={EditIcon}
          alt="Edit"
          sx={{
            width: { xs: 12, sm: 16 },
            height: { xs: 12, sm: 16 },
          }}
        />
      </Box>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
}

ProfileDetails.propTypes = {
  user: PropTypes.object.isRequired,
  onProfilePictureUpdate: PropTypes.func.isRequired,
};

export default ProfileDetails;
