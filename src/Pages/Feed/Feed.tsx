import { useEffect,useState } from 'react'
import PhotoCircle from '../../Components/PhotoCircle/PhotoCircle'
import PostCard from '../../Components/PostCard/PostCard'
import UseFirebase from '../../context/Context'
import { CircularProgress } from '@mui/material'

import { useNavigate } from 'react-router-dom'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { doc,getDoc,collection,query,where, documentId,getDocs } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import "./feed.css"
function Feed() {

    const [user,setUser]=useState<any>()
    const [loading,setLoading]=useState(false)
    const [postLoading,setPostLoading]=useState(false)
    const [followedPost,setFollowedPost]=useState<Array<object>>([])
    const [follows,setFollows]=useState<Array<object>>()
    const [others,setOthers]=useState<Array<object>>()


    const data=UseFirebase()

    const navigate=useNavigate()

    const [age, setAge] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

    function getAllfollowedPosts(id:string){
        setPostLoading(true)
        if(data && data.user){
            data.fetchAllPosts(id)
            .then(async(res)=>{
               
                console.log(res,"7777777777777777")

                if(res){

                    
                    

                    let temp:any[]=[]

                    for(let item of res){

                        const userRef= doc(db,"users",item.addedBy)
                        const snap=await getDoc(userRef)
                         
                        



                        if(snap.exists()){

                            item.name=snap.data().name
                            item.imgurl=snap.data().imgurl?snap.data().imgurl:item.imgurl

                            if(!temp.some(item=>item.name==snap?.data().name)){
                                temp.push({
                                    name:snap?.data().name,
                                    forId:item.addedBy
        
                                })
                            }
                            

                        }
                       

                    }
                    setFollowedPost(res)
                    setFollows(temp)
                }

                setPostLoading(false)
            })
            .catch((err)=>{
                console.log(err)
            })
           
        }
    }

    useEffect(()=>{

        if(data && data.user){
            getAllfollowedPosts(data.user)

        }

        morePeople()
        setLoading(true)
        if(data?.user!=null){

            data?.getOneDoc("users",data.user)
            .then((test)=>{

                console.log(test,"ppppppppppppppjjjjjjjj")
               setUser(test)
               
               setLoading(false)
               
                
                
            })
            .catch((err)=>{
                console.log(err)
            })

        }
    },[])

 async   function morePeople(){

        const userRef=collection(db,"users")

        if(data && data.user){
            const q= query(userRef,where(documentId(),"!=",data.user))

            const snap=await getDocs(q)

            let temp:any[]=[]

            snap.forEach((item)=>{
                if(item.exists()){

                    temp.push({
                        name:item.data().name,
                        id:item.id
                    })

                }
                

            })
         setOthers(temp)
        }

       




    }



  return (
    <div className='w-[100%] min-h-[90vh] flex justify-start flex-col md:flex-row'>



        <div className='w-[100%] teaxt-center border-2 p-2 md:w-[20%] '>

            {
                loading?<CircularProgress />:
                <>
                
                
                <PhotoCircle url={user?.imgurl} width='w-[50px]' height='h-[50px]' />
                <div className='text-center'>{user?.name}</div>
       
                <div className='text-center'>
                <button className='px-[50px] py-2 rounded-3xl bg-gradient-to-r  from-pink-500 to-rose-500 text-white' onClick={()=>{navigate(`/profile/${data?.user}`)}}>Profile</button>
                </div>
                </>
                
                
            }

            <div className='text-center'>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">Follows</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={age}
        label="Age"
        onChange={handleChange}
        
      >
        {
            follows?.length==0?<MenuItem value={""}>Not Following anybody yet</MenuItem>:
            follows?.map((item:any)=>{
                return (
                    <MenuItem onClick={()=>{navigate(`/profile/${item.forId}`)}}>{item.name}</MenuItem>

                )
            })
        }
       
      </Select>
    </FormControl>

            </div>

            <div className='text-center'>
           
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">Meet other cool people</InputLabel>
      <Select
        
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={age}
        label="Age"
        onChange={handleChange}
        
      >
        {
            others?.length==0?<MenuItem value={""}>No data</MenuItem>:
            others?.map((item:any)=>{
                return (
                    <MenuItem onClick={()=>{navigate(`/profile/${item.id}`)}}>{item.name}</MenuItem>

                )
            })
        }
       
      </Select>
    </FormControl>

            </div>
       
       
     

         

         


        </div>

       
        <div className='w-[100%] border-2 min-h-[90vh] md:w-[60%] '>
         {
            postLoading?<CircularProgress size="2rem"/>:
            followedPost? followedPost.length==0?<h1>no post to show</h1>:
            followedPost.map((item:any)=>{


                return (<>
                       <PostCard
                    addedBy={item.addedBy}
                    likes={item.likes}
                    Dislikes={item.dislikes}
                    mainId={item.docId}
                    userName={item.name}
                    photoUrl={item.imgurl}
                    bio={item.post}
                    single={false}
                    imagePresent={!(item.url == "")}
                    imgUrl={item.url}
                    />
                    </>
                    
                    )
            })
            
            
            
            
            :null
            
         }
        </div>


        </div>
        


    
  )
}

export default Feed