import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import moment from 'moment';
import { formatLicenseTaskName, } from '../utils';
import { TaskCard, TaskType, TaskDivider, TaskSubmittedText, TaskNoteMarkdown, TaskActionBox, PrimaryButton, OutlinedButton } from '../ui';

const LicenseTaskCard = props => {
  const {
    data,
    type,
    showLicenseName = true,
    urlTaskID = false,
    handleOpenMessage,
    setResponseData,
    setRespondDialog,
    setOpenSignatureModal,
    setPasswordTaskID,
    setOpenPasswordDialog,
    fetchUserTasks,
    fetchInVoiceDetails,
    setOpenDetailTaskDialog,
    setTaskDetailData
  } = props;

  const isURLTask = data.id == urlTaskID;
  const isTaskSubmitted = data.taskSubmitted === 1;

  const taskNote = data.Certificate_Task_Note.trim();
  const truncatedNote =
    taskNote.length > 40
      ? taskNote.slice(0, 40)
      : taskNote;

  // Scroll to the current certificate (accordion) when selectedState changes
  useEffect(() => {
    if (data.id == urlTaskID) {
      // Find the element using its ID and scroll to it
      const element = document.getElementById(data.id); // Use the data.id  as the ID
      if (element) {
        window.scrollTo({
          top: element.offsetTop, // Scroll to the top of the element
          behavior: 'smooth' // Smooth scroll
        });
      }
    }
  }, [ urlTaskID, data.id ]);

  // Open Task Memo
  const handleMemoClick = () => {
    const jobName = data.Certificate_Name.includes(',')
      ? data.Certificate_Name.split(',')
          .map((data1, index) => {
            const currentStateAbbr =
              data.state_abbr.includes(',') &&
              data.state_abbr.split(',')[index];
            if (data1 === '') return '';
            return data1 + ' - ' + currentStateAbbr;
          })
          .slice(0, -1)
          .join(', ')
      : data.Certificate_Name +
        ' - ' +
        (data.state === 'Onboarding' ? 'Onboarding' : data.state_abbr);

    handleOpenMessage(data.Task_Type, jobName, data.id, data.Analyst_id);
  };

  // Open Payment Link
  const handleOpenPaymentLink = () => {
    window.open(
      data.Payment_Link,
      'mozillaWindow',
      'left=200,top=100,width=1100,height=600'
    );
  };

  // Open E-Sign
  const handleSignClick = () => {
    // Check if the link already has query parameters
    const separator = data.E_Signature_Link.includes('?') ? '&' : '?';

    // Construct the updated link dynamically
    const updatedLink = `${data.E_Signature_Link}${separator}Certificate_Id=${data.Certificate_Id}&Task_Id=${data.id}&Task_Type=${data.Task_Type}`;

    // Store the parameters in sessionStorage
    sessionStorage.setItem('Certificate_Id', data.Certificate_Id);
    sessionStorage.setItem('Task_Id', data.id);
    sessionStorage.setItem('Task_Type', data.Task_Type);

    // Open the link in a new window
    const signatureWindow = window.open(
      updatedLink,
      'mozillaWindow',
      'left=200,top=100,width=1100,height=600'
    );

    // Add an event listener to remove sessionStorage and reload the page when the window is closed
    const checkWindowClosedInterval = setInterval(() => {
      if (signatureWindow.closed) {
        // Clear sessionStorage when the window is closed
        sessionStorage.removeItem('Certificate_Id');
        sessionStorage.removeItem('Task_Id');
        sessionStorage.removeItem('Task_Type');

        // Reload the current page
        fetchUserTasks();

        // Stop checking after the window is closed
        clearInterval(checkWindowClosedInterval);
      }
    }, 500); // Check every 500ms if the window is closed
  };

  // Handle Task Button Click Logic - For Tasks other than Fees Requested & Signature Requested
  const handleTaskComplete = () => {
    if (data.Task_Type === 'Demographics Requested') {
      setResponseData({
        Certificate_Id: data.Certificate_Id,
        Task_Id: data.id,
        Comment: '',
        Task_Type: data.Task_Type
      });
      setOpenSignatureModal(true);
    } else if (data.Task_Type.toLowerCase() === 'registration & login') {
      setPasswordTaskID(data.id);
      setOpenPasswordDialog(true);
      setResponseData({
        Certificate_Id: data.Certificate_Id,
        Certificate_Name: data.Certificate_Name,
        Task_Type: data.Task_Type,
        Task_Id: data.id,
        state_abbr: data.state_abbr
      });
      return;
    } else {
      setRespondDialog(true);
      setResponseData({
        Certificate_Id: data.Certificate_Id,
        Certificate_Name: data.Certificate_Name,
        Task_Type: data.Task_Type,
        Task_Id: data.id,
        Certificate_Note: data.Certificate_Task_Note,
        Comment: data.Comment,
        state_abbr: data.state_abbr
      });
    }
  };

  // Handle Button Click for Fees Requested Task
  const handleFeesRequestedComplete = () => {
    setResponseData({
      Certificate_Id: data.Certificate_Id,
      Task_Id: data.id,
      Comment: '',
      Task_Type: data.Task_Type
    });
    setRespondDialog(true);
  };

  // Handle Note View More Click
  const handleViewMore = () => {
    if (data.Task_Type === 'Fees Requested') {
      fetchInVoiceDetails(data.Invoice_No);
    }
    setOpenDetailTaskDialog(true);
    setTaskDetailData({
      type: "Task",
      note: data.Certificate_Task_Note,
      addedBy: data.AddedByName,
      assignedDate: data.createdAt,
      comment: data.comment,
      Task_Type: data.Task_Type,
      Attachment_File_Name: data.Attachment_File_Name,
      Attachment_File: data.Attachment_File,
      Certificate_Name: data.Certificate_Name.includes(',')
        ? data.Certificate_Name.split(',')
            .map((data1, index) => {
              const currentStateAbbr =
                data.state_abbr.includes(',') &&
                data.state_abbr.split(',')[index];
              if (data1 === '') return '';
              return data1 + ' - ' + currentStateAbbr;
            })
            .slice(0, -1)
            .join(', ')
        : data.Certificate_Name + ' - ' + data.state_abbr
    });
  };

  return (
    <TaskCard id={data.id} isURLTask={isURLTask}>
      {/* TASK HEADER */}
      <TaskType
        type={type}
        taskType={data.Task_Type}
        handleMemoClick={handleMemoClick}
      />

      <TaskDivider />

      {/* TASK DETAILS */}
      {/* Hide Task Name for Single License Tasks Page */}
      {showLicenseName && (
        <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
          {formatLicenseTaskName(data)}
        </Typography>
      )}
      <Typography style={{ fontSize: '14px', fontWeight: 600 }}>
        Due Date:{' '}
        <span style={{ fontWeight: 400 }}>
          {moment(data.Due_Date).format('MMM D, YYYY')}
        </span>
      </Typography>
      <TaskNoteMarkdown truncatedNote={truncatedNote} handleViewMore={handleViewMore} />

      {/* TASK SUBMISSION TEXT */}
      {isTaskSubmitted ? <TaskSubmittedText taskType={data.Task_Type} /> : null}

      {/* BUTTON SECTION */}
      {isTaskSubmitted ? (
        <TaskActionBox>
          {(data.Task_Type === 'Fees Requested' ||
            data.Task_Type === 'Signature Requested') && (
            <>
              {data.Task_Type === 'Fees Requested' && (
                <PrimaryButton onClick={handleOpenPaymentLink}>
                  PAY NOW
                </PrimaryButton>
              )}
              {/* {data.Task_Type === 'Signature Requested' && (
                <PrimaryButton onClick={handleSignClick}>SIGN</PrimaryButton>
              )} */}
            </>
          )}
        </TaskActionBox>
      ) : (
        <TaskActionBox>
          {data.Task_Type !== 'Fees Requested' &&
            data.Task_Type !== 'Signature Requested' && (
              <PrimaryButton onClick={handleTaskComplete}>
                {data.Task_Type === 'Document Requested'
                  ? 'Upload'
                  : data.Task_Type === 'Demographics Requested'
                  ? 'Fill Form'
                  : 'Complete'}
              </PrimaryButton>
            )}
          {data.Task_Type === 'Fees Requested' && (
            <OutlinedButton onClick={handleOpenPaymentLink}>
              PAY NOW
            </OutlinedButton>
          )}
          {data.Task_Type === 'Signature Requested' && (
            <PrimaryButton onClick={handleSignClick}>SIGN</PrimaryButton>
          )}

          {data.Task_Type === 'Fees Requested' && (
            <PrimaryButton onClick={handleFeesRequestedComplete}>
              COMPLETE
            </PrimaryButton>
          )}
        </TaskActionBox>
      )}
    </TaskCard>
  );
};

export default LicenseTaskCard;
