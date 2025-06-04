import React from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Stack, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import { login } from "src/actions/accountActions";
import useBreakpoints from "src/hooks/useBreakpoints";
import encrypt from "src/utils/encrypt";

function LoginForm({ onSubmitSuccess, ...rest }) {
  const { isMobile } = useBreakpoints();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      try {
        const encryptedPassword = encrypt(values.password);
        const encryptedEmail = encrypt(values.email);

        await dispatch(login(encryptedEmail, encryptedPassword, isMobile));
        onSubmitSuccess();
      } catch (error) {
        const message = error || "Something went wrong";
        setStatus({ success: false });
        setErrors({ submit: message });
        setSubmitting(false);
      }
    },
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit} {...rest}>
      <Stack spacing={2}>
        <div>
          <Typography>Email Address*</Typography>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            className="form-control"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: `1px solid ${
                formik.touched.email && formik.errors.email ? "#f44336" : "#ccc"
              }`,
            }}
          />
          {formik.touched.email && formik.errors.email && (
            <Typography variant="body2" color="error" mt={1}>
              {formik.errors.email}
            </Typography>
          )}
        </div>

        <div>
          <Typography>Password*</Typography>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="•••••••••"
            className="form-control"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: `1px solid ${
                formik.touched.password && formik.errors.password
                  ? "#f44336"
                  : "#ccc"
              }`,
            }}
          />
          {formik.touched.password && formik.errors.password && (
            <Typography variant="body2" color="error" mt={1}>
              {formik.errors.password}
            </Typography>
          )}
        </div>

        {formik.errors.submit && (
          <Typography variant="body2" color="error">
            {formik.errors.submit}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "SUBMITTING..." : "SIGN IN"}
        </Button>
      </Stack>
    </form>
  );
}

export default LoginForm;
