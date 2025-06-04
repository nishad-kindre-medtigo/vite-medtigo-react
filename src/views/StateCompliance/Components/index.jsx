import React, { useState } from "react";
import { IconButton, styled, Tooltip, tooltipClasses } from "@mui/material";
import useBreakpoints from "src/hooks/useBreakpoints";
import ErrorIcon from '@mui/icons-material/Error';

export const ClickableTooltip = ({ title, placement, Icon, customIcon }) => {
  const { isMobile } = useBreakpoints();
  const [open, setOpen] = useState(false);

  // Handle opening the tooltip on click for mobile
  const handleMobileToggle = () => {
    setOpen((prev) => !prev); // Toggle the state on click for mobile
  };

  // Handle opening and closing the tooltip on hover for desktop
  const handleDesktopOpen = () => {
    if (!isMobile) setOpen(true); // Open the tooltip on hover (desktop)
  };

  const handleDesktopClose = () => {
    if (!isMobile) setOpen(false); // Close the tooltip on mouse leave (desktop)
  };

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => !isMobile && setOpen(true)}
      {...props}
      placement={placement || (isMobile ? "bottom" : "right")}
      slotProps={{ popper: { sx: { margin: '0px' } } }}
      classes={{ popper: className }}
    />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 500,
      backgroundColor: '#4C4B4B',
      color: 'white',
      width: '600px',
      boxShadow: theme.shadows[1],
      padding: '12px',
      fontSize: 11,
    },
  }));

  return (
    <LightTooltip title={title} arrow style={{ background: 'transparent' }}>
      <IconButton
        onClick={handleMobileToggle} // Toggle on click for mobile
        onMouseEnter={handleDesktopOpen} // Open on hover for desktop
        onMouseLeave={handleDesktopClose} // Close on mouse leave for desktop
      >
        {customIcon ? Icon : <ErrorIcon color="primary" />}
      </IconButton>
    </LightTooltip>
  );
};
