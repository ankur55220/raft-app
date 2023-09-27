
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import UseFirebase from '../../context/Context';
function Navbar() {

  const data=UseFirebase()
  const navigate=useNavigate()
  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
          
        <Button color="inherit" onClick={()=>{navigate(`/feed`)}}>Feed</Button>
        <Button color="inherit" onClick={()=>{navigate(`/signup`)}}>SignUp</Button>
        <Button color="inherit" onClick={()=>{navigate(`/profile/${data?.user}`)}}>Profile</Button>

        <Button color="inherit" onClick={()=>{
          window.localStorage.removeItem("users")

          navigate(`/`)
          
          }}>LOGOUT</Button>
      </Toolbar>
    </AppBar>
  </Box>
  )
}

export default Navbar