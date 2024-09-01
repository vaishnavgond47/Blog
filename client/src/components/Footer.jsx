import { Box, Container, Grid, Typography, Link as MuiLink, IconButton, Divider } from '@mui/material';
import { Facebook, Instagram, Twitter, GitHub} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function FooterCom() {
  return (
    <Box
      sx={{
        borderTop: '8px solid',
        borderColor: 'teal.500',
        bgcolor: 'rgb(255,255,255,0.05)',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} justifyContent="space-between">
          <Grid item xs={12} sm="auto">
            <Link to="/" style={{ textDecoration: 'none', background:'linear-gradient(to right, blue, pink)', padding:'10px', borderRadius:"5px" }}>
              <Typography
                variant="h5"
                component="div"
                color="text.primary"
                fontWeight="bold"
                sx={{
                  display: 'inline-block',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  color: 'white',
                }}
              >
                Blogging Web
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={12} sm="auto" container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" component="div" gutterBottom>
                About
              </Typography>
              <Box display="flex" flexDirection="column">
                <MuiLink href="#" target="_blank" rel="noopener" underline="hover" style={{color:'white'}}>
                  VERCOS
                </MuiLink>
                <MuiLink component={Link} to="/about" target="_blank" rel="noopener" underline="hover" style={{color:'white'}}>
                  Blogging web
                </MuiLink>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" component="div" gutterBottom>
                Follow us
              </Typography>
              <Box display="flex" flexDirection="column">
                <MuiLink href="#" target="_blank" rel="noopener" style={{color:'white'}} underline="hover">
                  Github
                </MuiLink>
                <MuiLink href="#" style={{color:'white'}} underline="hover">
                  Discord
                </MuiLink>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" component="div" gutterBottom>
                Legal
              </Typography>
              <Box display="flex" flexDirection="column">
                <MuiLink href="#" underline="hover"style={{color:'white'}}>
                  Privacy Policy
                </MuiLink>
                <MuiLink href="#" underline="hover"style={{color:'white'}}>
                  Terms & Conditions
                </MuiLink>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="white">
            © {new Date().getFullYear()} Pranjal Bhagat
          </Typography>
          <Box>
            <IconButton href="#" color="inherit">
              <Facebook />
            </IconButton>
            <IconButton href="#" color="inherit">
              <Instagram />
            </IconButton>
            <IconButton href="#" color="inherit">
              <Twitter />
            </IconButton>
            <IconButton href="#" color="inherit">
              <GitHub />
            </IconButton>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}
