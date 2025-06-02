import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import { formatLicenseTaskName } from '../utils';
import { TaskCard, TaskType, TaskDivider, TaskSubmittedText, TaskNoteMarkdown } from '../ui';

const UpdatesCard = props => {
  const { data, setOpenDetailTaskDialog, setTaskDetailData } = props;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // FETCH TASK ID FROM URL
  const updateID = queryParams.get('note_id');

  const isURLTask = data.id == updateID;

  const isTaskSubmitted = data.taskSubmitted === 1;
  const taskNote = data.Certificate_Note.trim();
  const truncatedNote =
    taskNote.length > 38
      ? taskNote.slice(0, 38)
      : taskNote;

  // Handle Note View More Click
  const handleViewMore = () => {
    setOpenDetailTaskDialog(true);
    setTaskDetailData({
      type: "Note",
      note: data.Certificate_Note,
      addedBy: data.AddedByName,
      assignedDate: data.Notes_Date,
      comment: data.comment,
      Task_Type: data.Task_Type,
      Attachment_File_Name: "View File",
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
      <TaskType type="Updates" taskType="Certificate Note Added" noChat={true} />
        
      <TaskDivider />

      {/* TASK DETAILS */}
      <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
        {formatLicenseTaskName(data)}
      </Typography>
      <TaskNoteMarkdown truncatedNote={truncatedNote} handleViewMore={handleViewMore} />

      {/* TASK SUBMISSION TEXT */}
      {isTaskSubmitted ? <TaskSubmittedText taskType={data.Task_Type} /> : null}
    </TaskCard>
  );
};

export default UpdatesCard;
