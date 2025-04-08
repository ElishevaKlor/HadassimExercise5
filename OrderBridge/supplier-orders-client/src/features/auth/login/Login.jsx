import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "./Form.css";

import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../authApiSlice";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
  const [login, { isError, isSuccess, isLoading, data }] = useLoginMutation()
  const [errorMessage, setErrorMessage] = useState('');
  const { role } = useAuth();

  const navigate = useNavigate()
  useEffect(() => {
    if (isSuccess) {
      if (role === "supplier") {
        navigate("/addgoods");
      } else if (role === "storeManager") {
        navigate("/invatation");
      } else {
        console.error("Unknown role");
      }
    }
  }, [isSuccess, role, navigate]);
  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("ההתחברות נכשלה. בדוק את שם המשתמש והסיסמה.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">התחברות</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <InputText
              id="name"
              placeholder="*שם משתמש"
              {...register("name", { required: "שדה חובה" })}
              className={`p-inputtext ${errors.name ? "p-invalid" : ""}`}
              style={{ textAlign: "right", direction: "rtl" }}
            />
            {errors.name && <small className="p-error">{errors.name.message}</small>}
          </div>

          <div className="form-group">
            <Controller name="password"
              control={control}
              rules={{ required: "שדה חובה" }}
              className={`p-password custom-password ${errors.password ? "p-invalid" : ""}`}
              render={({ field }) => <Password
                placeholder="*סיסמא"
                {...field}
                toggleMask
                feedback={false}
                style={{ textAlign: "right", direction: "rtl" }}
                inputStyle={{ direction: "rtl" }}
              />}
            />
            {errors.password && <small className="p-error">{errors.password.message}</small>}
          </div>
          {errorMessage && <small className="p-error" style={{ display: "block", marginBottom: "1rem" }}>{errorMessage}</small>}
          <Button type="submit" label="התחברות" className="p-button-primary p-mt-3" />
        </form>
      </div>
    </div>
  );
};

export default Login;