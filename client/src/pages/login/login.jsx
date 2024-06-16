import { useContext, useState } from 'react';
import './login.scss';
import { Link, useNavigate } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';

const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const { updateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formdata = new FormData(e.target);

    const username = formdata.get('username');
    const password = formdata.get('password');

    try {
      const res = await apiRequest.post('/auth/login', {
        username,
        password,
      });

      updateUser(res.data);

      navigate('/');
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input
            name="username"
            required
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="Username"
          />
          <input
            name="password"
            required
            minLength={3}
            maxLength={20}
            type="password"
            placeholder="Password"
          />
          <button disabled={isLoading}>Login</button>

          {error && <span>{error}</span>}

          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
};

export default Login;