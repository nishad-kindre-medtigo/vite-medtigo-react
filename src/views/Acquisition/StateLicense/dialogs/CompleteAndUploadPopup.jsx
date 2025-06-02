import React from 'react';
import { Button, Box, Dialog, DialogTitle, Stack, DialogContent, DialogActions, Grid, Typography, Chip, TextareaAutosize } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import { convertMarkdownLinksToHtml } from '../utils';
import { AddCertificateField } from '../../../../views/MonitoringRenewal/ui';

const CompleteAndUploadPopup = ({
  responseData,
  setResponseData,
  handleTaskResponse,
  respondDialog,
  handleCloseRespondPopup,
  payLink,
  files,
  setFiles,
  handleFileInput,
  errorMessageFile,
  setErrorMessageFile,
  openSnackbar
}) => {

  const htmlContent = convertMarkdownLinksToHtml(responseData.Certificate_Note);

  return (
    <Dialog
      open={respondDialog}
      onClose={() => {
        handleCloseRespondPopup();
        setFiles([]);
      }}
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          color: '#000000',
          position: 'relative',
          paddingTop: '20px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            cursor: 'pointer'
          }}
          onClick={() => {
            setErrorMessageFile('');
            setFiles([]);
            handleCloseRespondPopup();
          }}
        >
          <CancelIcon
            style={{
              color: '#9D9B9B',
              height: '30px',
              width: '30px'
            }}
          />
        </div>
        <Typography
          style={{
            fontWeight: 'bold',
            color: '#006CDE',
            textAlign: 'center'
          }}
        >
          {responseData.Task_Type === 'Document Requested'
            ? 'Upload Document'
            : 'Complete Task'}
        </Typography>
      </DialogTitle>
      <div
        style={{
          backgroundColor: '#15487F',
          height: '2px',
          width: '100%'
        }}
      ></div>
      <DialogContent
        style={{
          backgroundColor: '#ffffff',
          color: '#000000',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <Typography
          style={{
            fontWeight: 'bold',
            color: '#006CDE',
            textAlign: 'left'
          }}
        >
          {responseData.Certificate_Name}-{responseData.state_abbr}
        </Typography>

        {/* NOTE */}
        <span dangerouslySetInnerHTML={{ __html: htmlContent }} />

        {responseData.Task_Type !== 'Document Requested' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}
          >
            <Typography
              style={{
                fontWeight: '500'
              }}
            >
              Add Comment{' '}
              {responseData.Task_Type === 'Document Requested' ? (
                ''
              ) : (
                <span style={{ color: 'red' }}>*</span>
              )}
            </Typography>
            <TextareaAutosize
              placeholder="Write your comment here..."
              style={{
                fontFamily: 'sans-serif',
                padding: '10px',
                display: 'flex',
                width: '100%',
                minHeight: 50,
                maxHeight: 150,
                backgroundColor: 'transparent',
                resize: 'vertical',
                fontSize: '16px',
                overflow: 'auto'
              }}
              value={responseData.Comment}
              onChange={e =>
                setResponseData({ ...responseData, Comment: e.target.value })
              }
            />
          </div>
        )}
          <div>
          <input
            type="file"
            color="primary"
            accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.pdf"
            name="file"
            multiple
            required
            id="upload_file"
            onChange={event => {
              handleFileInput(event.target.files);
            }}
            style={{ display: 'none' }}
          />
          <AddCertificateField
            onClick={() => document.getElementById('upload_file').click()}
          >
            <img
              alt="Upload Certificate"
              src={`/icons/file.svg`}
              style={{
                marginRight: 8
              }}
            />
            Upload File
          </AddCertificateField>
        </div>
        {files.length > 0 ? (
        <Box
          sx={{
            minHeight: '100px',
            overflowY: 'auto',
            overflowX: 'hidden',
            p: 1,
            border: '1px solid #ddd',
            borderRadius: 1,
            backgroundColor: '#f9f9f9',
          }}
        >
          <Stack direction="row" gap={1} flexWrap="wrap">
            {files?.map((itm, indx) => {
                return (
                  <Chip
                    key={indx}
                    variant="outlined"
                    icon={<FileIcon />}
                    label={itm.file?.name}
                    onDelete={() => {
                      // Filter out the deleted file
                      const updatedFiles = files.filter(file => file.file?.name !== itm.file?.name);
                      setFiles(updatedFiles);

                      // Create a new DataTransfer object to hold the remaining files
                      const dataTransfer = new DataTransfer();
                      updatedFiles.forEach(file => dataTransfer.items.add(file.file));

                      // Reset file input value and re-assign the remaining files
                      const fileInput = document.getElementById('upload_file');
                      if (fileInput) {
                        fileInput.files = dataTransfer.files;
                      }
                    }}
                    sx={{ background: '#fff' }}
                  />
                );
              })}
          </Stack>
        </Box>
        ) : null}
        {errorMessageFile !== '' && (
          <Typography color="error">{errorMessageFile}</Typography>
        )}
      </DialogContent>
      <DialogActions
        style={{
          justifyContent: 'center',
          paddingBottom: '20px'
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: '200px' }}
          onClick={() => {
            responseData.Comment ||
            responseData.Task_Type === 'Document Requested'
              ? handleTaskResponse()
              : openSnackbar('Please enter Comment', 'error');
          }}
        >
          {payLink ? 'SUBMIT AND PAY' : 'SUBMIT'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompleteAndUploadPopup;
