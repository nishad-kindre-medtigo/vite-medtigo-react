import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useLicenceContext } from 'src/context/LicenseContext';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import alertPage from 'src/services/alertPage';
import history from 'src/utils/history';
import Page from 'src/components/Page';
import { TrackerPage, SupportPage, AllLicenseTasksPage, SingleLicenseTasksPage, UpdatesPage, } from './pages';
import { CompleteAndUploadPopup, FeedbackPopup, SignaturePopup, TaskDetailsPopup, MessageDialog, AttachmentViewPopup, EmailPreferenceDialog } from './dialogs';
import PlatformDetailsDialog from 'src/views/ToolsResources/Vault/components/PlatformDetailsDialog';

const DEFAULT_RESPONSE = {
  Task_Id: '',
  Certificate_Id: '',
  Certificate_Name: '',
  Certificate_Note: '',
  Comment: '',
  file: [],
  Task_Type: ''
};

const StateLicensePage = ({ setHideTabPanel }) => {
  const openSnackbar = useOpenSnackbar();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // FETCH TASK ID FROM URL
  const { id: userID } = useSelector(state => state.account.user);
  const [showSupport, setShowSupport] = useState(false); // SHOW SUPORT SECTION
  const [showAllTasks, setShowAllTasks] = useState(false); // SHOW ALL TASKS SECTION
  const [showUpdates, setShowUpdates] = useState(false); // SHOW UPDATES SECTION

  const [overdueCount, setOverdueCount] = useState();
  const [timelyCount, setTimelyCount] = useState();
  const [updatesCount, setUpdatesCount] = useState();
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [updateTasks, setUpdateTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskCategory, setTaskCategory] = useState('all'); // OVERDUE / TIMELY / ALL IN ALL TASKS VIEW

  const [feedbackPopUpOpen, setFeedBackPopUpOpen] = useState(false);
  const [mailPreferencePopUpOpen, setMailPreferencePopUpOpen] = useState(false);
  const [openSignatureModal, setOpenSignatureModal] = useState(false);

  const [openDetailTaskDialog, setOpenDetailTaskDialog] = useState(false);
  const [taskDetailData, setTaskDetailData] = useState({
    note: '',
    comment: ''
  });
  const [invoiceData, setinvoiceData] = useState([]);

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false); // OPEN PASSWORD POPUP WHEN COMPLETING TASK OR REDIRECTING FROM MAIL 
  const [passwordTaskID, setPasswordTaskID] = useState(false); // SET TASK ID FROM URL

  const [respondDialog, setRespondDialog] = useState(false);
  const [responseData, setResponseData] = useState(DEFAULT_RESPONSE);
  const [searchText, setSearchText] = useState('');
  const [errorMessageFile, setErrorMessageFile] = useState('');
  const [files, setFiles] = useState([]);
  const [onetime, setOneTime] = useState(false);
  const [payLink, setPayLink] = useState('');

  const [openMessage, setOpenMessage] = useState(false); // OPEN TASK MEMO
  const [taskID, setTaskID] = useState(null); // MEMO TASK ID
  const [taskTypeChat, setTaskTypeChat] = useState(null); 
  const [jobName, setJobName] = useState(null);
  const [analystID, setAnalystID] = useState(null); // ANALYST FOR SELECTED MEMO

  const [attachmentPopup, setAttachmentPopup] = React.useState(false);
  const [attachment_Files, SetAttachmentFiles] = React.useState('');
  const [attachment_FilesName, SetAttachmentFileNames] = React.useState('');

  const [licenseID, setLicenseID] = useState(null); // SET LICENSE ID WHEN CLICKED ON VIEW TASKS IN TRACKER
  const [licenseName, setLicenseName] = useState(null); // SET SELECTED LICENSE NAME ON VIEW TASKS CLICK

  const [urlTaskID, setURLTaskID] = useState('');

  const { licenseLoading, licenseStepperData, supportData, taskSearchOptions } = useLicenceContext();

  // DIVIDE LICENSE TASKS INTO OVERDUE, TIMELY BASED ON DUE DATE
  const categorizeLicenseTasks = (licenseTasks) => {
    const updates = [];
    const pending = [];
    const overdue = [];
  
    const isApplicant = (task) => task.Assigned_To_Whom.userType === 'Applicant';
  
    licenseTasks.forEach((task) => {
      const dueDate = task.Due_Date.split('T')[0];
      if (!isApplicant(task)) {
        updates.push(task);
      } else if (moment(dueDate).isSameOrAfter(moment())) {
        pending.push(task);
      } else {
        overdue.push(task);
      }
    });
    if(taskCategory !== 'overdue' && taskCategory !== 'timely'){
      setOverdueCount(overdue.length);
      setTimelyCount(pending.length);
      setUpdatesCount(updates.length);
    }
    return { updates, pending, overdue };
  };

  // FETCH USER TASKS - OVERDUE, TIMELY & UPDATES
  const fetchUserTasks = async (taskSearchData = {}, fromSearch = false) => {
    try {
      setTaskLoading(true);
      let licenseTasks = [];
      if (fromSearch) {
        licenseTasks = taskSearchData;
      } else {
        const { data } = await alertPage.getUserLicenseTask(
          userID,
          'In-Progress',
          licenseID,
          taskCategory
        );
        licenseTasks = data;
      }
      const { updates, pending, overdue } = categorizeLicenseTasks(licenseTasks);
      setPendingTasks(pending);
      setOverdueTasks(overdue);
      setUpdateTasks(updates);
    } catch (err) {
      setTaskLoading(true);
      setPendingTasks([]);
      setOverdueTasks([]);
      setUpdateTasks([]);
    } finally {
      setTaskLoading(false);
    }
  };

  // FETCH INVOICE DETAILS FOR FEES REQUESTED TASKS
  const fetchInVoiceDetails = async id => {
    try {
      const { data: invoiceData } = await alertPage.getInvoiceDetail(id);
      setinvoiceData(invoiceData);
    } catch (err) {
      console.error('Error fetching invoice data: ', err);
      setinvoiceData([]);
    }
  };

  // UPDATE TASKS WHEN SEARCH OPTION SELECTED FROM FILTER - ONLY FOR ALL TASKS
  const updateTasksAndNotes = async () => {
    try {
      const { data: searchData } = await alertPage.getLicenseSearch(
        userID,
        searchText
      );
      fetchUserTasks(searchData.task, true);
    } catch (err) {
      console.error('Error fetching user tasks & notes on search: ', err);
    }
  };

  // FETCH LICENSE TASKS INITIALLY, WHEN CHANGING SEARCH LICENSE FILTER & TASK CATEGORY OPTION
  useEffect(() => {
    if (searchText === '') {
      fetchUserTasks();
    } else {
      updateTasksAndNotes();
    }
  }, [searchText, taskCategory]);

  // FETCH LICENSE TASKS WHENEVER LICENSE ID CHANGES DUE TO CLICKING OF VIEW TASKS ON LICENSE IN TRACKER
  useEffect(() => {
    if (licenseID) {
      fetchUserTasks();
    }
  }, [licenseID]);

  // LOGIC WHEN REDIRECTING FROM MAIL - TO OPEN TASK MEMO POPUP
  useEffect(() => {
    let taskData = null;
    const taskChatId = queryParams.get('task_chat_id');
    if (taskChatId) {
      setShowAllTasks(true);
    }
    if (overdueTasks.length > 0 || pendingTasks.length > 0) {
      if (overdueTasks.length > 0) {
        taskData = overdueTasks.find(itm => itm.id == taskChatId);
      }
      if (!taskData) {
        if (pendingTasks.length > 0) {
          taskData = pendingTasks.find(itm => itm.id == taskChatId);
        }
      }
      if (taskData) {
        const jobName = taskData.Certificate_Name.includes(',')
          ? taskData.Certificate_Name.split(',')
              .map((data1, index) => {
                const currentStateAbbr =
                  taskData.state_abbr.includes(',') &&
                  taskData.state_abbr.split(',')[index];
                if (data1 === '') return '';
                return data1 + ' - ' + currentStateAbbr;
              })
              .slice(0, -1)
              .join(', ')
          : taskData.Certificate_Name +
            ' - ' +
            (taskData.state === 'Onboarding'
              ? 'Onboarding'
              : taskData.state_abbr);
        handleOpenMessage(
          taskData.Task_Type,
          jobName,
          taskData.id,
          taskData.Analyst_id
        );
      }
    }
  }, [overdueTasks.length, pendingTasks.length]);

  // LOGIC WHEN REDIRECTING FROM MAIL - TO OPEN ALL TASKS PAGE
  useEffect(() => {
    const emailRoute = localStorage.getItem('data');
    if(emailRoute === "/state-licensing"){
      setShowAllTasks(true);
      localStorage.removeItem('data');
    }
  }, [])

  // LOGIC WHEN REDIRECTING FROM MAIL
  useEffect(() => {
    let taskData = null;
    let q_task_id = queryParams.get('task_id');
    if (q_task_id) {
      setShowAllTasks(true);
    }
    if (!onetime && overdueTasks.length > 0 && q_task_id) {
      taskData = overdueTasks.find(itm => itm.id == q_task_id);
    }
    if (!taskData) {
      if (!onetime && pendingTasks.length > 0 && q_task_id) {
        taskData = pendingTasks.find(itm => itm.id == q_task_id);
      }
    }
    if (taskData) {
      let obj = {
        Task_Id: taskData.id,
        Certificate_Id: taskData.Certificate_Id,
        Certificate_Name: taskData.Certificate_Name,
        Certificate_Note: taskData.Certificate_Task_Note,
        Task_Type: taskData.Task_Type,
        state_abbr: taskData.state_abbr,
        Comment: taskData.Comment,
        file: []
      };
      setResponseData(obj);

      if (taskData.Task_Type === 'Document Requested') {
        setRespondDialog(true);
      } else if (taskData.Task_Type === 'Demographics Requested') {
        setOpenSignatureModal(true);
      } else if (taskData.Task_Type === 'Signature Requested') {
        const separator = taskData.E_Signature_Link.includes('?') ? '&' : '?';

        // Construct the updated link dynamically
        const updatedLink = `${taskData.E_Signature_Link}${separator}Certificate_Id=${taskData.Certificate_Id}&Task_Id=${taskData.id}&Task_Type=${taskData.Task_Type}`;

        // Store the parameters in sessionStorage
        sessionStorage.setItem('Certificate_Id', taskData.Certificate_Id);
        sessionStorage.setItem('Task_Id', taskData.id);
        sessionStorage.setItem('Task_Type', taskData.Task_Type);

        // Check if the window has already been checked for closure
        const isWindowChecked = sessionStorage.getItem(
          'signatureWindowChecked'
        );

        // If it's not checked yet, open the signature window
        if (!isWindowChecked) {
          const signatureWindow = window.open(
            updatedLink,
            'mozillaWindow',
            'left=200,top=100,width=1100,height=600'
          );

          // Interval to check if the window is closed
          const checkWindowClosedInterval = setInterval(() => {
            if (signatureWindow.closed) {
              // Mark the window as checked in sessionStorage
              sessionStorage.setItem('signatureWindowChecked', 'true');

              // Clear sessionStorage when the window is closed
              sessionStorage.removeItem('Certificate_Id');
              sessionStorage.removeItem('Task_Id');
              sessionStorage.removeItem('Task_Type');

              fetchUserTasks();

              // Stop checking after the window is closed
              clearInterval(checkWindowClosedInterval);
            }
          }, 500); // Check every 500ms if the window is closed
        }
      } else if (taskData.Task_Type === 'Fees Requested') {
        window.open(
          taskData.Payment_Link,
          'mozillaWindow',
          'left=200,top=100,width=1100,height=600'
        );
      } else if (
        taskData &&
        taskData.Task_Type.toLowerCase() === 'registration & login'
      ) {
        setPasswordTaskID(taskData.id);
        setOpenPasswordDialog(true);
      } else {
        setRespondDialog(true);
      }
      if (q_task_id) {
        setOneTime(true);
      }
    }
  }, [overdueTasks.length, pendingTasks.length]);

  // STORE TASK ID FROM URL IN STATE ( WHILE REDIRECTING FROM MAIL )
  useEffect(() => {
    const taskChatID = queryParams.get('task_chat_id');
    const taskID = queryParams.get('task_id');
    if (taskChatID) {
      setURLTaskID(taskChatID);
    }
    if (taskID) {
      setURLTaskID(taskID);
    }
  }, []);

  // LOGIC WHEN REDIRECTING FROM MAIL - TO OPEN UPDATES PAGE
  useEffect(() => {
    const updateID = queryParams.get('note_id');
    if(updateID){
      setShowUpdates(true);
    }
  }, [])

  // RUN USE EFFECT TO HIDE TOOLBAR BASED ON CURRENT PAGE
  useEffect(() => {
    function handleShowTabPanel() {
      const showTabPanel =
        showAllTasks || licenseID || showSupport || showUpdates;
      setHideTabPanel(showTabPanel);
    }

    handleShowTabPanel();
  }, [showAllTasks, licenseID, showSupport, showUpdates]); // Page Dependencies

  // OPEN TASK MEMO
  const handleOpenMessage = (taskType, jobName, taskId, analystID) => {
    setTaskTypeChat(taskType);
    setJobName(jobName);
    setTaskID(taskId);
    setAnalystID(analystID);
    setOpenMessage(true);
  };

  // REMOVE TASK ID IN URL WHEN CLOSING MEMO POPUP
  const handleCloseMessagePopup = () => {
    const taskChatID = queryParams.get('task_chat_id');
    if (taskChatID) {
      // Remove query parameters from the URL
      history.replace({
        pathname: location.pathname, // Keep the current path
        search: '' // Clear query parameters
      });
    }
    setOpenMessage(false);
  };

  // REMOVE TASK ID IN URL WHEN CLOSING TASK POPUP
  const handleCloseRespondPopup = () => {
    const taskChatID = queryParams.get('task_id');
    if (taskChatID) {
      // Remove query parameters from the URL
      history.replace({
        pathname: location.pathname, // Keep the current path
        search: '' // Clear query parameters
      });
    }
    setRespondDialog(false);
  };

  // REMOVE TASK ID IN URL WHEN CLOSING SIGNATURE POPUP
  const handleCloseSignaturePopup = () => {
    const taskChatID = queryParams.get('task_id');
    if (taskChatID) {
      // Remove query parameters from the URL
      history.replace({
        pathname: location.pathname, // Keep the current path
        search: '' // Clear query parameters
      });
    }
    setOpenSignatureModal(false);
  };

  // TASK BUTTON LOGIC
  const handleTaskResponse = async responseDataDirect => {
    try {
      if (
        responseDataDirect &&
        responseDataDirect.Task_Type &&
        responseDataDirect.Task_Type === 'Signature Requested'
      ) {
        return
      } else if (
        files.length === 0 &&
        responseData.Task_Type === 'Document Requested'
      ) {
        setErrorMessageFile('Please Upload Document');
        return;
      } else if (
        responseData.Task_Type === 'Fees Requested' &&
        responseData.Comment === ''
      ) {
        return;
      } else if (
        responseData.Task_Type != 'Document Requested' &&
        sessionStorage.onetime &&
        responseData.Comment === '' &&
        responseData.Comment.length < 1
      ) {
        openSnackbar('Please add comment.', 'error');
        return;
      }
      await alertPage.certificateTaskUserResponse(
        responseDataDirect ? responseDataDirect : responseData,
        responseDataDirect ? [] : files
      );
      openSnackbar('Response Submitted.');
      if (queryParams.get('task_id')) {
        setOneTime(true);
      }
      setRespondDialog(false);
      fetchUserTasks();
      setFiles([]);
      // fetchTaskCount();
      setFiles([]);
      if (payLink) {
        window.open(payLink);
        setPayLink('');
      }
    } catch (err) {
      openSnackbar('Something went wrong.', 'error');
    }
  };

  const handleSignatureSubmit = () => {
    setOpenSignatureModal(false);
    openSnackbar('Form Submitted Successfully');
    handleTaskResponse();
  };

  const handleFileInput = inputFiles => {
    let newfiles = [];
    Array.from(inputFiles).forEach(file => {
      let newFile = { file: file, fileName: file.name };
      newfiles.push(newFile);
    });
    setErrorMessageFile('');
    setFiles([...files, ...newfiles]);
  };

  // BACK BUTTON LOGIC FOR SINGLE LICENSE TASKS PAGE
  const handleSingleLicenseViewBack = () => {
    setLicenseID(null);
    setLicenseName('');
    setHideTabPanel(false);
  };

  const handleOpenFeedback = () => {
    setFeedBackPopUpOpen(true);
  };

  const handleOpenMailPreference = () => {
    setMailPreferencePopUpOpen(true);
  };

  // VIEW ATTACHMENTS OF TASK IN TASK DETAILS POPUP
  const handleViewAttachment = (fileName, fileData) => {
    setAttachmentPopup(true);
    SetAttachmentFileNames(fileName);
    SetAttachmentFiles(fileData);
  };

  // COMMON PROPS TO PASS ALL TASKS PAGE & SINGLE LICENSE TASKS PAGE
  const commonTaskProps = {
    taskLoading,
    fetchUserTasks,
    fetchInVoiceDetails,
    overdueTasks,
    pendingTasks,
    overdueCount,
    timelyCount,
    handleOpenMessage,
    searchText,
    setSearchText,
    taskSearchOptions,
    setResponseData,
    setRespondDialog,
    setOpenSignatureModal,
    setPasswordTaskID,
    setOpenPasswordDialog,
    setOpenDetailTaskDialog,
    setTaskDetailData,
  };

  return (
    <Page style={{ marginTop: '12px' }}>
      {showAllTasks ? (
        <AllLicenseTasksPage
          goBack={() => {
            setShowAllTasks(false);
            setHideTabPanel(false);
          }}
          taskCategory={taskCategory}
          setTaskCategory={setTaskCategory}
          urlTaskID={urlTaskID}
          {...commonTaskProps}
        />
      ) : licenseID ? (
        <SingleLicenseTasksPage
          goBack={handleSingleLicenseViewBack}
          licenseName={licenseName}
          {...commonTaskProps}
        />
      ) : showSupport ? (
        <SupportPage
          supportData={supportData}
          goBack={() => {
            setShowSupport(false);
            setHideTabPanel(false);
          }}
        />
      ) : showUpdates ? (
        <UpdatesPage
          goBack={() => {
            setShowUpdates(false);
            setHideTabPanel(false);
          }}
          setOpenDetailTaskDialog={setOpenDetailTaskDialog}
          setTaskDetailData={setTaskDetailData}
        />
      ) : (
        <TrackerPage
          licenseLoading={licenseLoading}
          licenseStepperData={licenseStepperData}
          fetchUserTasks={fetchUserTasks}
          setShowAllTasks={setShowAllTasks}
          setShowSupport={setShowSupport}
          setShowUpdates={setShowUpdates}
          setLicenseID={setLicenseID}
          setLicenseName={setLicenseName}
          handleOpenFeedback={handleOpenFeedback}
          handleOpenMailPreference={handleOpenMailPreference}
        />
      )}
      <FeedbackPopup
        open={feedbackPopUpOpen}
        setOpen={setFeedBackPopUpOpen}
        openSnackbar={openSnackbar}
      />
        <EmailPreferenceDialog
        open={mailPreferencePopUpOpen}
        setOpen={setMailPreferencePopUpOpen}
        openSnackbar={openSnackbar}
      />
      <SignaturePopup
        openSignatureModal={openSignatureModal}
        handleCloseSignaturePopup={handleCloseSignaturePopup}
        handleSignatureSubmit={handleSignatureSubmit}
      />
      <CompleteAndUploadPopup
        responseData={responseData}
        setResponseData={setResponseData}
        handleTaskResponse={handleTaskResponse}
        respondDialog={respondDialog}
        handleCloseRespondPopup={handleCloseRespondPopup}
        payLink={payLink}
        files={files}
        setFiles={setFiles}
        handleFileInput={handleFileInput}
        errorMessageFile={errorMessageFile}
        setErrorMessageFile={setErrorMessageFile}
        openSnackbar={openSnackbar}
      />
      <TaskDetailsPopup
        taskDetailData={taskDetailData}
        invoiceData={invoiceData}
        openDetailTaskDialog={openDetailTaskDialog}
        setOpenDetailTaskDialog={setOpenDetailTaskDialog}
        handleViewAttachment={handleViewAttachment}
      />
      <PlatformDetailsDialog
        mode="add-from-API"
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        passwordTaskID={passwordTaskID}
        setRefresh={() => {}}
        handleTaskResponse={handleTaskResponse}
        responseData={responseData}
      />
      <MessageDialog
        setOpen={setOpenMessage}
        taskID={taskID}
        open={openMessage}
        analystID={analystID}
        onClose={handleCloseMessagePopup}
        taskType={taskTypeChat}
        jobName={jobName}
      />
      <AttachmentViewPopup
        open={attachmentPopup}
        onClose={() => setAttachmentPopup(false)}
        attachments={attachment_Files}
        fileName={attachment_FilesName}
      />
    </Page>
  );
};

StateLicensePage.displayName = "StateLicensePage"; // Set the displayName explicitly

export default StateLicensePage;
