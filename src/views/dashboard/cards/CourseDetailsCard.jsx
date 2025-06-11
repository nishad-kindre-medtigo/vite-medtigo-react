import React, { useState } from 'react';
import { List, ListItem } from '@mui/material';
import { CardTitle,  DetailBox, GreyBox, ListItemSkeleton, CourseName, CoursePercentage, ActionButton } from '../components';
import { useMyLearningContext } from 'src/context/MyLearningContext';
import ExplorePlansDialog from 'src/views/Acquisition/MyLearning/dialogs/ExplorePlansDialog';
import RetakeCourseDialog from 'src/views/Acquisition/MyLearning/dialogs/RetakeCourseDialog';
import { courses } from 'src/views/Acquisition/MyLearning/data';

const CourseListItem = ({ title, courseID, courseData, setSelectedCourseID, setIsOrderTypeFullAccess }) => {
  const { handleButtonClick } = useMyLearningContext();
  const {buttonText, progressSummary, order} = courseData;
  const coursePlan = order?.plan || "no_access";
  const isOrderTypeFullAccess = order?.order_type == "Full_Access";
  const { progressPercentage } = progressSummary;

  const currentCourse = courses.find(item => item.id == courseID); // Store static data for course (e.g. images, title, id)
  
  const disableActionButton = courseID === 130360 && buttonText === "RENEW";

  const handleClick = () => {
    setSelectedCourseID(courseID);
    setIsOrderTypeFullAccess(isOrderTypeFullAccess);
    handleButtonClick(buttonText.toUpperCase(), coursePlan, currentCourse);
  }

  return (
    <ListItem sx={{ p: 0, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, '&:last-child': {mb: 0}}}>
      <CourseName title={title} />
      <CoursePercentage percent={progressPercentage} />
      <ActionButton buttonText={buttonText} onClick={handleClick} disabled={disableActionButton} />
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
  { id: 11159, title: 'OPIOID' },
  { id: 130360, title: 'ECG' }
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
          <List sx={{ p: 0, flexGrow: 1 }}>
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
          <List sx={{ p: 0, flexGrow: 1 }}>
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
