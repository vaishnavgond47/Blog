import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from '@mui/material';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { styled } from '@mui/system';

const StyledImage = styled('img')({
  width: '80px',
  height: '40px',
  objectFit: 'cover',
  backgroundColor: 'gray',
});

const StyledTableContainer = styled(TableContainer)({
  margin: 'auto',
  padding: '16px',
  overflowX: 'auto',
});

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <StyledTableContainer component={Paper} style={{maxWidth:'80%', margin:'0 auto',background:'rgba(255, 255, 255, 0.2)'}}>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table style={{background:'rgba(255, 255, 255, 0.2)'}}>
            <TableHead>
              <TableRow>
                <TableCell>Date updated</TableCell>
                <TableCell>Post image</TableCell>
                <TableCell>Post title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Delete</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userPosts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <StyledImage src={post.image} alt={post.title} />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <Typography variant="body1">{post.title}</Typography>
                    </Link>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="error"
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      Delete
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Link to={`/update-post/${post._id}`}>
                      <Typography variant="body2" color="primary">
                        Edit
                      </Typography>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {showMore && (
            <Button onClick={handleShowMore} color="primary" fullWidth>
              Show more
            </Button>
          )}
        </>
      ) : (
        <Typography variant="body1">You have no posts yet!</Typography>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Paper style={{ padding: '16px', textAlign: 'center' }}>
          <HiOutlineExclamationCircle size={56} style={{ marginBottom: '16px' }} />
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this post?
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Button variant="contained" color="error" onClick={handleDeletePost}>
              Yes, I'm sure
            </Button>
            <Button variant="outlined" color="primary" onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </div>
        </Paper>
      </Modal>
    </StyledTableContainer>
  );
}
