import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PrimaryTabPanel } from 'src/ui/Tabs';

function ExpensesNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('meal expense');

  const tabs = [
    { value: 'meal expense', label: 'Meal Expense', link: '/expenses/meal-expense' },
    { value: 'travel expense', label: 'Travel Expense', link: '/expenses/travel-expense' },
    { value: 'site expense', label: 'Site Expense', link: '/expenses/site-expense' },
    { value: 'past expense', label: 'Past Submissions', link: '/expenses/submissions' },
  ];

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.link === location.pathname);
    if (currentTab) {
      setCurrentTab(currentTab.value);
    }
  }, [location.pathname]);

  const handleTabsChange = (event, newValue) => {
    setCurrentTab(newValue);
    const newTab = tabs.find(tab => tab.value === newValue);
    if (newTab) {
      navigate(newTab.link);
    }
  };

  return (
    <PrimaryTabPanel
      tabs={tabs}
      currentTab={currentTab}
      handleTabsChange={handleTabsChange}
    />
  );
}

export default ExpensesNavbar;
