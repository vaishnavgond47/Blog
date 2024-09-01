import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1F2937',
          color:'gray'
        },
      }}
    >
      <List>
        {currentUser && currentUser.isAdmin && (
          <Link to="/dashboard?tab=dash">
            <ListItem button selected={tab === 'dash' || !tab}>
              <ListItemIcon>
                <HiChartPie />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Link>
        )}
        <Link to="/dashboard?tab=profile">
          <ListItem button selected={tab === 'profile'}>
            <ListItemIcon>
              <HiUser />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </Link>
        {currentUser.isAdmin && (
          <>
            <Link to="/dashboard?tab=posts">
              <ListItem button selected={tab === 'posts'}>
                <ListItemIcon>
                  <HiDocumentText />
                </ListItemIcon>
                <ListItemText primary="Posts" />
              </ListItem>
            </Link>
            <Link to="/dashboard?tab=users">
              <ListItem button selected={tab === 'users'}>
                <ListItemIcon>
                  <HiOutlineUserGroup />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItem>
            </Link>
            <Link to="/dashboard?tab=comments">
              <ListItem button selected={tab === 'comments'}>
                <ListItemIcon>
                  <HiAnnotation />
                </ListItemIcon>
                <ListItemText primary="Comments" />
              </ListItem>
            </Link>
          </>
        )}
        <Divider />
        <ListItem button onClick={handleSignout}>
          <ListItemIcon>
            <HiArrowSmRight />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItem>
      </List>
    </Drawer>
  );
}
