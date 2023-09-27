import {Routes,Route} from 'react-router-dom'
import Login from './Pages/Login/Login'
import SignUp from './Pages/SignUp/Signup'
import Feed from './Pages/Feed/Feed'
import Navbar from './Components/Navbar/Navbar'
import Profile from './Pages/Profile/Profile'
import SinglePost from './Pages/SinglePost/SinglePost'
import UseFirebase from './context/Context'
import { useNavigate,Navigate } from 'react-router-dom'
import { Children } from 'react'

type propsType={
  children:React.ReactNode | null
}



function App() {

  
  

  const Protect=(props:propsType)=>{
    let user=window.localStorage.getItem("users")

    return user?<>{props.children}</>:<Navigate to="/"/>

  }
  

  return (
    <>
    <Navbar/>
    <Routes>

      <Route path="/" element={<Login/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/feed" element={<Protect><Feed/></Protect>}/>
      <Route path="/profile/:id" element={<Protect><Profile/></Protect>}/>
      <Route path="/single/:id" element={<Protect><SinglePost/></Protect>}/>

    </Routes>
      
    </>
  )
}

export default App
