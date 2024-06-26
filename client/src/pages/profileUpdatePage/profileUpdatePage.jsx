import { useContext, useState } from 'react';
import './profileUpdatePage.scss';
import { AuthContext } from '../../context/authContext';
import apiRequest from '../../lib/apiRequest';
import { useNavigate } from 'react-router-dom';
import UploadWidget from '../../components/UploadWidget/UploadWidget';

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);

  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState(currentUser.avatar);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post('/auth/update', {
        username,
        email,
        password,
      });
      updateUser(res.data);
      navigate('/profile');
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
        </form>
      </div>
      <div className="sideContainer">
        <img
          src={avatar[0] || currentUser.avatar || '/noavatar.jpg'}
          alt=""
          className="avatar"
        />
        <UploadWidget
          uwConfig={{
            cloudName: 'dphh8qg2e',
            folder: 'users',
            uploadPreset: 'jzj7s9zj',
            multiple: false,
            maxFiles: 1,
            maxImageFileSize: 5242880,
            maxImageHeight: 2880,
            maxImageWidth: 3840,
            maxVideoFileSize: 10485760,
            maxVideoDuration: 1000000,
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
