import React, { useEffect } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { HOME, AUTH } from 'constants/routes';
import { useAppSelector } from 'store';
import { bgPattern, logoWhite } from 'assets/images';

/**
 * Login component.
 *
 * @returns {JSX.Element}
 */
const Login = () => {
  const navigate = useNavigate();
  const isLogin = useAppSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLogin) {
      navigate(HOME);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  return (
    <div className="login">
      <div className="login__box-wrap row">
        <div className="col-6 login__box-left">
          <div className="login__bg-pattern" style={{ backgroundImage: `url(${bgPattern})` }}>
            <img className="login__logo" src={logoWhite} />
          </div>
        </div>
        <div className="col-6 login__box-right">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Login;
