import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

function SyllabusReader({ syllabusName }) {
  const syllabusMap = {
    ACLS: 'https://connect.medtigo.com/SyllabusView/ACLSCourse.pdf',
    BLS: 'https://connect.medtigo.com/SyllabusView/BLSCourse.pdf',
    PALS: 'https://connect.medtigo.com/SyllabusView/PALSCourse.pdf'
  };

  const pdfUrl = syllabusMap[syllabusName];

  return (
    <Box height={'90vh'}>
      {pdfUrl ? (
        <object data={pdfUrl} type="application/pdf" width="100%" height="100%">
          <p>
            PDF not supported.
            <a href={pdfUrl}>Click here to view the PDF</a>
          </p>
        </object>
      ) : (
        <b>No syllabus available for {syllabusName}.</b>
      )}
    </Box>
  );
}

SyllabusReader.propTypes = {
  syllabusName: PropTypes.string.isRequired
};

export default SyllabusReader;
