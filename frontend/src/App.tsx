import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory } from 'react-router-dom';
import './App.css';
import { AppContext } from './lib/context';
import { onError } from './lib/error';
import Routes from './Routes';

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    history.push('/login');
  }

  return (
    <>
      {!isAuthenticating && (
        <div className="App container py-3">
          <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
            <LinkContainer to="/">
              <Navbar.Brand className="font-weight-bold text-muted">
                Scratch
              </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav activeKey={window.location.pathname}>
                {isAuthenticated ? (
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                ) : (
                  <>
                    <LinkContainer to="/signup">
                      <Nav.Link>Signup</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <Nav.Link>Login</Nav.Link>
                    </LinkContainer>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <AppContext.Provider
            value={{ isAuthenticated, userHasAuthenticated } as any}
          >
            <Routes />
          </AppContext.Provider>
        </div>
      )}
    </>
  );
}

export default App;
