import {
  Alert,
  Button,
  Modal,
  TextField,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Avatar,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError('Could not upload image (File must be less than 2MB)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 3, width: '100%' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Profile
      </Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
        <Box sx={{ position: 'relative', width: 128, height: 128, mx: 'auto', cursor: 'pointer' }} onClick={() => filePickerRef.current.click()}>
          {imageFileUploadProgress && (
            <CircularProgress
              variant="determinate"
              value={imageFileUploadProgress}
              size={128}
              thickness={5}
              sx={{ position: 'absolute', top: 0, left: 0 }}
            />
          )}
          <Avatar
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            sx={{
              width: '100%',
              height: '100%',
              opacity: imageFileUploadProgress && imageFileUploadProgress < 100 ? 0.6 : 1,
              border: 2,
              borderColor: 'lightgray',
            }}
          />
        </Box>
        {imageFileUploadError && <Alert severity="error">{imageFileUploadError}</Alert>}
        <TextField
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          fullWidth
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }}
        />
        <TextField
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          fullWidth
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }}
        />
        <TextField
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
          fullWidth
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || imageFileUploading}
        >
          {loading ? 'Loading...' : 'Update'}
        </Button>
        {currentUser.isAdmin && (
          <Link to={'/create-post'} style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="secondary" fullWidth sx={{
              background: 'linear-gradient(to right, blue, pink)',
              color: 'white',
            }}>
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Typography variant="body2" color="error" onClick={() => setShowModal(true)} sx={{ cursor: 'pointer' }}>
          Delete Account
        </Typography>
        <Typography variant="body2" onClick={handleSignout} sx={{ cursor: 'pointer' }}>
          Sign Out
        </Typography>
      </Box>
      {updateUserSuccess && <Alert severity="success" sx={{ mt: 2 }}>{updateUserSuccess}</Alert>}
      {updateUserError && <Alert severity="error" sx={{ mt: 2 }}>{updateUserError}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: '10%', textAlign: 'center' }}>
          <HiOutlineExclamationCircle size={56} style={{ marginBottom: 16 }} />
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete your account?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="error" onClick={handleDeleteUser}>
              Yes, I'm sure
            </Button>
            <Button variant="outlined" color="primary" onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
