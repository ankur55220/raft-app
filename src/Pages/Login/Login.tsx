import { useState,useEffect } from 'react';
import CustomInput from '../../Components/customInput/CustomInput'

import UseFirebase from '../../context/Context'
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

function Login() {

  const navigate=useNavigate()
    const values=UseFirebase()


    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")



    useEffect(()=>{

      values?.setMsg("")
    },[])

  function handleSignIn(){
      console.log("iiiiiiiiiiiiiiiiiii")

values?.setLoading(true)
values?.signInUser(email,password)
.then((userCredential:any)=>{


   values.setMsg("successfully logged in")
   values?.setLoading(false)
   values?.setErr(false)
   values.setUser(userCredential.user.uid)

  //  window.localStorage.setItem("user",JSON.stringify(userCredential.user.uid))
   setTimeout(()=>{
    values?.setMsg("")
    navigate("/feed")
   },500)
   console.log(userCredential.user)

  


   

})
.catch((Err)=>{
   values.setErr(true)
   values.setMsg(Err.message)
   values.setLoading(false)
   console.log(Err)
})


}

  return (
    <div className='w-max[100%] h-[100vh] flex justify-center items-center'>
          
          <div className='w-[60%] flex flex-col md:flex-row lg:flex-row justify-center shadow-lg'>
            <div className='order-last md:order-first w-[100%] md:w-[50%]  text-left  py-3 px-4'>

              <div className='mb-4'>Sign In</div>

              <CustomInput 
              
              label={"Email"}
              placeholder='Enter your email here'
              onChange={(e)=>{setEmail(e.target.value)}}
              value={email}
              />

<CustomInput 
              
              label={"password"}
              placeholder='Enter your password here'
              onChange={(e)=>{setPassword(e.target.value)}}
              value={password}
              />


              <button onClick={handleSignIn} className='px-[42.8%] py-2 rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500 text-white'>Sign in</button>
              {
                values?.loading?<CircularProgress />:

                values?.err && values?.msg? <Alert severity="error">{values?.msg}</Alert>:

                !values?.err && values?.msg? <Alert severity='success'>{values?.msg}</Alert>:
                null
            }


            </div>
            <div  className='pb-2 md:pb-0 order-first md:order-last w-[100%] md:w-[50%] flex flex-col justify-center items-center text-center bg-gradient-to-r from-pink-500 to-rose-500 text-white'>

            <div className="text-bold text-2xl">WELCOME TO LOGIN</div>
            <div className='mb-2'>Dont have an account?</div>
            <button className='border-2 px-[2rem] text-center rounded-3xl py-1' onClick={()=>{navigate("/signup")}}>Sign Up</button>

            </div>
          </div>


    </div>
  )
}

export default Login