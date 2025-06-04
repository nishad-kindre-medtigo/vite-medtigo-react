import React, { useEffect, useState, useRef } from 'react';
import { Send as SendIcon } from '@mui/icons-material';
import { Dialog, DialogContent, TextField, InputAdornment, IconButton, Typography, Box, CircularProgress, List, ListItem, Chip, Tooltip } from '@mui/material';
import taskChatServices from 'src/services/taskChat';
import CancelIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { SERVER_URL } from 'src/settings';
import AddIcon from '@mui/icons-material/Add';
import ReplayIcon from '@mui/icons-material/Replay';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const MessageDialog = ({
  open,
  onClose,
  taskID,
  analystID,
  taskType,
  jobName
}) => {
  const { user } = useSelector((state) => state.account);
  const openSnackbar = useOpenSnackbar();

  const [chat, setChat] = useState(''); // State for chat message
  const [attachments, setAttachments] = useState(null); // State for file attachment
  const [hasRecipientReadMyLastMessage, setHasRecipientReadMyLastMessage] =
    useState(null);

  const onFileAttach = (event) => {
    const file = event.target.files[0];
    if (file.size > MAX_FILE_SIZE) {
      openSnackbar(
        `The file exceeds the maximum size limit of ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
        'error'
      );
      return;
    }
    setAttachments(event.target.files[0]); // Store the selected file
  };

  const handleFileClick = () => {
    console.info('You clicked the Chip.');
  };

  const handleFileDelete = () => {
    setAttachments(null);
  };

  const [messages, setMessages] = useState([]); // State for existing messages
  const [loading, setLoading] = useState(true); // State for loading messages
  const [sending, setSending] = useState(false); // State for sending message
  const [refreshMessage, setRefreshMessage] = useState(false);

  // Fetch messages when the dialog opens
  useEffect(() => {
    if (open && taskID) {
      fetchMessages();
      taskChatServices.readTaskChat({ taskID, userID: user.id });
    }
  }, [open, refreshMessage]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await taskChatServices.getTaskChat(taskID);

      if(!response) return

      const latestMessage = response[response.length - 1];

      if (latestMessage?.senderID == user.id && latestMessage.isRead) {
        setHasRecipientReadMyLastMessage(true);
      }

      setMessages(response || []); // Update messages list
    } catch (error) {
      setMessages([]);
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitMessage = async () => {
    try {
      const formData = new FormData();
      formData.append('senderID', user.id); // Replace with actual sender ID
      formData.append('receiverID', analystID); // Replace with actual receiver ID
      formData.append('chat', chat);
      formData.append('file', attachments); // Attach the selected file
      formData.append('taskID', taskID); // Pass taskID

      const response = await taskChatServices.addTaskChat(formData);
      // onClose(); // Close dialog on success
      // setMessages((prevMessages) => [...prevMessages, response]);
      setRefreshMessage((value) => !value);
      setChat('');
      setAttachments(null); // Reset file attachment
      setHasRecipientReadMyLastMessage(null);
    } catch (error) {
      console.log(error);
      setMessages([]);
      setHasRecipientReadMyLastMessage(null);
      console.error('Error submitting message:', error);
    }
  };

  const messagesContainerRef = useRef(null);

  // Replace your current scrollToBottom function with this enhanced version
  const scrollToBottom = () => {
    // Add a small delay to ensure content is rendered
    setTimeout(() => {
      if (messagesContainerRef.current) {
        const scrollContainer = messagesContainerRef.current;
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }, 100);
  };

  // Update your useEffects
  // 1. Scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // 2. Scroll when dialog opens
  useEffect(() => {
    if (open && messages.length > 0) {
      scrollToBottom();
    }
  }, [open]);

  // 3. Scroll after loading completes
  useEffect(() => {
    if (!loading && messages.length > 0) {
      scrollToBottom();
    }
  }, [loading]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          width: '100%',
          p: 2,
          // backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          flexWrap: 'wrap',
          borderBottom: '1px solid #9A9A9A',
          backgroundColor: '#F6F6F6'
        }}
      >
        <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center', maxWidth: { xs: '100%', sm: '80%'} }}>
          <img src="/icons/medtigoNew.svg" width={45} />
          <span
            style={{
              fontSize: '18px',
              padding: '5px 10px',
              backgroundColor: '#DF5338',
              borderRadius: '4px',
              color: '#fff',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            {jobName} | {taskType}
          </span>
        </Box>
        <Tooltip title="Refresh Chat">
          <IconButton
            style={{
              width: '30px',
              height: '30px'
            }}
            onClick={() => setRefreshMessage((val) => !val)}
          >
            <ReplayIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Close">
          <IconButton
            style={{
              width: '30px',
              height: '30px'
            }}
            onClick={onClose}
          >
            <CancelIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <DialogContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '600px', // Fixed height to enable scrolling
          padding: '20px',
          paddingTop: '0px'
        }}
      >
        <Box
          ref={messagesContainerRef}
          style={{
            height: 'calc(100% - 120px)', // Adjust based on your header and input heights
            overflowY: 'auto',
            borderRadius: '8px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {loading ? (
            <Box style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <></>
            </Box>
          ) : messages.length === 0 ? (
            <Box style={{ height: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <></>
            <Typography
              color="textSecondary"
            >
              No messages found for this task.
            </Typography>
            </Box>
          ) : (
            <List
              style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
            >
              {messages?.map((message, index) => {
                // Create a reference for the last message
                return (
                  <ListItem
                    key={message.id}
                    style={{
                      display: 'flex',
                      width: '100%',
                      flexDirection: 'column',
                      alignItems:
                        message?.senderID === user.id
                          ? 'flex-end'
                          : 'flex-start',
                      paddingLeft: '0px'
                    }}
                  >
                    <Box
                      style={{
                        backgroundColor:
                          message?.senderID === user.id
                            ? 'rgba(0, 128, 255, 0.1)' // Light blue for sent messages
                            : 'rgba(0, 0, 0, 0.05)', // Light gray for received messages
                        borderRadius: '6px',
                        padding: '10px',
                        maxWidth: '70%',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column'
                        // position: 'relative',
                      }}
                    >
                      {message.chat !== '' && (
                        <Typography
                          variant="body2"
                          color="textPrimary"
                          style={{
                            // wordBreak: 'break-word',
                            marginBottom: '4px'
                          }}
                        >
                          {message.chat}
                        </Typography>
                      )}

                      {message.attachments && (
                        <Typography
                          variant="body2"
                          color="primary"
                          style={{ marginBottom: '4px' }}
                        >
                          <a
                            href={`${SERVER_URL}${message.attachments}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#57b9ff' }}
                          >
                            {message.attachmentFileName}
                          </a>
                        </Typography>
                      )}

                      <Typography
                        variant="caption"
                        color="textSecondary"
                        style={{
                          fontSize: '0.7rem',
                          alignSelf:
                            message.senderID === user.id ? 'end' : 'start'
                        }}
                      >
                        {formatTimestamp(message.createdAt)}
                      </Typography>
                    </Box>
                    {/* {messages.length - 1 === index && hasRecipientReadMyLastMessage && 
                    <Tooltip title="Read by recipient">
                    <RemoveRedEye style={{marginTop: "10px", width: "20px"}}/>
                    </Tooltip>
                     } */}
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>

        <Box style={{ marginTop: 'auto' }}>
          {attachments && (
            <Chip
              color="success"
              variant="outlined"
              style={{ width: 'minContent', marginBottom: '5px' }}
              label={attachments.name}
              onClick={handleFileClick}
              onDelete={handleFileDelete}
            />
          )}
          <TextField
            // label="Type your message..."
            variant="outlined"
            fullWidth
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (chat || attachments) {
                  onSubmitMessage();
                }
              }
            }}
            hiddenLabel={true}
            placeholder="Type your message..."
            value={chat}
            sx={{
              backgroundColor: '#F6F6F6',
              border: '1pz solid #9A9A9A',
            }}
            onChange={(e) => setChat(e.target.value)}
            InputProps={{
              endAdornment: (
                <>
                  <InputAdornment position="end">
                    <IconButton component="label">
                      <AddIcon />
                      <input type="file" hidden onChange={onFileAttach} />
                    </IconButton>
                  </InputAdornment>

                  <InputAdornment
                    position="end"
                    disablePointerEvents={(!chat && !attachments) || sending}
                  >
                    <SendIcon
                      onClick={() => {
                        onSubmitMessage();
                      }}
                      style={{
                        cursor:
                          (!chat && !attachments) || sending
                            ? 'not-allowed'
                            : 'pointer',
                        color:
                          (!chat && !attachments) || sending
                            ? 'gray'
                            : 'rgb(11, 102, 191)'
                      }}
                      disabled={(!chat && !attachments) || sending}
                    />
                  </InputAdornment>
                </>
              )
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
