import { Typography } from '@mui/material';
import React from 'react'
import { useLocation } from 'react-router-dom';

function MultiUserMultiState() {
    const location = useLocation();
    const data = location.state?.data;
    return (
        <><PageNav/></>
    )
}

const PageNav=({UserName})=>{
    return(<Typography>{'<'} {UserName}</Typography>)
}


export default MultiUserMultiState
