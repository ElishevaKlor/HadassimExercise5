import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useAddGoodsMutation } from "../GoodsApiSlice";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import NavBar from "./NavBar";

const AddGoods = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [addGoods, { isLoading, isSuccess, isError }] = useAddGoodsMutation();
  const toast = useRef(null);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
    });

    if (data.imgUrl && data.imgUrl[0]) {
      formData.append('imgUrl', data.imgUrl[0]);
    }

    try {
      await addGoods(formData).unwrap();
    } catch (err) {
      const message = err?.data?.message || "שגיאה לא ידועה בהוספת מוצר";
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: 'success',
        summary: 'המוצר נוסף בהצלחה',
        detail: 'המוצר נוסף בהצלחה למערכת.',
        life: 3000,
      });
      reset(); 
    }

    if (isError) {
      toast.current.show({
        severity: 'error',
        summary: 'שגיאה בהוספת מוצר',
        detail: 'אירעה שגיאה בהוספת המוצר, אנא נסה שוב.',
        life: 3000,
      });
    }
  }, [isSuccess, isError, reset]);

  return (
    <div className="form-container" style={{ paddingTop: "50px" }}>
      <NavBar />
      <div className="form-card">
        <h2 className="form-title">הוספת מוצר</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <InputText
              id="productName"
              placeholder="*שם מוצר"
              {...register("productName", { required: "שדה חובה" })}
              className={`p-inputtext ${errors.productName ? "p-invalid" : ""}`}
              style={{ textAlign: "right", direction: "rtl" }}
            />
            {errors.productName && <small className="p-error">{errors.productName.message}</small>}
          </div>
          <div className="form-group">
            <InputText
              id="price"
              placeholder="*מחיר"
              type="text"
              {...register("price", {
                required: "שדה חובה",
                pattern: {
                  value: /^[0-9]*\.?[0-9]+$/,
                  message: "יש להזין מספר תקין (שלם או עשרוני)"
                }
              })}
              className={`p-inputtext ${errors.price ? "p-invalid" : ""}`}
              style={{ textAlign: "right", direction: "rtl" }}
            />

            {errors.price && <small className="p-error">{errors.price.message}</small>}
          </div>
          <div className="form-group">
            <InputText
              id="minQuantity"
              placeholder="*כמות מינימלית"
              type="text"
              {...register("minQuantity", { required: "שדה חובה" })}
              className={`p-inputtext ${errors.minQuantity ? "p-invalid" : ""}`}
              style={{ textAlign: "right", direction: "rtl" }}
            />
            {errors.minQuantity && <small className="p-error">{errors.minQuantity.message}</small>}
          </div>
          <Button type="submit" label="הוספת מוצר" className="p-button-primary p-mt-3" disabled={isLoading} />
          {isError && <small className="p-error">מוצר זה כבר קיים</small>}
        </form>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default AddGoods;