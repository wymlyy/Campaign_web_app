import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from 'react-router-dom';
import * as Yup from "yup";
import axios from "axios";
import './Form.css';

function FormSignup() {
  const initialValues = {
    username: "",
    email: "",
    password: "",
    password2: ""
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    email: Yup.string().email('Invalid email format').required(),
    password: Yup.string().min(4).max(20).required(),
    password2: Yup.string()
      .oneOf([Yup.ref('password'), null], `Passwords don't match`).required('password confirmation is required')
  });

  const onSubmit = (data) => {
    axios.post("http://campaignwithus.ml:8080/auth", data).then(() => {
      console.log(data);
      window.location.href = '/success-form';
    });
  };

  return (

    <div className='form-content-right'>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className='form'>
          <h1>
            Get started with us today! Create your account by filling out the
            information below.         </h1>
          <label className='form-label'>Username: </label>
          <div className='form-inputs'>
            <Field className='form-input'

              id="inputCreatePost"
              name="username"
              placeholder=""
            />
            <ErrorMessage name="username" component="span" />
          </div>
          <label className='form-label'>Email: </label>
          <div className='form-inputs'>
            <Field className='form-input'

              id="inputEmail"
              name="email"
              placeholder=""
            />
            <ErrorMessage name="email" component="span" />
          </div>
          <label className='form-label'>Password: </label>
          <div className='form-inputs'>
            <Field className='form-input'
              autoComplete="off"
              type="password"
              id="inputPassword"
              name="password"
              placeholder=""
            />
            <ErrorMessage name="password" component="span" />
          </div>
          <label className='form-label'>Confirm Password: </label>
          <div className='form-inputs'>
            <Field className='form-input'
              autoComplete="off"
              type="password"
              id="confirmPassword"
              name="password2"
              placeholder=""
            />
            <ErrorMessage name="password2" component="span" />
          </div>
          <button className='form-input-btn' type="submit"> Register</button>
          <span className='form-input-login'>
            Already have an account? Login <Link to='/login'>here</Link>
          </span>
        </Form>
      </Formik>
    </div>

  );
}

export default FormSignup;