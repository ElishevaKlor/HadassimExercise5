import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { useAddSupplierMutation } from "./supplierApiSlice";
import { useAddStoreManagerMutation } from "./storeManagerApiSlice";
import { useNavigate } from "react-router-dom";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "../auth/login/Form.css";
import "./SignUp.css"
const SignUp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, control, setValue, setError, clearErrors, formState: { errors } } = useForm();
    const [isAdmin, setIsAdmin] = useState(false);
    const [addSupplier, { isError: supplierError, isLoading: supplierLoading, isSuccess: supplierSuccess }] = useAddSupplierMutation();
    const [addStoreManager, { isError: storeManagerError, isLoading: storeManagerLoading, isSuccess: storeManagerSuccess }] = useAddStoreManagerMutation();
    const onSubmit = (data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        if (isAdmin) {
            addStoreManager(formData);
        } else {
            addSupplier(formData);
        }
    };
    useEffect(() => {
        if (supplierSuccess || storeManagerSuccess) navigate("/login");
    }, [supplierSuccess, storeManagerSuccess, navigate]);

    const handleAdminChange = (e) => {
        setIsAdmin(e.checked);
        setValue("isAdmin", e.checked);
        if (e.checked) {
            clearErrors("company");  
        }
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <h2 className="form-title">הרשמה</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <InputText
                            id="representativeName"
                            placeholder="*שם"
                            {...register("representativeName", { required:  "שדה חובה" })}
                            className={`p-inputtext ${errors.representativeName ? "p-invalid" : ""}`}
                            style={{ textAlign: "right", direction: "rtl" }}
                        />
                        {errors.representativeName && <small className="p-error">{errors.representativeName.message}</small>}
                    </div>
                    <div className="form-group">
                        <InputText
                            id="company"
                            placeholder={isAdmin ? "חברה" : "*חברה"}
                            {...register("company", { required: isAdmin ? false : "שדה חובה" })}
                            className={`p-inputtext ${errors.company ? "p-invalid" : ""}`}
                            style={{ textAlign: "right", direction: "rtl" }}
                        />
                        {errors.company && !isAdmin && <small className="p-error">{errors.company.message}</small>}
                    </div>
                    <div className="form-group">
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: "שדה חובה" }}
                            render={({ field }) => (
                                <Password className="p-icon-field-right"
                                    {...field}
                                    style={{ textAlign: "right", direction: "rtl" }}
                                    inputStyle={{ direction: "rtl" }}
                                    placeholder="*סיסמא"
                                    toggleMask
                                    feedback={false}
                                    inputClassName="password-input"
                                />
                            )}
                        />
                        {errors.password && <small className="p-error">{errors.password.message}</small>}
                    </div>
                    <div className="form-group">
                        <InputText
                            id="phone"
                            placeholder="*טלפון"
                            {...register("phone", { required: "שדה חובה" })}
                            className={`p-inputtext ${errors.phone ? "p-invalid" : ""}`}
                            style={{ textAlign: "right", direction: "rtl" }}
                        />
                        {errors.phone && <small className="p-error">{errors.phone.message}</small>}
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', justifyContent: 'flex-end' }}>
                    <Checkbox
                            className="p-checkbox"
                            inputId="isAdmin"
                            onChange={handleAdminChange}
                            checked={isAdmin}
                            style={{ marginLeft: '8px' }}
                        />
                        <label htmlFor="isAdmin" className="p-checkbox-label" style={{ textAlign: 'right' }}>הרשם כמנהל</label>
                       
                    </div>
                    {isAdmin && (
                        <div className="form-group">
                            <Controller
                                name="adminCode"
                                control={control}
                                rules={{ required: "שדה חובה"}}
                                render={({ field }) => (
                                    <Password
                                        placeholder="*קוד מנהל"
                                        {...field}
                                        toggleMask
                                        feedback={false}
                                        style={{ textAlign: "right", direction: "rtl" }} 
                                    />
                                )}
                            />
                            {errors.adminCode && <small className="p-error">{errors.adminCode.message}</small>}
                        </div>
                    )}
                    <Button type="submit" label="הרשמה" className="p-button-primary p-mt-3" disabled={supplierLoading || storeManagerLoading} />
                    {(supplierError || storeManagerError) && <small className="p-error">הרשמה נכשלה</small>}
                </form>
            </div>
        </div>
    );
};

export default SignUp;

