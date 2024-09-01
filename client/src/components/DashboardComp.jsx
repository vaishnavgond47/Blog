import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=5');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments?limit=5');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div style={{ padding: '16px', margin: '0 auto', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', backgroundColor: '#1e293b', gap: '16px', width: '280px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total Users</h3>
              <p style={{ fontSize: '1.5rem' }}>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup style={{ backgroundColor: '#14b8a6', color: '#fff', borderRadius: '50%', fontSize: '2.5rem', padding: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.875rem', color: '#10b981' }}>
            <HiArrowNarrowUp />
            <span>{lastMonthUsers}</span>
            <span style={{ color: '#94a3b8' }}>Last month</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', backgroundColor: '#1e293b', gap: '16px', width: '280px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total Comments</h3>
              <p style={{ fontSize: '1.5rem' }}>{totalComments}</p>
            </div>
            <HiAnnotation style={{ backgroundColor: '#6366f1', color: '#fff', borderRadius: '50%', fontSize: '2.5rem', padding: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.875rem', color: '#10b981' }}>
            <HiArrowNarrowUp />
            <span>{lastMonthComments}</span>
            <span style={{ color: '#94a3b8' }}>Last month</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', backgroundColor: '#1e293b', gap: '16px', width: '280px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total Posts</h3>
              <p style={{ fontSize: '1.5rem' }}>{totalPosts}</p>
            </div>
            <HiDocumentText style={{ backgroundColor: '#a3e635', color: '#fff', borderRadius: '50%', fontSize: '2.5rem', padding: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.875rem', color: '#10b981' }}>
            <HiArrowNarrowUp />
            <span>{lastMonthPosts}</span>
            <span style={{ color: '#94a3b8' }}>Last month</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', padding: '16px 0' }}>
        <div style={{ flex: '1 1 100%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '16px', borderRadius: '8px', backgroundColor: '#1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', fontWeight: '600', fontSize: '0.875rem' }}>
            <h1>Recent users</h1>
            <Button variant="outlined" color="secondary">
              <Link to={'/dashboard?tab=users'} style={{ textDecoration: 'none', color: '#1e88e5' }}>See all</Link>
            </Button>
          </div>
          <TableContainer component={Paper} style={{ backgroundColor: '#00475D'}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User image</TableCell>
                  <TableCell>Username</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <img
                        src={user.profilePicture}
                        alt='user'
                        style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#6b7280' }}
                      />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div style={{ flex: '1 1 100%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '16px', borderRadius: '8px', backgroundColor: '#1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', fontWeight: '600', fontSize: '0.875rem' }}>
            <h1>Recent comments</h1>
            <Button variant="outlined" color="secondary">
              <Link to={'/dashboard?tab=comments'} style={{ textDecoration: 'none', color: '#1e88e5' }}>See all</Link>
            </Button>
          </div>
          <TableContainer component={Paper} style={{ backgroundColor: '#00475D', maxWidth:'90%'}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Comment content</TableCell>
                  <TableCell>Likes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow key={comment._id}>
                    <TableCell style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {comment.content}
                    </TableCell>
                    <TableCell>{comment.numberOfLikes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div style={{ flex: '1 1 100%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '16px', borderRadius: '8px', backgroundColor: '#1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', fontWeight: '600', fontSize: '0.875rem' }}>
            <h1>Recent posts</h1>
            <Button variant="outlined" color="secondary">
              <Link to={'/dashboard?tab=posts'} style={{ textDecoration: 'none', color: '#1e88e5'}}>See all</Link>
            </Button>
          </div>
          <TableContainer component={Paper} style={{ backgroundColor: '#00475D'}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Post image</TableCell>
                  <TableCell>Post Title</TableCell>
                  <TableCell>Category</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>
                      <img
                        src={post.image}
                        alt='post'
                        style={{ width: '56px', height: '40px', borderRadius: '8px', backgroundColor: '#6b7280' }}
                      />
                    </TableCell>
                    <TableCell style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
