import {useState,useEffect} from 'react'
import UseFirebase from '../../context/Context'
import CustomInput from '../../Components/customInput/CustomInput'
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';


function SignUp() {


    const navigate=useNavigate()
    const values=UseFirebase()


    

    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

    useEffect(()=>{

        values?.setMsg("")

    },[])

    function handleSignUp(){
               console.log("iiiiiiiiiiiiiiiiiii")

        values?.setLoading(true)
        values?.createNewUser(email,password)
        .then((user:any)=>{


            values.setMsg("successfully signed up")
            values?.setLoading(false)
            values.setErr(false)

           
            console.log(user)


            const userData={
                
                name:user.user.email.split('@')[0],
                imgurl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTym8zBebpXB3jcl2vR4xVoxBQ1ZGNFCRpbPMg3drNyPw&s",
                bio:"",
                liked:[],
                disliked:[],
            
                followers:[],
                followee:[]
               }
            
               console.log(user.user.uid)
               values.addData("users",user.user.uid,userData)
               .then(()=>{

                
                setTimeout(()=>{
                    navigate("/")
                   },500)

               })

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
          
          <div className=' w-[60%] flex flex-col md:flex-row lg:flex-row justify-center shadow-lg'>


            <div className='order-last md:order-first w-[100%] md:w-[50%]  text-left  py-3 px-4'>

              <div className='mb-4'>Sign Up</div>

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


              <button className='px-[42.8%] py-2 rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500 text-white' onClick={handleSignUp}>Sign up</button>

              {
                values?.loading?<CircularProgress />:

                values?.err && values?.msg? <Alert severity="error">{values?.msg}</Alert>:

                !values?.err && values?.msg? <Alert severity='success'>{values?.msg}</Alert>:
                null
            }

            </div>
            <div className='pb-2 md:pb-0 order-first md:order-last w-[100%] md:w-[50%] flex flex-col justify-center items-center text-center bg-gradient-to-r from-pink-500 to-rose-500 text-white'>

            <div className="text-bold text-2xl">WELCOME TO SIGNUP</div>
            <div className='mb-2'>Already have an account?</div>
            <button className='border-2 px-[2rem] text-center rounded-3xl py-1 ' onClick={()=>{navigate("/")}}>Sign In</button>

           

            </div>
          </div>


    </div>
  )
}

export default SignUp




