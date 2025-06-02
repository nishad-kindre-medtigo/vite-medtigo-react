import React, { useCallback, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { IconButton, Box, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

export const useOpenSnackbar = () => {
  const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const COLORS = useMemo(() => ({
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main,
    warning: theme.palette.warning.main
  }), [theme.palette]);

  const ICONS = useMemo(() => ({
    success: CheckCircleIcon,
    error: ErrorIcon,
    warning: WarningAmberIcon,
    info: InfoIcon
  }), []);

  const openSnackbar = useCallback((
    text,
    variant = 'success',
    duration = 3000,
    horizontal = 'left',
    vertical = 'bottom'
  ) => {
    const barColor = COLORS[variant] || COLORS.success;
    const IconComponent = ICONS[variant] || ICONS.success;

    enqueueSnackbar(text, {
      variant,
      anchorOrigin: { horizontal, vertical },
      autoHideDuration: duration,
      content: (key) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${barColor}`,
            borderLeftWidth: '8px',
            color: barColor,
            gap: '10px',
            maxWidth: '450px'
          }}
        >
          <IconComponent sx={{ color: barColor }} />
          <Box sx={{ flexGrow: 1 }}>{text}</Box>
          <IconButton size="small" onClick={() => closeSnackbar(key)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    });
  }, [COLORS, ICONS, closeSnackbar, enqueueSnackbar]);

  return openSnackbar;
};