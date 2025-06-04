import React, { useState } from 'react';
import { Typography, Tooltip, Box, List, ListItem } from '@mui/material';
import { CardTitle,  DetailBox, GreyBox, ListItemSkeleton } from '../components';
import { useMyLearningContext } from 'src/context/MyLearningContext';
import ExplorePlansDialog from 'src/views/Acquisition/MyLearning/dialogs/ExplorePlansDialog';
import RetakeCourseDialog from 'src/views/Acquisition/MyLearning/dialogs/RetakeCourseDialog';
import { courses } from 'src/views/Acquisition/MyLearning/data';
import { CourseProgress } from 'src/views/Acquisition/MyLearning/ui';

const capitalizeWords = (text) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const CourseListItem = ({ title, courseID, courseData, setSelectedCourseID, setIsOrderTypeFullAccess }) => {
  const { handleButtonClick } = useMyLearningContext();
  const {buttonText, progressSummary, order} = courseData;
  const coursePlan = order?.plan || "no_access";
  const isOrderTypeFullAccess = order?.order_type == "Full_Access";
  const { progressPercentage } = progressSummary;

  const currentCourse = courses.find(item => item.id == courseID); // Store static data for course (e.g. images, title, id)

  const handleClick = () => {
    setSelectedCourseID(courseID);
    setIsOrderTypeFullAccess(isOrderTypeFullAccess);
    handleButtonClick(buttonText.toUpperCase(), coursePlan, currentCourse);
  }

  return (
    <ListItem sx={{ p: 0, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', '&:last-child': {mb: 0}}}>
      <Typography style={{ fontSize: '14px', fontWeight: 500, width: '54px' }}>
        {title}
      </Typography>

      <Tooltip arrow followCursor title={`${progressPercentage}% Completed`}>
        <Box sx={{ flexGrow: 1, cursor: 'pointer' }}>
          <CourseProgress percent={progressPercentage}/>
        </Box>
      </Tooltip>

      <Typography onClick={handleClick} style={{ fontSize: '14px', fontWeight: 500, color: '#2872C1', width: '110px', textAlign: 'left', textDecoration: 'underline', cursor: 'pointer' }}>
        {capitalizeWords(buttonText)}
      </Typography>
    </ListItem>
  );
};

const courseArray = [
  { id: 4526, title: 'ACLS' },
  { id: 9985, title: 'BLS' },
  { id: 9238, title: 'PALS' },
  { id: 79132, title: 'NRP' },
  { id: 151904, title: 'ASC CE' },
  { id: 192797, title: 'NIHSS' },
  { id: 11159, title: 'OPIOID' }
];

const CourseDetailsCard = ({ myLearningData, setRefresh }) => {
  const [selectedCourseID, setSelectedCourseID] = useState(null); // Store selected course ID when user clicks on course button
  const [isOrderTypeFullAccess, setIsOrderTypeFullAccess] = useState(false); // Check if order type is Full Access

  // Re-Fetch My Learning Data when Course is Renewed by TeamHealth User
  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  }

  return (
    <DetailBox>
      <CardTitle
        title="Course Details"
        description="Check and analyze information about the courses you have purchased."
        link="/my-learning"
      />
      <GreyBox sx={{ flexGrow: 1 }}>
        {Object.keys(myLearningData).length > 0 ? (
          <List sx={{ padding: 0, flexGrow: 1 }}>
            {courseArray.map(course => (
              <CourseListItem 
                key={course.id}
                title={course.title}
                courseID={course.id}
                courseData={myLearningData[course.id]}
                setSelectedCourseID={setSelectedCourseID}
                setIsOrderTypeFullAccess={setIsOrderTypeFullAccess}
             />
            ))}
          </List>
        ) : (
          <List sx={{ padding: 0, flexGrow: 1 }}>
            {courseArray.map(course => (
              <ListItemSkeleton key={course.id} title={course.title} />
            ))}
          </List>
        )}
      </GreyBox>
      <ExplorePlansDialog fullAccess={isOrderTypeFullAccess}/>
      <RetakeCourseDialog course_id={selectedCourseID} handleRefresh={handleRefresh}/>
    </DetailBox>
  );
};

export default CourseDetailsCard;
