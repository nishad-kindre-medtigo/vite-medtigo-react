import { Box, Typography, Grid, Paper, Button, IconButton, Link } from '@mui/material'
import React from 'react'
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useLearningContext } from 'src/context/LearningContext';
import useBreakpoints from 'src/hooks/useBreakpoints';

function CourseSyllabus() {
    const { userPlans } = useLearningContext();
    const { isMobile } = useBreakpoints();
    React.useEffect(() => {
    }, [userPlans])

    const syllabusItems = [
    {
        course:'ACLS',
        locked:userPlans.acls == null,
        thumbnail: '/images/syllabi/ACLS_SYLLABUS_THUMBNAIL.png',
        downloadLink: 'https://connect.medtigo.com/SyllabusView/ACLSCourse.pdf',
    },
    {
        course:'BLS',
        locked:userPlans.bls == null,
        thumbnail: '/images/syllabi/BLS_SYLLABUS_THUMBNAIL.png',
        downloadLink: 'https://connect.medtigo.com/SyllabusView/BLSCourse.pdf',
    },
    {
        course:'PALS',
        locked:userPlans.pals == null,
        thumbnail: '/images/syllabi/PALS_SYLLABUS_THUMBNAIL.png',
        downloadLink: 'https://connect.medtigo.com/SyllabusView/PALSCourse.pdf',
    },
    // {
    //     course:'NRP',
    //     thumbnail: '/images/syllabi/NRP_SYLLABUS_THUMBNAIL.png',
    //     downloadLink: '/syllabusReader/NRP',
    // },
    // {
    //     course:'NIHSS',
    //     thumbnail: '/images/syllabi/NIHSS_SYLLABUS_THUMBNAIL.png',
    //     downloadLink: '/syllabusReader/NIHSS',
    // },
    // {
    //     course:'ASC_CE',
    //     thumbnail: '/images/syllabi/ASC_CE_SYLLABUS_THUMBNAIL.png',
    //     downloadLink: '/syllabusReader/ASLS',
    // },
    // {
    //     course:'OPIOID',
    //     thumbnail: '/images/syllabi/OPIOID_SYLLABUS_THUMBNAIL.png',
    //     downloadLink: '/syllabusReader/ACLS',
    // },
    ];

    return (
        <Box pt={1} mb={4}>
            <Link
                style={{ padding: '0', textDecoration: 'none', color: '#2872C1' }}
                to={{
                    pathname: '/my-learning',
                }}
            >
                <Box display={'flex'} flexDirection={'row'} alignContent={'center'} alignItems={'center'} >
                    <IconButton disableRipple sx={{ m: 0, p:0 }} >
                        <ArrowBackIosIcon fontSize='small' sx={{ color: '#2872C1' }} />
                    </IconButton>
                    <Typography style={{ color: '#2872C1', fontSize: '18px', fontWeight: '600' }}> Back To Courses</Typography>
                </Box>
            </Link>
            <Typography mt={1} textAlign={'center'} variant={isMobile?'h6':"h4"} fontWeight="medium" gutterBottom>
                Download Course Syllabus
            </Typography>
            <Grid
                container
                spacing={2}
                display="flex"
                flexWrap="wrap"
                justifyContent="space-evenly"
                mb={2}
            >
                {syllabusItems.map((item, index) => (
                    !item.locked &&
                    <Grid key={index} flex minWidth={250} m={1} alignItems={'baseline'} justifyContent={'center'} display="flex" >
                        <Paper
                            elevation={2}
                            sx={{
                                p: 1,
                                height: '380px',
                                width: '250px',
                                // mx: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-evenly',
                            }}
                        >
                            <Box
                                component="img"
                                src={item.thumbnail} // replace with actual image path
                                alt={item}
                                sx={{
                                    width: '70%',
                                    height: '70%',
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                }}
                            />
                            <Box >
                                <a href={item.downloadLink} target='_blank' rel='noreferrer' download="syllabus.pdf">
                                <Button
                                    style={{
                                        padding: '8px 40px',
                                        marginTop: '0px',
                                        backgroundColor: '#1976d2',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                    // onClick={() => {
                                    //     window.open(item.downloadLink, '_blank');
                                    // }}  
                                    startIcon={<DownloadIcon />}
                                >
                                    Download
                                </Button>
                                </a>
                            </Box>
                        </Paper>

                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default CourseSyllabus;
