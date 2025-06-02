import React from 'react';
import { TabsContainer, StyledTabs, StyledTab } from './StyledComponents';

const Header = ({ tabs, setTab }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTab(tabs[newValue]);
    setValue(newValue);
  };

  return (
    <TabsContainer>
      <StyledTabs value={value} onChange={handleChange} TabIndicatorProps={{ style: { display: 'none' } }}>
        {tabs.map((tab, index) => (
          <StyledTab key={index} label={tab.toUpperCase()} />
        ))}
      </StyledTabs>
    </TabsContainer>
  );
};

export default Header;
