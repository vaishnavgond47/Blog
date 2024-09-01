import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, TextField } from '@mui/material';

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div style={{ display: 'flex', padding: '16px', borderBottom: '1px solid #ccc', fontSize: '0.875rem' }}>
      <div style={{ marginRight: '12px' }}>
        <img
          style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0f0f0' }}
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontWeight: 'bold', marginRight: '4px', fontSize: '0.75rem' }}>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span style={{ color: '#888', fontSize: '0.75rem' }}>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <TextField
              multiline
              fullWidth
              variant="outlined"
              size="small"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', fontSize: '0.75rem' }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p style={{ color: '#555', paddingBottom: '8px' }}>{comment.content}</p>
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #ccc', gap: '8px', fontSize: '0.75rem' }}>
              <button
                type='button'
                onClick={() => onLike(comment._id)}
                style={{ color: '#888', cursor: 'pointer' }}
              >
                <FaThumbsUp style={{ fontSize: '1rem' }} />
              </button>
              <p style={{ color: '#888' }}>
                {comment.numberOfLikes > 0 && `${comment.numberOfLikes} ${comment.numberOfLikes === 1 ? 'like' : 'likes'}`}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type='button'
                      onClick={handleEdit}
                      style={{ color: '#888', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => onDelete(comment._id)}
                      style={{ color: '#f44336', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
