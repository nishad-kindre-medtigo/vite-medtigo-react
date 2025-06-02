import React from 'react';
import { Box, Button, Divider, IconButton, Typography, Stepper, StepConnector, Skeleton, MenuItem } from '@mui/material';
import BackArrow from '@mui/icons-material/ArrowBackIosRounded';
import { styled } from '@mui/material/styles';
import { Message } from '@mui/icons-material';
import useBreakpoints from '../../../../hooks/useBreakpoints';
import { convertMarkdownLinksToHtml } from '../utils';

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`& .MuiStepConnector-line`]: {
    height: "2px",
    border: 0,
    backgroundColor: theme.palette.grey[400],
  },
  [`&.Mui-active .MuiStepConnector-line`]: {
    backgroundColor: '#2872C1',
  },
  [`&.Mui-completed .MuiStepConnector-line`]: {
    backgroundColor: '#008000',
  },
}));

const StyledBox = styled(Box)({
  gap: "12px",
  border: '1px solid #DFDFDF',
  borderRadius: '2px',
  boxShadow: '0px 4px 6px -1px #efefef',
  transition: 'all 0.3s ease', // Smooth transition for shadow
  height: '100%',
  '&:hover': {
    boxShadow: '0px 4px 6px -1px #ccc' // Slightly darker shadow
  }
});

export const StyledLink = styled(Typography)({
  fontSize: '16px',
  fontWeight: 600,
  color: '#2872C1',
  cursor: 'pointer',
  textDecoration: 'underline',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#65afff',
  },
});

const StyledMenuItem = styled(MenuItem)({
  width: 200,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px'
});

export const PageLink = ({ image, title, onClick }) => (
  <StyledMenuItem onClick={onClick}>
    {image && <img src={image} alt={title} style={{ width: 20, height: 20 }} />}
    <Typography style={{ fontSize: '16px', fontWeight: 500, color: '##3A3A3A' }}>{title}</Typography>
  </StyledMenuItem>
);

export const PageBackText = ({ goBack, text }) => {
  return (
    <Box
      component="span"
      style={{
        fontSize: '20px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'inline-flex',
        gap: "4px"
      }}
      onClick={goBack}
    >
      <BackArrow sx={{ fontSize: '20px', fontWeight: 'bold', mt: 0.5 }} />
      {text}
    </Box>
  );
};

export const CountBox = ({ type, count, isActive, onClick }) => {
  const { isTablet } = useBreakpoints();

  return (
    <StyledBox
      sx={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        p: 1,
        borderColor: isActive
          ? type === 'Overdue'
            ? '#C04149'
            : '#008000'
          : '#DFDFDF'
      }}
      onClick={onClick}
    >
      <img
        src={
          type === 'Overdue'
            ? '/icons/licensing/overdue_icon.svg'
            : '/icons/licensing/timely_icon.svg'
        }
        alt="Task Count"
        width={20}
      />
      <span
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: type === 'Overdue' ? '#C04149' : '#008000'
        }}
      >
        {type}
        {!isTablet && ' Tasks'} : {count || 0}
      </span>
    </StyledBox>
  );
};

export const TaskCard = ({ children, isURLTask }) => {
  return (
    <StyledBox
      sx={{
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
        height: '100%',
        borderColor: isURLTask ? '#2872c1' : '#DFDFDF',
        borderWidth: isURLTask ? '2px' : '1px',
        boxShadow: isURLTask
          ? '0px 8px 12px -2px #0000004f'
          : '0px 4px 6px -1px #efefef',
      }}
    >
      {children}
    </StyledBox>
  );
};

export const StepperCard = ({ children }) => {
  return (
    <StyledBox
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        flexWrap: 'wrap',
        gap: 1,
        height: '100%',
        transition: 'all 0.3s ease', // Smooth transition for shadow
        '&:hover': {
          boxShadow: '0px 3px 12.6px 0px #00000047' // Slightly darker shadow
        }
      }}
    >
      {children}
    </StyledBox>
  );
};

export const StyledStepper = ({ activeStep, children }) => {
  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      connector={<CustomConnector />}
      sx={{
        '& .MuiStepIcon-root.Mui-active': { color: '#2872C1' },
        '& .MuiStepIcon-root.Mui-completed': { color: '#008000' },
        '& .MuiStepIcon-root.Mui-disabled': { color: '#808080' },
        '& .MuiStepLabel-label.Mui-active': { color: '#2872C1' },
        '& .MuiStepLabel-label.Mui-completed': { color: '#008000' },
        '& .MuiStepIcon-text': { fontWeight: 500 },
        '& .MuiStepper-root': { padding: 0 },
        '& .MuiStepLabel-label': { fontSize: '12px', fontWeight: 400 },
        padding: '14px 0px',
        my: 1,
        maxWidth: '100%',
        textAlign: 'center',
        backgroundColor: '#F8F8F8',
        flexGrow: 1,
        borderRadius: '1px',
        overflow: 'auto',
      }}
    >
      {children}
    </Stepper>
  );
};

export const TaskType = ({
  type,
  taskType,
  handleMemoClick,
  noChat = false
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}
    >
      <Box
        sx={{
          backgroundColor:
            type === 'Overdue'
              ? '#D35338'
              : type === 'Updates'
              ? '#2872C1'
              : '#44AE20',
          borderRadius: '3px',
          color: '#fff',
          padding: '4px 16px'
        }}
      >
        {taskType}
      </Box>
      {!noChat && (
        <IconButton onClick={handleMemoClick}>
          <Message />
        </IconButton>
      )}
    </Box>
  );
};

export const TaskDivider = () => {
  return (
    <Divider
      style={{
        margin: '4px -12px'
      }}
    />
  );
};

export const TaskSubmittedText = ({ taskType }) => {
  const submissionText =
  taskType === 'Fees Requested'
    ? 'It may take one business day to verify the payment.'
    : taskType === 'Signature Requested'
    ? 'It may take one business day to verify the signature.'
    : 'Submitted for review';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}
    >
      <img
        src="/icons/licensing/rightArrow.png"
        alt="Submission Icon"
        width={20}
        height={20}
      />
      <Typography
        style={{
          color: '#DF5338',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        {submissionText}
      </Typography>
    </Box>
  );
};

export const PrimaryButton = ({
  disabled = false,
  onClick = () => {},
  children
}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      disableElevation
      style={{ opacity: disabled && 0.5 }}
      onClick={onClick}
      sx={{ borderRadius: '4px', height: '32px', minWidth: '96px' }}
    >
      {children}
    </Button>
  );
};

export const OutlinedButton = ({
  disabled = false,
  onClick = () => {},
  children
}) => {
  return (
    <Button
      variant="outlined"
      color="primary"
      size="small"
      disabled={disabled}
      onClick={onClick}
      sx={{ borderRadius: '4px', height: '32px', minWidth: '96px' }}
    >
      {children}
    </Button>
  );
};

export const TaskActionBox = ({ children }) => {
  return (
    <Box
      sx={{
        pt: 1,
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        gap: 2
      }}
    >
      {children}
    </Box>
  );
};

export const TaskNoteMarkdown = ({ truncatedNote, handleViewMore }) => {
  const htmlContent = convertMarkdownLinksToHtml(truncatedNote);

  return (
    <Box
      sx={{
        fontSize: '14px',
        display: 'flex',
        gap: '8px',
        maxWidth: '100%',
        alignItems: 'center'
      }}
    >
      <span style={{ fontWeight: 600 }}>Note: </span>
      <span
        style={{
          maxWidth: '80%',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <span
        style={{
          fontWeight: 400,
          color: '#2872C1',
          cursor: 'pointer',
          textDecoration: 'none'
        }}
        onClick={handleViewMore}
      >
        View
      </span>
    </Box>
  );
};

export const LicenseTaskCount = ({ overdueTasksCount, timelyTasksCount }) => {
  return (
    <div style={{ fontSize: '14px', fontWeight: 400 }}>
      <span style={{ color: '#C04149', marginRight: '16px' }}>
        Overdue : {overdueTasksCount}
      </span>
      <span style={{ color: '#008000' }}>Timely : {timelyTasksCount}</span>
    </div>
  );
};

export const SupportCard = ({children, props}) => {
  return (
    <Box
      sx={{
        height: '100%',
        border: '1px solid #DFDFDF',
        boxShadow: '0px 4px 6px -1px #efefef',
        transition: 'all 0.3s ease', // Smooth transition for shadow
        '&:hover': {
          boxShadow: '0px 4px 6px -1px #ccc' // Slightly darker shadow
        },
        borderRadius: '2px',
        p: 2
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

export const StepperSkeleton = () => {
  return (
    <StepperCard>
      <Skeleton
        variant="rounded"
        animation="wave"
        width="40%"
        height={24}
        sx={{ background: '#F8F8F8' }}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        width="50%"
        height={22}
        sx={{ background: '#F8F8F8' }}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        width="100%"
        height={102}
        sx={{ background: '#F8F8F8' }}
      />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Skeleton
          variant="rounded"
          animation="wave"
          width="25%"
          height={24}
          sx={{ background: '#F8F8F8' }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          width="40%"
          height={24}
          sx={{ background: '#F8F8F8' }}
        />
      </Box>
    </StepperCard>
  );
};

export const TaskSkeleton = ({ showLicenseName = true }) => {
  return (
    <TaskCard>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          my: 0.5
        }}
      >
        {showLicenseName && (
          <Skeleton
            variant="rounded"
            animation="wave"
            width="45%"
            height={32}
            sx={{ background: '#F8F8F8' }}
          />
        )}
        <Skeleton
          variant="circular"
          animation="wave"
          height={32}
          width={32}
          sx={{ background: '#F8F8F8' }}
        />
      </Box>
      <TaskDivider />
      <Skeleton
        variant="rounded"
        animation="wave"
        width="50%"
        height={22}
        sx={{ background: '#F8F8F8' }}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        width="50%"
        height={22}
        sx={{ background: '#F8F8F8' }}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        width="100%"
        height={22}
        sx={{ background: '#F8F8F8' }}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        width="50%"
        height={22}
        sx={{ background: '#F8F8F8' }}
      />
      <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
        <Skeleton
          variant="rounded"
          animation="wave"
          width="25%"
          height={36}
          sx={{ background: '#F8F8F8' }}
        />
      </Box>
    </TaskCard>
  );
};
