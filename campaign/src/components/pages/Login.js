import React from 'react';
import '../../App.css';
import FormLogin from '../accountBox/FormLogin';
import Footer from '../Footer';
import '../accountBox/Form.css';

function Login() {

  return (
    <>
      <div className='form-container'>
        <div className='form-content-left'>
          <img className='form-img' src='images/img-2.svg' alt='logo' />
        </div>

        <FormLogin />

      </div>
      <Footer />
    </>
  );
}

export default Login;