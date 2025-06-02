import React from 'react';
import { CardTitle, ClickText, DetailBox, GreyBox, TitleDescription } from '../components';

const ExpensesCard = () => {
  return (
    <DetailBox>
      <CardTitle
        title="Expenses"
        description="The Expenses section help you to manage reimbursement for your costs."
      />
      <GreyBox sx={{ flexGrow: 1 }}>
        <TitleDescription
          sx={{ mb: 2 }}
          title="Meal Expense"
          description="Use this tab to submit reimbursement requests for meal expenses incurred during your professional activities."
        />
        <TitleDescription
          sx={{ mb: 2 }}
          title="Travel Expense"
          description="Use this tab to request reimbursement for travel-related expenses, ensuring you are compensated for necessary trips"
        />
        <TitleDescription
          title="Site Expense"
          description="Use this tab to submit claims for site-related expenses, making it easier to manage financial reimbursements"
        />
      </GreyBox>
      <ClickText link="/tools/expense" />
    </DetailBox>
  );
};

export default ExpensesCard;
