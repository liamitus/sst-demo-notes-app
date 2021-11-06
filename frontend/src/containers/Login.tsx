import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import './Login.css';
import { Auth } from 'aws-amplify';
import { useAppContext } from '../lib/context';
import { useHistory } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';
import { onError } from '../lib/error';

export default function Login() {
  const history = useHistory();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event: any) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await Auth.signIn(email, password);
      userHasAuthenticated(true);
      history.push('/');
    } catch (e: any) {
      onError(e.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </Form>
    </div>
  );
}
