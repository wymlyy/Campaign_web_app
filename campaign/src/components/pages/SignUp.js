import React from 'react';
import '../../App.css';
import FormSignup from '../accountBox/FormSignup';
import Footer from '../Footer';
import '../accountBox/Form.css';

function SignUp() {
  return (
    <>
      <div className='form-container'>
        <div className='form-content-left'>
          <img className='form-img' src='images/img-2.svg' alt='spaceship' />
        </div>
        <FormSignup />

      </div>
      <Footer />
    </>
  );
}

export default SignUp;


