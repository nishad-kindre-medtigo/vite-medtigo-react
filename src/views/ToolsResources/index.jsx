import React, { useState, useEffect } from 'react';
import { Menu, MenuItem } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Page from '../../components/Page';
import SendForSignatureComponent from '../esign/SendForSignatureComponent';
import VaultPage from './Vault';
import MealsExpenseForm from '../new_expenses/pages/MealExpense';
import TravelExpenseForm from '../new_expenses/pages/TravelExpense';
import SiteExpenseForm from '../new_expenses/pages/SiteExpense';
import ExpensePage from '../new_expenses/pages/ExpensesSubmissionPopUp';
import { CustomToolbar, StyledTabs, StyledTab } from '../../ui/Tabs';

const ToolsAndResourcesSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scheduling , showEsign} = useSelector(state => state.account.user);
  const [currentTab, setCurrentTab] = useState('/esign');
  const [dropdownValue, setDropdownValue] = useState('mealExpense');
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleTabsChange = (event, newValue) => {
    if(currentTab !== newValue){
      setCurrentTab(newValue);
      navigate(`/tools/${newValue}`);
    }
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = (value) => {
    if (value) {
      setDropdownValue(value);
      setCurrentTab('expense');
    }
    setMenuAnchor(null);
  };

  const dropdownLabels = {
    mealExpense: 'MEAL EXPENSE',
    travelExpense: 'TRAVEL EXPENSE',
    siteExpense: 'SITE EXPENSE',
    pastSubmissions: 'PAST SUBMISSIONS',
  };

  const navConfig = [
    { value: 'vault', label: 'VAULT', component: <VaultPage /> },
  ];

  if (showEsign) {
    navConfig.push(  { value: 'esign', label: 'E-SIGN', component: <SendForSignatureComponent /> }, );
  }
  const dropdownComponents = {
    mealExpense: <MealsExpenseForm />,
    travelExpense: <TravelExpenseForm />,
    siteExpense: <SiteExpenseForm />,
    pastSubmissions: <ExpensePage />,
  };

  const currentComponent =
    currentTab === 'expense'
      ? dropdownComponents[dropdownValue]
      : navConfig.find((tab) => tab.value === currentTab)?.component;

  useEffect(() => {
    const currentPath = location.pathname.split('/').pop();
    if (currentPath !== currentTab) setCurrentTab(currentPath);
  }, [location.pathname]);

  return (
    <Page title="Tools & Resource">
      <CustomToolbar>
        <StyledTabs
          value={currentTab}
          onChange={handleTabsChange}
          textColor="secondary"
          variant="scrollable"
          scrollButtons={false}
        >
          {navConfig.map(tab => (
            <StyledTab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              disableRipple
            />
          ))}
          {scheduling && (
            <StyledTab
              value="expense"
              disableRipple
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {dropdownLabels[dropdownValue]}
                  <ArrowDropDownRoundedIcon fontSize="large" />
                </div>
              }
              onClick={handleMenuOpen}
            />
          )}
        </StyledTabs>
      </CustomToolbar>
      {/* Dropdown Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => handleMenuClose(null)}
        keepMounted
      >
        <MenuItem onClick={() => handleMenuClose('mealExpense')}>MEAL EXPENSE</MenuItem>
        <MenuItem onClick={() => handleMenuClose('travelExpense')}>TRAVEL EXPENSE</MenuItem>
        <MenuItem onClick={() => handleMenuClose('siteExpense')}>SITE EXPENSE</MenuItem>
        <MenuItem onClick={() => handleMenuClose('pastSubmissions')}>PAST SUBMISSIONS</MenuItem>
      </Menu>
      <div style={{ minHeight: '60vh', marginBottom: '24px' }}>{currentComponent}</div>
    </Page>
  );
};

export default ToolsAndResourcesSection;
