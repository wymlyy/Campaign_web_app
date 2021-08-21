import React from 'react';
import { Link } from 'react-router-dom';
import './Form.css';

const FormSuccess = () => {
  return (
    <div className='form-content-right'>
      <h1 className='form-success'>We have received your request!</h1>
      <img className='form-img-2' src='images/img-3.svg' alt='success-image' />
      <p className='form-input-login-success'>
        Login <Link to='/login'>here</Link>
      </p>
    </div>
  );
};

export default FormSuccess;
