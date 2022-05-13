import React, { useState } from 'react';

import { Formik } from 'formik';
import { MdOutlineVisibilityOff, MdOutlineVisibility } from 'react-icons/md';

import { useNavigate } from 'react-router-dom';

import Input from 'components/common/input';
import { useAppDispatch } from 'store';

import { InputTypes } from 'types';
import Button from 'components/common/button/button';
import loginSchema from 'schemas/login';
import { getRememberMeToken, setMfaTokens } from 'services/token';
import { AUTH } from 'constants/routes';
import { login } from 'services/authService/auth';
import { handleError } from 'utils/errorHandler';

import { IAuthResponseProps, IAuthResponseWithMfaToken } from 'types/auth';
import { AUTH_TYPE } from 'constants/appConstants';

import { setAuthData } from '../../store/slice/authSlice';

/**
 * Login form component.
 *
 * @returns {JSX.Element}
 */
const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  /**
   * Handle Login.
   *
   * @param values
   */
  const handleLogin = async (values: any) => {
    try {
      setIsLoading(true);
      const data = await login(values);

      if (data?.type === AUTH_TYPE.AUTH) {
        return dispatch(setAuthData(data as IAuthResponseProps));
      }

      const mfaData = data as IAuthResponseWithMfaToken;
      const { mfaToken, oobCode } = mfaData;
      setMfaTokens(mfaToken, oobCode);
      navigate(AUTH.VERIFICATION);
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        rememberMeToken: getRememberMeToken() || '',
      }}
      validationSchema={loginSchema}
      onSubmit={async values => {
        await handleLogin(values);

        // await dispatch(handleLogin(values));
      }}
    >
      {props => (
        <div className="login__form">
          <h2 className="login__form-header">Welcome to Nodal</h2>
          <span className="login__form-subHeader">Sign in to your account to get started.</span>
          {/* noValidate - to disable browser base validation */}
          <form onSubmit={props.handleSubmit} noValidate>
            <div style={{ paddingTop: '36px' }}>
              <Input
                id="email"
                name="email"
                type={InputTypes.email}
                required
                placeholder="Email"
                value={props.values.email}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                error={props.errors.email && props.touched.email ? props.errors.email : false}
              />
            </div>

            <div>
              <Input
                id="password"
                name="password"
                type={isPasswordVisible ? InputTypes.text : InputTypes.password}
                required
                placeholder="Password"
                value={props.values.password}
                onChange={props.handleChange}
                Icon={isPasswordVisible ? MdOutlineVisibility : MdOutlineVisibilityOff}
                handleIconClick={() => setIsPasswordVisible(state => !state)}
                onBlur={props.handleBlur}
                error={props.errors.password && props.touched.password ? props.errors.password : false}
              />
            </div>

            <div className="login__form-signin">
              <Button type="submit" className="btn--right" label="Sign In" isLoading={isLoading} />
            </div>
          </form>
        </div>
      )}
    </Formik>
  );
};

export default LoginForm;
