import {useState,useEffect} from 'react'
import PostCard from '../../Components/PostCard/PostCard'
import CommentPost from '../../Components/CommentPost/CommentPost'
import { useParams } from 'react-router-dom'
import UseFirebase from '../../context/Context'


import { CircularProgress } from '@mui/material'
import { v4 as uuid4 } from 'uuid'
import { Alert } from '@mui/material'
import { where,getDocs,collection,doc,query,Timestamp,orderBy,getDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { useNavigate } from 'react-router-dom'



interface LooseObject {
  [key: string]: any
}


function SinglePost() {
  const [post,setPost]=useState<any>(null)
  const [comment,setComment]=useState<string>()
  const navigate=useNavigate()
  const [totalComments,setTotalComments]=useState<object[]|null>(null)

   const [loading,setLoading]=useState(false)
  const [err,setErr]=useState(false)
  const [msg,setMsg]=useState("")
   const params=useParams();
   const data=UseFirebase()

useEffect(()=>{

  
  getAllComments()

  

  if(data && params && params.id){

    setLoading(true)
    data.getOneDoc("posts",params.id)
    .then(async(postData:any)=>{
      if(!postData){
        navigate("/")
      }
      const userRef=doc(db,"users",postData.addedBy)
      const snap=await getDoc(userRef)
      if(snap.exists()){
        postData.imgurl=snap.data().imgurl?snap.data().imgurl:postData.imgurl
        postData.name=snap.data().name
      }
      console.log(postData,"iiiiii777")
      setPost(postData)
      setLoading(false)
    })
    .catch((err)=>{
      console.log(err)
      setLoading(false)

    })
  }

},[])


function commentHandler(){
  const comId=uuid4()
  if(data && params){

      const com={

        addedBY:data.user,
        postedOn:params.id,
        body:comment,
        created_at:Timestamp.fromDate(new Date())

      }

setLoading(true)
      data.addData("comments",comId,com)
      .then(()=>{

        setErr(false)
        setMsg("commment posted")
        getAllComments()
        setLoading(false)

      })
      .catch((err)=>{
        setErr(true)
        setMsg("something went wrong")
        setLoading(false)
        console.log(err)

      })

  }
}

async function getAllComments(){

  let arr:Array<any>=[]
  const res=[]
  const commentsRef=collection(db,"comments")

  const q=query(commentsRef,where("postedOn","==",params.id),orderBy("created_at","desc"))

  const postComments=await getDocs(q)


  


  

  
  postComments.forEach((doc)=>{
   
    


    

    if(doc.exists()){  
     
       
       arr.push(doc.data())
       
        }
        
       
  })


for(let doc of arr){

  let task:any=await data?.getOneDoc("users",doc.addedBY);

  console.log(task)
  res.push({
    body:doc.body,
    img:task?.imgurl,
    name:task?.name,
    id:task?.id
  })
}


setTotalComments(res)
}






  return (
    <div className='w-[80%] h-[auto] mx-auto py-4'>
      {
        !post?<CircularProgress/>:<>
        
        <PostCard
                    addedBy={post.addedBy}
                    likes={post.likes}
                    Dislikes={post.dislikes}
                    mainId={post.docId}
                    userName={post.name}
                    photoUrl={post.imgurl}
                    bio={post.post}
                    single={true}
                    imagePresent={!(post.url == "")}
                    imgUrl={post.url}
                  />
        
        
        
        </>
      }
        

        <div className='w-[90%] mx-auto'>
           
           <input value={comment} onChange={(e)=>{setComment(e.target.value)}} className='w-[50%] border-2 border-gray-300 p-2' type="text" placeholder='write your comment here'  />
            <span>              <button onClick={commentHandler} className='cursor-pointer px-[2rem] py-2 rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500 text-white'>POST</button>
                     {
                         loading?<CircularProgress size="1rem"/>:
                         !err && msg?<Alert onClose={() => {setMsg("")}}>{msg}</Alert>:
                         err && msg?<Alert severity="error" onClose={() => {
                          setErr(false)
                          setMsg("")
                         }}>{msg}</Alert>:null
                     }           
                               
</span>                         
        </div>
        <div className='w-[90%] mx-auto p-2 shadow-md mt-4'>
              <div className='text-gray-300 mb-4'>Comments</div>
              <div>
                {
                  totalComments && totalComments.length>0?

                  totalComments.map((item:LooseObject)=>{

                    console.log(item,"just checkinggggggg")
                     return <CommentPost body={item.body} img={item.img} name={item.name} id={item.id}/>
                  })
                  :
                  totalComments && totalComments.length==0?<h1>no comments to show</h1>
                  :null

                }
                
              </div>
        </div>
    </div>
  )
}

export default SinglePost