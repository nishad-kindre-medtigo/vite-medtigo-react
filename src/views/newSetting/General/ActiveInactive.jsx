import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Popover } from '@mui/material';
import Inactive from './DeleteModal';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function ActiveInactive({ user }) {
  const [active, setActive] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInactivate = () => {
    setActive(false);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div style={{ display: 'flex' }}>
      <div>
        {active ? (
          <div
            onClick={handleClick}
            style={{
              backgroundColor: '#A5EEA5',
              padding: '3px 8px',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              color: '#102048',
              font: 'Poppins',
              // width:'78px',
              fontWeight: '500',
              fontSize: '12px',
              gap: '3'
            }}
          >
            Active
            <KeyboardArrowDownIcon
              style={{
                color: '#102048',
                fontWeight: '400',
                fontSize: 'medium'
              }}
            />
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#DF5338',
              padding: '2px 9px',
              borderRadius: '2px',
              color: 'white',
              font: 'Poppins'
              // border: '1px solid #C8C8C8',
            }}
          >
            Inactive
          </div>
        )}
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        style={{ marginTop: '8px' }}
      >
        <div
          style={{
            padding: '2px 12px',
            color: '#102048',
            border: '1px solid #C8C8C8',
            background: '#ffffff',
            fontFamily: 'Poppins',
            cursor: 'pointer',
            width: '78px',
            fontWeight: '600',
            fontSize: '12px',
            overflow: 'hidden'
            // borderColor:'#C8C8C8'
          }}
          onClick={() => setOpenDeleteModal(true)}
        >
          Inactive
        </div>
      </Popover>
      <Inactive
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        user={user}
        onInactivate={handleInactivate}
      />
      {!active && (
        <div style={{ display: 'flex', gap: '5px' }}>
          <InfoOutlinedIcon
            style={{ fontSize: '25px', color: '#DF5338', marginLeft: '10px' }}
          />
          <div style={{ fontSize: '12px' }}>
            To reactivate your account, please send an <br />
            email to:{' '}
            <a
              href="mailto:support@medtigo.com"
              style={{ color: '#2872C1', textDecoration: 'none' }}
            >
              <span style={{ color: '#2872C1', textDecoration: 'none' }}>
                support@medtigo.com
              </span>
            </a>
            .
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveInactive;
