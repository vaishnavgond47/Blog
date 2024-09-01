import { Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div style={{ padding: '16px', overflowX: 'auto', margin: '0 auto' }}>
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <TableContainer component={Paper} style={{background:'rgba(255, 255, 255, 0.3)'}}>
            <Table>
              <TableHead style={{background:'rgba(255, 255, 255, 0.2)'}}>
                <TableRow>
                  <TableCell>Date updated</TableCell>
                  <TableCell>Comment content</TableCell>
                  <TableCell>Number of likes</TableCell>
                  <TableCell>PostId</TableCell>
                  <TableCell>UserId</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow key={comment._id}>
                    <TableCell>{new Date(comment.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{comment.content}</TableCell>
                    <TableCell>{comment.numberOfLikes}</TableCell>
                    <TableCell>{comment.postId}</TableCell>
                    <TableCell>{comment.userId}</TableCell>
                    <TableCell>
                      <Button color='error' onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {showMore && (
            <Button onClick={handleShowMore} style={{ width: '100%', color: '#14b8a6', marginTop: '16px' }}>
              Show more
            </Button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Paper style={{ padding: '16px', textAlign: 'center' }}>
            <HiOutlineExclamationCircle style={{ fontSize: '56px', color: '#6b7280', marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '24px', fontSize: '18px', color: '#6b7280' }}>
              Are you sure you want to delete this comment?
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <Button variant='contained' color='error' onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button variant='outlined' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </Paper>
        </div>
      </Modal>
    </div>
  );
}
