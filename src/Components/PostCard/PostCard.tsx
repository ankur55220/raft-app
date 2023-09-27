import React,{useEffect,useRef,useMemo} from 'react'
import PhotoCircle from '../PhotoCircle/PhotoCircle'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { db } from '../../firebaseConfig';
import { doc,getDoc,updateDoc,arrayRemove,increment,arrayUnion } from "firebase/firestore"; 
import UseFirebase from '../../context/Context';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Editor from "@draft-js-plugins/editor";
import { EditorState,convertFromRaw } from 'draft-js';

import '@draft-js-plugins/mention/lib/plugin.css';
import createMentionPlugin from "@draft-js-plugins/mention"


type isImage={
    imagePresent:boolean,
    imgUrl?:string,
    single:boolean,
    bio:any,
    photoUrl:string,
    userName:string,
    mainId:string,
    likes:Number,
    Dislikes:Number,
    addedBy:string
}



function PostCard(props:isImage) {
   const data=UseFirebase()
  const [likeState,setLikes]=React.useState<boolean | null>(null)
  const [dislikeState,setDisLikes]=React.useState<boolean | null>(null)
  const [likeCount,setLikeCount]=React.useState(props.likes)
  const [dislikeCount,setDisLikeCount]=React.useState(props.likes)
  
  const [loading,setLoading]=React.useState(false)
  console.log(props.bio,"ooooooooooopppppppp")
  const [editorState,setEditorState]=React.useState<any>()

  async function hasLiked(){

   
    setLoading(true)
    if(data && data.user!=null){
      const useRef= doc(db,"users",data?.user)
      const docSnap=await getDoc(useRef)

      if(docSnap.exists()){
       
        let likesArr=docSnap.data().liked
        let dislikeArr=docSnap.data().disliked

      

        if(likesArr.includes(props.mainId)){
           setLikes(true)
           setDisLikes(false)
        }

        if(dislikeArr.includes(props.mainId)){
          setLikes(false)
          setDisLikes(true)
        }


      }
      
      const docRef=doc(db,"posts",props.mainId)

      const snap=await getDoc(docRef)

      if(snap.exists()){
        setLikeCount(snap.data().likes)
        setDisLikeCount(snap.data().dislikes)
      }
    }

      setLoading(false)
  }

  useEffect(()=>{
    hasLiked()

    

  },[])

  useEffect(()=>{

    console.log(props.bio)

    if(props.bio){
      const json=JSON.parse(props.bio)

    const main=convertFromRaw(json)

    const currentState=EditorState.createWithContent(main)

    console.log(currentState,"ddddddddddddddddddddddddddddddddddddddddddd")


    setEditorState(currentState)

    }else{

      setEditorState(EditorState.createEmpty())

    }
    

  },[props.bio])



  const AddLike=async()=>{


    if(data?.user==props.addedBy){
      return
    }

    if(data && data.user){

      const useRef= doc(db,"users",data?.user)
      const docRef=doc(db,"posts",props.mainId)
      const likedata= await getDoc(docRef)
      if(likeState && !dislikeState){
        await updateDoc(useRef,{
           liked:arrayRemove(props.mainId)
        })

        if(likedata.exists()){
          await updateDoc(docRef,{
            likes:likedata.data().likes>0?increment(-1):increment(0)
          })

        }
        
        setLikes(null)

      }else if(!likeState && dislikeState){
        
        await updateDoc(useRef,{
          disliked:arrayRemove(props.mainId),
          liked:arrayUnion(props.mainId)
       })

       

       if(likedata.exists()){
        await updateDoc(docRef,{
          likes:increment(1),
          dislikes:likedata.data().dislikes>0?increment(-1):increment(0)
        })

       }
      
       setDisLikes(false)
       setLikes(true)

      }else if(!likeState && !dislikeState){
        await updateDoc(useRef,{
          
          liked:arrayUnion(props.mainId)
       })

       await updateDoc(docRef,{
        likes:increment(1),
        
      })
       
      setLikes(true)

      }

      hasLiked()


    }
   
    
     

  }

  


  const addDislike=async()=>{
    if(data?.user==props.addedBy){
      return
    }
    
    if(data && data.user){

      const useRef= doc(db,"users",data?.user)
      const docRef=doc(db,"posts",props.mainId)
      const likedata= await getDoc(docRef)

      if(dislikeState && !likeState){
        await updateDoc(useRef,{
           disliked:arrayRemove(props.mainId)
        })

        if(likedata.exists()){

          await updateDoc(docRef,{
            dislikes:likedata.data().dislikes>0?increment(-1):increment(0)
          })

        }
       

        setDisLikes(null)

      }else if(!dislikeState && likeState){
        
        await updateDoc(useRef,{
          disliked:arrayUnion(props.mainId),
          liked:arrayRemove(props.mainId)
       })

      

       if(likedata.exists()){
        await updateDoc(docRef,{
          dislikes:increment(1),
          likes:likedata.data().likes>0?increment(-1):increment(0)
        })

       }
      
       setDisLikes(true)
       setLikes(null)

      }else if(!likeState && !dislikeState){
        await updateDoc(useRef,{
          
          disliked:arrayUnion(props.mainId)
       })

       await updateDoc(docRef,{
        dislikes:increment(1),
        
      })
     
      setDisLikes(true)

      }


    }

    hasLiked()

  }

  
  const navigate=useNavigate()


  const { plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      mentionComponent(mentionProps) {

        console.log(mentionProps,"9999999999999iiiii")
        return (
          <span
            className={mentionProps.className}
            // eslint-disable-next-line no-alert
            onClick={(event) => {
              event.stopPropagation()
              navigate(`/profile/${mentionProps.mention.url}`)
            
            }}
          >
           {mentionProps.children}
          </span>
        );
      },
    });
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);
  return (
    <div className='w-[90%] mx-auto shadow-lg p-4 mb-3'>

        <div className='w-[100%] flex justify-start items-center cursor-pointer ' onClick={()=>{navigate(`/profile/${props.addedBy}`)}}>
            <PhotoCircle url={props.photoUrl} width='w-[25px]' height='h-[25px]' type="card"/>
            <div className='ml-1'>{props.userName}</div>
        </div>

        <div className='mt-2 font-sans text-gray-600'>

            {
                props.imagePresent?
                <>
                <div className='w-[100%] h-auto'>

                    <img className='w-[100%] h-[100%] object-cover' src={props.imgUrl} alt="" />

                </div>
                <div onClick={()=>{navigate(`/single/${props.mainId}`)}} className='cursor-pointer'>
                      {/* {
                        !props.single?props?.bio?.substring(0,100):props?.bio
                      }
                      {
                        !props.single?<span onClick={()=>{navigate(`/single/${props.mainId}`)}} className='text-blue-600 cursor-pointer'>....more</span>:null */}
                       {/* }  */}
                     
                       {
                         editorState? <Editor editorState={editorState} plugins={plugins} onChange={setEditorState} readOnly/>:"loading...."         
                       }        
                    
                </div>

                <div className='mt-4'>
                  {
                    loading?<CircularProgress size="1rem"/>:<><ThumbUpIcon sx={{cursor:"pointer"}} onClick={AddLike} color={likeState?"primary":"action"}/><span className='mr-2'>{Number(likeCount)}</span><span>{Number(dislikeCount)}</span><ThumbDownIcon sx={{cursor:"pointer"}} onClick={addDislike} color={dislikeState?"primary":"action"}/></>
                  }
                    
                    
                   
                 </div>
                </>
                :
                <>
                <div className='cursor-pointer' onClick={()=>{navigate(`/single/${props.mainId}`)}}>
                    {/* {
                        !props.single?props?.bio?.substring(0,100):props?.bio
                    }
                        
                        {
                        !props.single?<span>....more</span>:null
                      } */}

{
         editorState? <Editor editorState={editorState} plugins={plugins} onChange={setEditorState} readOnly/>:"loading...."
}                     
                </div>
                 <div className='mt-4'><ThumbUpIcon sx={{cursor:"pointer"}} onClick={AddLike} color={likeState?"primary":"action"}/><span className='mr-2'>{Number(props.likes)}</span><span>{Number(props.Dislikes)}</span><ThumbDownIcon sx={{cursor:"pointer"}} onClick={addDislike} color={dislikeState?"primary":"action"}/></div>

                 </>

                
            }
        </div>


        
    
        
    </div>
  )
}

export default PostCard