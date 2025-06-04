import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Button, Box } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PasswordContainer from 'src/views/ToolsResources/Vault/components/PasswordContainer';
import passwordManagerServices from 'src/services/passwordManagerService';
import { useSelector } from 'react-redux';

const VaultPage = () => {
  const {id: userID} = useSelector((state) => state.account.user);
  const [openVaultDialog, setOpenVaultDialog] = useState(false);
  const [passwords, setPasswords] = useState([]); // State to store passwords
  const [refresh, setRefresh] = useState(false);
  const [vaultLoading, setVaultLoading] = useState(true); // State to manage loading

  const [vaultOptions, setVaultOptions] = useState([]); // State to store search options
  const [vaultSearch, setVaultSearch] = useState('All'); // State to store search text

  useEffect(() => {
    const fetchPasswords = async () => {
      setVaultLoading(true); // Set loading to true before fetching
      try {
        const {
          data,
          searchOptions
        } = await passwordManagerServices.getPasswords(userID, vaultSearch);
        setPasswords(data.reverse());
        setVaultOptions(searchOptions);
      } catch (error) {
        console.error('Error fetching passwords:', error);
      } finally {
        setVaultLoading(false); // Set loading to false after fetching
      }
    };

    fetchPasswords(); // Fetch passwords based on userID and vaultSearch
  }, [refresh, vaultSearch]); // Fetch passwords when refresh state changes

  const VaultHeader = React.memo(() => {
    return (
      <Box
        mt={3}
        mb={2}
        sx={{
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          gap: 3
        }}
      >
        <Autocomplete
          value={vaultSearch || null}
          onChange={(event, newValue) => setVaultSearch(newValue || 'All')}
          options={['All', 'Generic', ...vaultOptions] || []}
          disabled={passwords.length === 0}
          renderInput={params => (
            <TextField
              {...params}
              size="small"
              label="Search By License"
              placeholder="Search By License"
              variant="outlined"
              style={{ flexGrow: 1 }}
            />
          )}
          style={{ width: '250px'}}
          getOptionLabel={option => option || ''}
          isOptionEqualToValue={(option, value) => option === value}
          noOptionsText="No options available"
        />
        <Button
          variant="contained"
          style={{ minWidth: '120px', background: '#2872C1', color: '#fff' }}
          onClick={() => setOpenVaultDialog(true)}
        >
          <AddRoundedIcon color="#fff" />
          Add Site
        </Button>
      </Box>
    );
  });
  return (
    <>
      <VaultHeader />
      <PasswordContainer
        loading={vaultLoading}
        passwords={passwords}
        open={openVaultDialog}
        onClose={() => setOpenVaultDialog(false)}
        setRefresh={setRefresh}
      />
    </>
  );
};

export default VaultPage;
