import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Filters from './filters';
import { cme_states as states } from '../../../appConstants';
// import useBreakpoints from 'src/hooks/useBreakpoints';
// import hospitalsService from 'src/services/hospitalsService';
// import StateSpecificCMECervices from 'src/services/stateSpecificCMEService';
// import departmentsService from 'src/services/departmentsService';
import { ReportFilterContext } from 'src/context/ReportFilterContext';
import { Button } from '@mui/material';

const FilterPane = ({ currentTab, GenerateReport }) => {

    // Redux and Snackbar
    const { user } = useSelector((state) => state.account);
    const {
        selectedDepartments,
        selectedStates,
        selectedUsers,
        selectedProfessions,
        selectedCertificateTypes,
        handleStateChange,
        handleDepartmentChange,
        handleProfessionChange,
        handleCertificateTypeChange,
        certificateTypeOptions,
        handleUserChange,
        handleEmailChange,
        departmentList,
        userOptions,
        userInputValue,
        professionOptions,
        loading,
        setErrorMsg
    } = React.useContext(ReportFilterContext)

    return (
        <>
        <Filters
            loading={loading}
            currentTab={currentTab}
            role={user?user.role:'department_admin'}
            onStateChange={handleStateChange}
            onDepartmentChange={handleDepartmentChange}
            onProfessionChange={handleProfessionChange}
            selectedStates={selectedStates}
            isAllSelected={false}
            stateOptions={states}
            departmentList={departmentList}
            selectedDepartments={selectedDepartments}
            selectedProfessions={selectedProfessions}
            userOptions={userOptions}
            professionOptions={professionOptions}
            userInputValue={userInputValue}
            selectedUsers={selectedUsers}
            onUserChange={handleUserChange}
            onCertificateTypeChange={handleCertificateTypeChange}
            selectedCertificateTypes={selectedCertificateTypes}
            certificateTypeOptions={certificateTypeOptions}
            GenerateReport={()=>GenerateReport()}
        />
        </>
    );
};

export default FilterPane;
