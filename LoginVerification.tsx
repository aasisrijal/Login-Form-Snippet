import React, { useState } from 'react';

import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import { InputTypes } from 'types';
import { AUTH, HOME } from 'constants/routes';
import Input from 'components/common/input';
import { useAppDispatch } from 'store';
import { getMfaTokens } from 'services/token';
import { setAuthData } from 'store/slice/authSlice';
import { handleError } from 'utils/errorHandler';
import { IVerifyMfaInitialProps } from 'types/auth';
import Button from 'components/common/button/button';
import { verifyMfa } from 'services/authService/auth';
import otpVerificationSchema from 'schemas/otpVerification';

/**
 * Login Verification FC component.
 *
 * @returns {JSX.Element}
 */
const LoginVerification = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { oobCode, mfaToken } = getMfaTokens();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initialState = {
    verificationCode: '',
    mfaToken,
    oobCode,
    rememberMe: false,
  } as IVerifyMfaInitialProps;

  return (
    <Formik
      initialValues={initialState}
      validationSchema={otpVerificationSchema}
      onSubmit={async values => {
        try {
          setIsLoading(true);
          const response = await verifyMfa(values);
          dispatch(setAuthData(response));
          navigate(HOME);
        } catch (e) {
          handleError(e);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {props => (
        <div className="login__form">
          <h2 className="login__form-header">Verification</h2>
          <span className="login__form-subHeader verification-subHeader">
            A one-time verification code has been sent to your email.
            <br /> This code will be valid for 5 minutes only.
          </span>
          <form onSubmit={props.handleSubmit}>
            <div style={{ paddingTop: '36px' }}>
              <Input
                id="verify"
                name="verificationCode"
                type={InputTypes.text}
                placeholder="Please enter the code here"
                value={props.values.verificationCode}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                error={
                  props.errors.verificationCode && props.touched.verificationCode
                    ? props.errors.verificationCode
                    : false
                }
              />
            </div>
            <div className="login__form-signin">
              <div className="form-group c-checkbox d-inline login__form-checkbox">
                <input
                  type="checkbox"
                  className="c-checkbox__control"
                  id="checkbox"
                  onChange={props.handleChange}
                  name="rememberMe"
                />
                <label htmlFor="checkbox">Remember me for this device</label>
              </div>
              <Button type="submit" className="btn--right" label="Verify" isLoading={isLoading} />
            </div>
          </form>
          <div className="login__signup">
            <p className="text-center">
              <a href={`/${AUTH.LOGIN}`}>Go back to login page.</a>
            </p>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default LoginVerification;
