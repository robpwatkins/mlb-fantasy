import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const Username = () => {
  const [username, setUsername] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);
  // const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState('');
  const [checkingUsername, setCheckingUsername] = useState('');
  const { dispatch } = useAuthContext();
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const navigate = useNavigate();

  const validateUsername = async (value) => {
    if (value.length < 3) {
      setError('Please include at least 3 characters');
      return false;
    }

    if (value.length > 23) {
      setError('Please limit to 23 characters max');
      return false;
    }
    
    const isValid = /^(?!.*--)(?!-)(?!.*-$)[0-9A-Za-z-]*$/.test(value);

    if (!isValid) {
      setError('Invalid nickname — see above guidelines');
      setCheckingUsername(false);
      return false;
    }
  
    const response = await fetch(`${serverUrl}/username-check?username=${value}`);
    const exists = await response.json();
  
    if (exists) {
      setError('Nickname is taken');
      setCheckingUsername(false);
      return false;
    }
  
    setCheckingUsername(false);
    setError('');
  };

  const handleChange = async (e) => {
    setCheckingUsername(true);
    
    setUsername(e.target.value);
    
    if (!e.target.value) return;
    
    clearTimeout(timeoutId);
    setTimeoutId(setTimeout(validateUsername, 1000, e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${serverUrl}/user/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username })
      });
  
      const user = await response.json();
      console.log('user: ', user);
  
      dispatch({ type: 'LOGIN', payload: user });
      navigate("/");
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <form className="username" onSubmit={e => handleSubmit(e)}>
      <h2>Create a nickname</h2>
      <p>Your nickname may contain letters, numbers and single hyphens, and may not begin or end with a hyphen.</p>
      <input
        type="username"
        onChange={e => handleChange(e)}
        value={username}
      />
      {error && <div className="error">{error}</div>}
      <button disabled={checkingUsername || !!error}>
        {checkingUsername ? 'Checking' : 'Continue'}
      </button>
    </form>
  )
};

export default Username;