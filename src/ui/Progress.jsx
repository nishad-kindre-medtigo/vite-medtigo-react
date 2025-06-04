import React from "react";
import { CircularProgress } from "@mui/material";

export function GradientCircularProgress() {
  return <CircularProgress />;
}

export function Loader({
  color = "white",
  width = "50",
}) {
  return <CircularProgress size={parseInt(width)} color={color} />;
}
