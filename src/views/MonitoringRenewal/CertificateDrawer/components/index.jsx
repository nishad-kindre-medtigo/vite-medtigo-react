import * as React from 'react';
import { Box, Stack, Typography, FormControl, InputAdornment, TextField, Tooltip, Autocomplete, Button } from '@mui/material';
import { Paper, Avatar, IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDatePicker } from '@mui/x-date-pickers';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CalendarIcon from '@mui/icons-material/CalendarMonthTwoTone';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { CloudUpload, AttachFile, ErrorOutline, InsertDriveFile, PictureAsPdf, Image, Visibility } from '@mui/icons-material';
import { Loader } from '../../../../ui/Progress';
import { SERVER_URL } from '../../../../settings';

export const AddCategoryButton = ({ onClick }) => {
  return (
    <Button
      fullWidth
      onClick={onClick}
      color="inherit"
      startIcon={<AddBoxIcon />}
    >
      Add more categories
    </Button>
  );
};

export const FileUploadField = ({
  inputs,
  setInputs,
  setErrorMessage,
  handleInputChange,
  setIsSubmitted,
  activeCertificateData,
  isEdit
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [fileKey, setFileKey] = React.useState(Date.now()); // Unique key for the file input


  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    validateFile(file);
  };

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    const maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes

    // If no file is selected (Cancel button), do nothing
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Invalid file type. Please upload a PDF or image.');
      setInputs((prev) => ({ ...prev, file: null }));
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setErrorMessage('File size exceeds 10 MB. Please upload a smaller file.');
      setInputs((prev) => ({ ...prev, file: null }));
      return;
    }

    // If valid, clear the error and update the inputs
    setErrorMessage('');
    setIsSubmitted(false);
    handleInputChange({ target: { value: file } }, 'file', file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    validateFile(file);
  };

  const removeFile = (event) => {
    event.stopPropagation();
    setInputs({ ...inputs, file: undefined });
    setErrorMessage('');
    setFileKey(Date.now()); // Reset the file input by changing its key
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <AttachFile />;
    if (fileType.includes('pdf')) return <PictureAsPdf />;
    if (fileType.includes('image')) return <Image />;
    return <InsertDriveFile />;
  };

  const truncateFileName = (name, maxLength = 20) => {
    if (!name || name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const baseName = name.substring(0, name.length - extension.length - 1);
    return `${baseName.substring(0, maxLength - extension.length - 3)}...${extension}`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <input
        accept=".pdf,.png,.jpg,.jpeg"
        type="file"
        key={fileKey}
        onChange={handleFileChange}
        id="certificate_file"
        hidden
      />

      {/* Upload Zone */}
      <Paper
        elevation={0}
        sx={{
          my: 2,
          p: 1.5,
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'primary.light',
          borderRadius: 2,
          backgroundColor: isDragging
            ? 'rgba(0, 123, 255, 0.16)'
            : 'background.paper',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(0, 123, 255, 0.04)'
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() =>
          !inputs['file'] && document.getElementById('certificate_file').click()
        }
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {inputs['file'] ? (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: '100%', py: 0.5, px: 2 }}
          >
            <Stack justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1}>
                {getFileIcon(inputs['file'].type)}
                <Typography color="primary.main" fontWeight="medium">
                  {truncateFileName(inputs['file'].name)}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {(inputs['file'].size / 1024).toFixed(1)} KB
              </Typography>
            </Stack>
            <IconButton
              onClick={removeFile}
              size="small"
              sx={{
                p: 0.5,
                color: 'error.main',
                bgcolor: 'rgba(244, 67, 54, 0.12)',
                '&:hover': {
                  color: 'error.dark',
                  bgcolor: 'rgba(244, 67, 54, 0.3)'
                }
              }}
            >
              <DeleteOutlineIcon size="small" />
            </IconButton>
          </Stack>
        ) : (
          <>
            <Stack direction="row" spacing={1} alignItems="center">
              <CloudUpload
                sx={{
                  color: 'primary.main'
                }}
              />
              <Typography color="primary.main" fontWeight="medium">
                Upload Certificate
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Drag & Drop or Click to Upload
            </Typography>
          </>
        )}
      </Paper>

      {isEdit && activeCertificateData['file'] && (
        <Box
          sx={{
            my: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1,
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: 1,
            backgroundColor: 'rgba(0, 123, 255, 0.04)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 30,
                height: 30,
                mr: 2,
                bgcolor: 'primary.main'
              }}
            >
              <InsertDriveFile />
            </Avatar>
            <Typography variant="body2" fontWeight="medium">
              Current File
            </Typography>
          </Box>
          <IconButton
            color="primary"
            onClick={() =>
              window.open(SERVER_URL + activeCertificateData['file'], '_blank')
            }
            size="small"
          >
            <Visibility />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export const ErrorMessage = ({ errorMessage }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: '#fdecea',
        color: '#d32f2f',
        border: '1px solid #f5c2c7',
        borderRadius: '4px',
        p: 1,
        my: 2
      }}
    >
      <ErrorOutline sx={{ fontSize: 24 }} />
      <Typography variant="body2">{errorMessage}</Typography>
    </Box>
  );
};

export const ActionButton = ({ saving, isEdit }) => {
  return (
    <Button fullWidth disabled={saving} variant="contained" size="large" type="submit">
      {saving ? <Loader width="26" color="#444" /> : isEdit ? 'UPDATE' : 'SAVE'}
    </Button>
  );
};

export const SelectField = ({
  id,
  label,
  required = true,
  disabled = false,
  options,
  value,
  onChange = () => {},
  showOptionDescription = false // Accept showOptionDescription as a prop
}) => {
  return (
    <Autocomplete
      required={required}
      getOptionLabel={(option) => option.name}
      id={id}
      options={options}
      value={value}
      onChange={onChange}
      sx={{ mb: 2 }}
      disabled={disabled}
      // Conditionally add renderOption
      renderOption={
        showOptionDescription
          ? (props, option) => (
              <li {...props}>
                <div style={{ display: 'flex', width: '100%' }}>
                  <div>{option.name}</div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      flexGrow: 1,
                      textAlign: 'right',
                      fontSize: 12,
                      color: '#ccc',
                      fontStyle: 'italic'
                    }}
                  >
                    {option.description}
                  </div>
                </div>
              </li>
            )
          : undefined
      }
      renderInput={(params) => (
        <TextField label={label} required fullWidth {...params} />
      )}
    />
  );
};

export const CustomDatePicker = (props) => {
  const {
    label,
    disabled = false,
    isCME = false,
    selectedDate,
    handleDateChange
  } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl fullWidth>
        <MobileDatePicker
          label={label}
          value={selectedDate}
          name={label}
          disabled={disabled}
          disableFuture={isCME}
          onChange={handleDateChange}
          // Changes for mui/x-date-picker version 5
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{
                cursor: 'pointer',
                '& .MuiInputBase-input': {
                  cursor: 'pointer',
                },
              }}
            />
          )}
          // Hide the Edit Icon in the DatePicker Toolbar
          sx={{
            '& .MuiPickersToolbar-penIconButton': {
              display: 'none'
            }
          }}
        />
      </FormControl>
    </LocalizationProvider>
  );
};

export const CreditHoursField = (props) => {
  const { value, index, categoryFieldChange, error } = props;
  return (
    <TextField
      required
      fullWidth
      id="credit_hour"
      label="Credit Hours"
      name="credit_hour"
      type="text"
      step="any"
      sx={{ mb: 2 }}
      inputProps={{ maxLength: 4 }}
      onChange={(e) => {
        const value = e.target.value;
        // Ensure the value is a valid number or an empty string
        if (value === '' || /^(\d+(\.\d*)?|\.\d+)$/.test(value)) {
          categoryFieldChange(index, value, 'credit_hour');
        }
      }}
      value={value || ''}
      error={error}
      helperText={error ? 'Please enter a positive value' : ''}
    />
  );
};

export const MultipleCategoryBox = ({ key, remove, index, children }) => {
  return (
    <Paper
      key={key}
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: 1,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'grey.300',
        position: 'relative',
        bgcolor: 'grey.100'
      }}
    >
      {/* Compact header with remove button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 0.5,
          px: 1.5,
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          bgcolor: 'grey.200'
        }}
      >
        {index && (
          <Typography variant="body2" fontWeight="medium">
            Category {index}
          </Typography>
        )}
        <Tooltip arrow title="Remove Category Field" placement="left">
          <IconButton
            onClick={remove}
            size="small"
            sx={{
              p: 0.5,
              color: 'grey.600',
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              '&:hover': {
                color: 'error.main',
                bgcolor: 'rgba(244, 67, 54, 0.12)'
              }
            }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Compact content area */}
      <Box p={1.5}>{children}</Box>
    </Paper>
  );
};
