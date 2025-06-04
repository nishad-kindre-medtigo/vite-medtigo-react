import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import AttachmentIcon from '@mui/icons-material/AttachFile';
import { convertMarkdownLinksToHtml } from '../utils';
import moment from 'moment';
import Label from 'src/components/Label';
import { CONNECT_URL } from 'src/settings';

const TaskDetailsPopup = ({
  taskDetailData,
  invoiceData,
  openDetailTaskDialog,
  setOpenDetailTaskDialog,
  handleViewAttachment
}) => {
  const htmlContent = convertMarkdownLinksToHtml(taskDetailData.note);

  return (
    <Dialog
      open={openDetailTaskDialog}
      onClose={() => setOpenDetailTaskDialog(false)}
      fullWidth
      maxWidth="md"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          color: '#000000',
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            cursor: 'pointer'
          }}
          onClick={() => setOpenDetailTaskDialog(false)}
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
            fontSize: '20px',
            fontWeight: 600,
            color: '#006CDE',
            textAlign: 'center'
          }}
        >
          {taskDetailData.type} Details
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          {taskDetailData.Task_Type === 'Fees Requested' && (
            <div
              style={{
                color: 'rgb(21, 100, 184)',
                fontWeight: '600'
              }}
            >
              {taskDetailData.Certificate_Name}
            </div>
          )}

          <Typography>
            <span
              style={{
                color: '#1564B8',
                fontWeight: 'bold',
              }}
            >
              {taskDetailData.addedBy
                ? taskDetailData.addedBy
                : taskDetailData.AnalystName}
            </span>{' '}
            added a Certificate {taskDetailData.type}
          </Typography>

          <Typography>
            <span
              style={{
                fontWeight: 'bold',
                color: '#000000'
              }}
            >
              Assigned Date:{' '}
            </span>
            {moment(taskDetailData.assignedDate?.split('T')[0]).format(
              'DD MMMM YYYY'
            )}
          </Typography>

          <Typography
            style={{
              display: 'flex',
              gap: '5px',
              flexDirection: 'column'
            }}
          >
            <span
              style={{
                fontWeight: 'bold',
                color: '#000000'
              }}
            >
              Note:{' '}
            </span>
            <span>
              {taskDetailData &&
              taskDetailData.Task_Type === 'Fees Requested' ? (
                taskDetailData.note.split('Pay Now').map((part, index) => {
                  return (
                    <span key={index}>
                      {part}
                      {/* Bold 'Pay Now' */}
                      {index !==
                        taskDetailData.note.split('Pay Now').length - 1 && (
                        <strong>Pay Now</strong>
                      )}
                    </span>
                  );
                })
              ) : (
                <span dangerouslySetInnerHTML={{ __html: htmlContent }} />
              )}
            </span>
          </Typography>

          <Typography
            style={{
              fontWeight: 'bold'
            }}
          >
            Attachment:{' '}
            {taskDetailData.Attachment_File ? (
              <IconButton
                color="primary"
                onClick={() =>
                  handleViewAttachment(
                    taskDetailData.Attachment_File_Name,
                    taskDetailData.Attachment_File
                  )
                }
              >
                <AttachmentIcon />
              </IconButton>
            ) : (
              <Label color="error">N/A</Label>
            )}
          </Typography>

          {taskDetailData.comment && taskDetailData.comment !== '' && taskDetailData.comment !== 'undefined' && (
            <Typography
              style={{
                display: 'flex',
                gap: '5px',
                flexDirection: 'column'
              }}
            >
              <span
                style={{
                  fontWeight: 'bold',
                  color: '#000000'
                }}
              >
                Comment:{' '}
              </span>
              <span>{taskDetailData.comment}</span>
            </Typography>
          )}
          {taskDetailData.attachments &&
            taskDetailData.attachments.split(',').map((data, index) => {
              return (
                <div key={index}>
                  <span
                    style={{
                      fontWeight: 'bold'
                    }}
                  >
                    Complete Attachment {index + 1}:
                  </span>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`${CONNECT_URL}/${data}`}
                  >
                    View
                  </a>
                </div>
              );
            })}

          {taskDetailData.Task_Type === 'Fees Requested' && invoiceData && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <Typography
                style={{
                  fontWeight: '500',
                  backgroundColor: '#1C5087',
                  color: '#ffffff',
                  textAlign: 'center',
                  padding: '7px 0px'
                }}
              >
                Invoice Summary
              </Typography>
              <table
                style={{
                  border: '1px solid #DAD8D8',
                  borderCollapse: 'collapse'
                }}
              >
                <tr>
                  <td
                    style={{
                      border: '1px solid #DAD8D8',
                      padding: '10px',
                      backgroundColor: '#F3F3F3',
                      color: '#1C5087',
                      fontWeight: '500',
                      textAlign: 'center'
                    }}
                  >
                    State
                  </td>
                  <td
                    style={{
                      border: '1px solid #DAD8D8',
                      padding: '10px',
                      backgroundColor: '#F3F3F3',
                      color: '#1C5087',
                      fontWeight: '500',
                      paddingLeft: '7px'
                    }}
                  >
                    Description
                  </td>
                  <td
                    style={{
                      border: '1px solid #DAD8D8',
                      padding: '10px',
                      backgroundColor: '#F3F3F3',
                      color: '#1C5087',
                      fontWeight: '500',
                      textAlign: 'center'
                    }}
                  >
                    Amount
                  </td>
                </tr>
                {invoiceData.Item_Amount &&
                  invoiceData.Item_Amount.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td
                          style={{
                            border: '1px solid #DAD8D8',
                            padding: '7px 10px'
                          }}
                        >
                          {taskDetailData.Certificate_Name.split(',')[index]}
                        </td>
                        <td
                          style={{
                            border: '1px solid #DAD8D8',
                            padding: '7px 10px'
                          }}
                        >
                          {invoiceData.Item[index]}
                        </td>
                        <td
                          style={{
                            border: '1px solid #DAD8D8',
                            textAlign: 'center',
                            padding: '7px 0px'
                          }}
                        >
                          ${data}
                        </td>
                      </tr>
                    );
                  })}
                <tr>
                  <td></td>
                  <td
                    style={{
                      border: '1px solid #DAD8D8',
                      color: '#1C5087',
                      fontWeight: '500',
                      padding: '8px 0px',
                      paddingLeft: '7px'
                    }}
                  >
                    Total Amount
                  </td>
                  <td
                    style={{
                      border: '1px solid #DAD8D8',
                      color: '#1C5087',
                      textAlign: 'center',
                      fontWeight: '500',
                      padding: '8px 0px'
                    }}
                  >
                    ${invoiceData.TotalAmount}
                  </td>
                </tr>
              </table>
            </div>
          )}
          {taskDetailData.Task_Type === 'Fees Requested' ? (
            <div style={{ display: 'flex', gap: '5px' }}>
              <img
                src="/icons/licensing/rightArrow.png"
                width="20px"
                height="20px"
              />
              <Typography
                style={{
                  fontStyle: 'italic',
                  color: '#DF5338'
                }}
              >
                Once payment is done please complete the task
              </Typography>
            </div>
          ) : taskDetailData.Task_Type === 'Signature Requested' ? (
            <div style={{ display: 'flex', gap: '5px' }}></div>
          ) : (
            ''
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsPopup;
