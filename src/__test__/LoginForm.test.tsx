import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';

import LoginForm, { IProps } from '../Loginform';

const renderLoginForm = (props: Partial<IProps> = {}) => {
  const defaultProps: IProps = {
    onPasswordChange() {
      return;
    },
    onRememberChange() {
      return;
    },
    onUsernameChange() {
      return;
    },
    onSubmit() {
      return;
    },
    shouldRemember: true,
  };
  return render(<LoginForm {...defaultProps} {...props} />);
};

describe('<LoginForm />', () => {
  it('should display a blank login form, with remember me checked by default', async () => {
    const { findByTestId } = renderLoginForm();
    const loginForm = await findByTestId('login-form');

    expect(loginForm).toHaveFormValues({
      username: '',
      password: '',
      remember: true,
    });
  });

  it('should allow entering a username', async () => {
    const onUsernameChange = jest.fn();
    const { findByTestId } = renderLoginForm({ onUsernameChange });
    const usernameInput = await findByTestId('username');

    fireEvent.change(usernameInput, {
      target: {
        value: 'test username',
      },
    });
    // expect(onUsernameChange).toHaveBeenCalledWith('test username');
    expect(usernameInput).toHaveAttribute('value', 'test username');
  });

  it('should allow entering a password', async () => {
    const onPasswordChange = jest.fn();
    const { findByTestId } = renderLoginForm({ onPasswordChange });
    const passwordInput = await findByTestId('password');

    fireEvent.change(passwordInput, {
      target: {
        value: 'test password',
      },
    });
    expect(onPasswordChange).toHaveBeenCalledWith('test password');
  });

  it('should allow toggling remember me', async () => {
    const onRememberChange = jest.fn();
    const { findByTestId } = renderLoginForm({
      onRememberChange,
      shouldRemember: false,
    });
    const rememberCheckBox = await findByTestId('remember');

    fireEvent.click(rememberCheckBox);
    expect(onRememberChange).toHaveBeenCalledWith(true);
    fireEvent.click(rememberCheckBox);
    expect(onRememberChange).toHaveBeenCalledWith(false);
  });

  it('should submit the form with username, password, and remember', async () => {
    const onSubmit = jest.fn();
    const { findByTestId } = renderLoginForm({
      onSubmit,
      shouldRemember: false,
    });
    const usernameInput = await findByTestId('username');
    const passwordInput = await findByTestId('password');
    const rememberCheckBox = await findByTestId('remember');
    const submitButton = await findByTestId('submit');

    fireEvent.change(usernameInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(rememberCheckBox);
    fireEvent.click(submitButton);
    expect(onSubmit).toHaveBeenCalledWith('test', 'password', true);
  });
});
