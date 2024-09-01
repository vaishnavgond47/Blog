import { Alert, Button, Modal, TextField, TextareaAutosize } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div style={{ maxWidth: '768px', margin: '0 auto', width: '100%', padding: '16px' }}>
      {currentUser ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '20px 0', color: '#555', fontSize: '0.875rem' }}>
          <p>Signed in as:</p>
          <img
            style={{ height: '20px', width: '20px', borderRadius: '50%' }}
            src={currentUser.profilePicture}
            alt=''
          />
          <Link
            to={'/dashboard?tab=profile'}
            style={{ fontSize: '0.75rem', color: '#00bcd4', textDecoration: 'underline' }}
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div style={{ fontSize: '0.875rem', color: '#009688', margin: '20px 0', display: 'flex', gap: '8px' }}>
          You must be signed in to comment.
          <Link style={{ color: '#1e88e5', textDecoration: 'underline' }} to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #009688', borderRadius: '4px', padding: '16px',background:'primary' }}>
          <TextareaAutosize
            placeholder='Add a comment...'
            minRows={3}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            style={{ width: '100%', padding: '8px', fontSize: '0.875rem', color:"black" }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <p style={{ color: '#555', fontSize: '0.75rem' }}>
              {200 - comment.length} characters remaining
            </p>
            <Button variant="outlined" color="primary" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert severity="error" style={{ marginTop: '20px' }}>
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p style={{ fontSize: '0.875rem', margin: '20px 0' }}>No comments yet!</p>
      ) : (
        <>
          <div style={{ fontSize: '0.875rem', margin: '20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p>Comments</p>
            <div style={{ border: '1px solid #ccc', padding: '4px 8px', borderRadius: '4px' }}>
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <HiOutlineExclamationCircle style={{ height: '56px', width: '56px', color: '#888', marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '20px', fontSize: '1.125rem', color: '#555' }}>
            Are you sure you want to delete this comment?
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Button variant="contained" color="error" onClick={() => handleDelete(commentToDelete)}>
              Yes, I'm sure
            </Button>
            <Button variant="outlined" color="primary" onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
