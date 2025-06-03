import React, { useEffect, useState, createContext } from 'react';
import { useSelector } from 'react-redux';
import hospitalsService from 'src/services/hospitalsService';
import StateSpecificCMECervices from 'src/services/stateSpecificCMEService';
import departmentsService from 'src/services/departmentsService';
import { designations, cme_states as states } from '../appConstants';
import { filter, isEqual } from 'lodash';

export const CertificateTypeOptions = [
    { id: '3993767000000315019', name: 'Handtevy Instructor' },
    { id: '3993767000000191723', name: 'CPR' },
    { id: '3993767000000315027', name: 'EMT' },
    { id: '3993767000000315031', name: 'Paramedic' },
    { id: '3993767000000315035', name: 'Registered Nurse' },
    { id: '3993767000000047791', name: 'ACLS' },
    { id: '3993767000000047807', name: 'BLS' },
    { id: '3993767000000047815', name: 'NRP' },
    { id: '3993767000000047799', name: 'PALS' },
    { id: '3993767000000047816', name: 'ASLS' },
    { id: '3993767000000047823', name: 'ATLS' },
    { id: '3993767000000315003', name: 'ACLS Instructor' },
    { id: '3993767000000315007', name: 'PALS Instructor' },
    { id: '3993767000000315011', name: 'BLS Instructor' },
    { id: '3993767000000315015', name: 'ECSI Instructor' },

];
export const ReportFilterContext = createContext({
    departmentList:[],
    selectedDepartments: [],
    selectedStates: [],
    selectedUsers: [],
    selectedProfessions: [],
    selectedCertificateTypes: [],
    loading: false,
    setSelectedDepartments: () => { },
    setSelectedStates: () => { },
    setSelectedUsers: () => { },
    setSelectedProfessions: () => { },
    handleStateChange: () => { },
    handleDepartmentChange: () => { },
    handleProfessionChange: () => { },
    handleEmailChange: () => { },
    handleUserChange: () => { },
    handleCertificateTypeChange: () => { },
    filterDetails: () => [],
    setLoading: () => { },
    errorMsg:null,
    setErrorMsg:() => { },
    filtersStatus:{ },
    byUser:false,
    setByUser:() => { },
});

export const ReportFilterContextProvider = ({ children }) => {

    const user = useSelector((state) => state.account.user);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedStates, setSelectedStates] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedProfessions, setSelectedProfessions] = useState([]);
    const [selectedCertificateTypes, setSelectedCertificateTypes] = useState([]);
    const [hospitalIds, setHospitalIds] = useState([]);
    const [allDepartment, setAllDepartments] = useState([]);
    const [departmentList, setDepartmentsList] = useState([]);
    const [userOptions, setOptions] = useState([]);
    const [professionOptions, setProfessionOptions] = useState(designations);
    const [certificateTypeOptions, setCertificateTypeOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [filterDetails, setFilterDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [byUser, setByUser] = useState(false);
    const [apiCalled, setApiCalled] = useState(false);
    const [filtersStatus, setFilterStatus]=useState({
        state:false,
        department:false,
        user:false,
        profession:false,
        certType:false,
        filtersChanged:false
    })

    useEffect(() => {
        if (!user) return; // Skip if no user ID is present
        // Check if all filters are selected
        const areAllFiltersSelected = selectedDepartments.length > 0 && 
                                      selectedStates.length > 0 && 
                                      selectedCertificateTypes.length > 0 && 
                                      selectedUsers.length > 0;

        // Call the API only if filters are selected and it hasn't been called before
        if (areAllFiltersSelected && !apiCalled) {
            const generateReport = async () => {
                try {
                    let payload = {
                        states_list: [],
                        users_list: [],
                        department_list: selectedDepartments.map(dep=>dep.id),
                        all_states: true,
                        all_users: true
                      };
                    await StateSpecificCMECervices.GenerateTeamCMEReport(payload); // Replace with your actual API call
                    setApiCalled(true);  // Mark API as called
                } catch (error) {
                    console.error('Error generating CME report:', error);
                }
            };

            generateReport(); // Trigger API call
        }
    }, [selectedDepartments, selectedStates, selectedCertificateTypes, selectedUsers, apiCalled]); // Dependencies to track changes


    React.useEffect(() => {
        setLoading(true)
        getHospitalIds();
        setProfessionOptions([...designations].sort((a, b) => a.name.localeCompare(b.name)));
        setCertificateTypeOptions([...CertificateTypeOptions].sort((a, b) => a.name.localeCompare(b.name)));
        setLoading(false)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return; // Skip if no user ID is present
            await getDepartments();
        };
        if (hospitalIds.length > 0) fetchData();
    }, [hospitalIds]);

   
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return; // Skip if no user ID is present
            await getUsers();
        };
        if (selectedDepartments.length > 0) fetchData();
    }, [selectedDepartments, hospitalIds]);


    const getHospitalIds = async () => {
        try {
            if (!user) return; // Skip if no user ID is present
            const ids = await hospitalsService.getAdminHospitals();
            setHospitalIds(ids);
        } catch (error) {
            console.error("Failed to fetch hospital IDs:", error);
        }
    };

    const getDepartments = async () => {
        try {
            if (!user) return; // Skip if no user ID is present
            setLoading(true)
            const res = await departmentsService.getDepartmentsTeamCmeCompliance(hospitalIds);
            setDepartmentsList(user.role === 'department_admin' ? [res[0]] : res.sort((a, b) => a.name - b.name));
            if(user.role == 'department_admin') {
                setSelectedDepartments([res[0]]);
                setLoading(true)
                const payload = { hospitalIDs: [], deptIDs: [res[0].id] };
                const users = await StateSpecificCMECervices.GetUsers(payload);
                setOptions(
                    users
                      .sort((a, b) => {
                        const nameA = (a.last_name || "").concat(a.first_name || "");
                        const nameB = (b.last_name || "").concat(b.first_name || "");
                        return nameA.localeCompare(nameB);
                      }) || []
                  );
                setLoading(false)
                
            }setSelectedDepartments(res);
            const departmentIds = res.map((item) => item.id);

            setAllDepartments((prev) =>
                user.role === 'department_admin' ? [departmentIds[0]] : [departmentIds]
            );
            setLoading(false)
        } catch (error) {
            console.error("Error getting Deaprtments: ", error)
        }
    };

    const getUsers = async () => {
        try {
            if (!user) return; // Skip if no user ID is present
            setLoading(true);
            let payload = { hospitalIDs: hospitalIds, deptIDs: selectedDepartments.map(it => it.id), designationIDs: selectedProfessions.map(prof => prof.id) };
            if (selectedDepartments.length == 1 && selectedDepartments[0].id == "-1") {
                payload.hospitalIDs=[hospitalIds[0]]
            }
            
            const users = await StateSpecificCMECervices.GetUsers(payload);
            setOptions(
                users
                  .sort((a, b) => {
                    const nameA = (a.last_name || "").concat(a.first_name || "");
                    const nameB = (b.last_name || "").concat(b.first_name || "");
                    return nameA.localeCompare(nameB);
                  }) || []
              );
              handleUserChange(null,users)
            setLoading(false)

        } catch (error) {
            console.log(error);
        }
    };

    const handleStateChange = (event, newValue) => {
        const allSelected = newValue.some((option) => option.id === 'all');
        const updatedStates = allSelected ? states : newValue.filter((option) => option.id !== 'all');
        sessionStorage.setItem('selected_states', JSON.stringify(updatedStates));
        setSelectedStates(updatedStates);
    };

    const handleDepartmentChange = (event, newValue) => {
        const allSelected = newValue?.some((option) => option.id === 'all');
        const updatedDepartments = allSelected ? departmentList : newValue;
        if (!isEqual(updatedDepartments, selectedDepartments)) {
            setSelectedDepartments(updatedDepartments);
        } else if (allSelected) {
            setSelectedDepartments([]);
        }
    };

    const handleUserChange = (event, newValue) => {
        const allSelected = newValue.some((option) => option.id === 'all');
        const updatedUsers = allSelected ? userOptions : newValue;
        if (!isEqual(updatedUsers, selectedUsers)) {
            setSelectedUsers(updatedUsers);
        } else if (selectedUsers.length == userOptions.length && allSelected) {
            setSelectedUsers([]);
        }
    };

    const handleProfessionChange = (event, newValue) => {
        const allSelected = newValue.some((option) => option.id === 'all');
        const updatedProf = allSelected ? professionOptions : newValue;
        if (!isEqual(updatedProf, selectedProfessions)) {
            setSelectedProfessions(updatedProf);
        } else if (selectedProfessions.length == designations.length && allSelected) {
            setSelectedProfessions([]);
        }
    };

    const handleCertificateTypeChange = (event, newValue) => {
        const allSelected = newValue.some((option) => option.id === 'all');
        const updatedCertTypes = allSelected ? certificateTypeOptions : newValue;
        if (!isEqual(updatedCertTypes, selectedCertificateTypes)) {
            setSelectedCertificateTypes(updatedCertTypes);
        } else if (selectedProfessions.length == CertificateTypeOptions.length && allSelected) {
            setSelectedProfessions([]);
        }
    };

    const handleEmailChange = (value) => setInputValue(value);

    const generateFilterDetails = () => {
        setFilterDetails([
            { label: 'Groups', value: selectedDepartments.length > 0 ? selectedDepartments.map(item => item.name).join(', ') : 'N/A' },
            { label: 'Profession', value: selectedProfessions.length > 0 ? selectedProfessions.map(item => item.name).join(', ') : 'N/A' },  // You can add profession mapping if needed
            { label: 'Users', value: selectedUsers.length > 0 ? selectedUsers.map(item => item.first_name + ' ' + item.last_name).join(', ') : 'N/A' },
            { label: 'Geography', value: selectedStates.length > 0 ? selectedStates.map(item => item.name).join(', ') : 'N/A' }
        ]);
    };

    useEffect(() => {
        if (!user) return; // Skip if no user ID is present
        generateFilterDetails();
        
        if (selectedDepartments.length === 0 || (selectedDepartments.length === 1 && selectedDepartments[0].id === "-1")) {
            setErrorMsg("Select group");
        } else if (selectedStates.length === 0 || (selectedStates.length === 1 && selectedStates[0].id === "-1")) {
            setErrorMsg("Select geographical area");
        } else if ( selectedCertificateTypes.length === 0 || (selectedCertificateTypes.length === 1 && selectedCertificateTypes[0].id === "-1")) {
            setErrorMsg("Select certificate type");
        } else if (selectedUsers.length === 0 || (selectedUsers.length === 1 && selectedUsers[0].id === "-1")) {
            setErrorMsg("Select at least one user");
        } else {
            setErrorMsg(null);
        }
    
        let filterSt = { ...filtersStatus };
    
        filterSt.user = selectedUsers.length > 0;
        filterSt.state = selectedStates.length > 0;
        filterSt.department = selectedDepartments.length > 0;
        filterSt.certType = selectedCertificateTypes.length > 0;
    
        setFilterStatus(filterSt);
    }, [selectedDepartments, selectedStates, selectedUsers, selectedProfessions, selectedCertificateTypes]);
    

    const defaultContext = {
        departmentList,
        selectedDepartments,
        selectedStates,
        selectedUsers,
        selectedProfessions,
        selectedCertificateTypes,
        setSelectedDepartments,
        setSelectedStates,
        setSelectedUsers,
        setSelectedProfessions,
        setSelectedCertificateTypes,
        handleStateChange,
        handleDepartmentChange,
        handleProfessionChange,
        handleEmailChange,
        handleCertificateTypeChange,
        userOptions,
        userInputValue: inputValue,
        setUserInputValue: setInputValue,
        professionOptions,
        certificateTypeOptions,
        handleUserChange,
        filterDetails,
        setLoading,
        loading,
        errorMsg,
        setErrorMsg,
        filtersStatus,
        byUser, 
        setByUser
    };

    return (
        <ReportFilterContext.Provider value={defaultContext}>
            {children}
        </ReportFilterContext.Provider>
    );
};
