import * as React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Check from "@mui/icons-material/Check";

const steps = [
  { id: 1001, label: "Fetching User Certificates" },
  { id: 1002, label: "Fetching State Requirements Details" },
  { id: 1003, label: "Fetching User Details" },
  { id: 1004, label: "Preparing Report" },
];

const StyledStepper = styled(Stepper)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  "& .MuiStepConnector-line": {
    borderColor: "#1976d2",
  },
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepIcon-root": {
    color: "#bdbdbd",
  },
  "& .MuiStepIcon-root.Mui-active": {
    color: "#1976d2",
  },
  "& .MuiStepIcon-root.Mui-completed": {
    color: "#2e7d32",
  },
  "& .MuiStepLabel-label": {
    fontSize: "0.95rem",
    fontWeight: 500,
    color: theme.palette.text.secondary,
    transition: "color 0.3s ease-in-out",
  },
  "& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed": {
    color: theme.palette.text.primary,
  },
}));

export default function ProgressStepper({ step, status }) {
        return (
          <StyledStepper activeStep={steps.findIndex((s) => s.id === step)} alternativeLabel>
            {steps.map((item, index) => (
              <Step key={item.id}>
                <StyledStepLabel
                  StepIconComponent={(props) =>
                    (step === item.id) ? (
                      <CircularProgress size={20} color="primary" />
                    ) : step > item.id ? (
                      <Check color="primary" />
                    ) : (
                      props.icon
                    )
                  }
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: step >= item.id ? 600 : 400,
                      color: step >= item.id ? "text.primary" : "lightGray",
                      transition: "color 0.3s ease-in-out",
                    }}
                  >
                    {item.label}
                  </Typography>
                </StyledStepLabel>
              </Step>
            ))}
          </StyledStepper>
        );
}
