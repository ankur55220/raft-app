import React from 'react'
import PhotoCircle from '../PhotoCircle/PhotoCircle'
import { useNavigate } from 'react-router-dom'


type propsType={
  body:string,
  img:string,
  name:string,
  id:string
}
function CommentPost(props:propsType) {

  const navigate=useNavigate()

 console.log(props,"ffffffffffffffffffffffff")
    
  return (
    <div className='w-[100%] mb-6 ml-4 '  >
        <div className='flex items-center cursor-pointer' onClick={()=>{navigate(`/profile/${props.id}`)}}>
            
            <PhotoCircle url={props.img} width="w-[25px]" height='h-[25px]' type="non-profile"/><span className='ml-2'>{props.name}</span>
            
        </div>
        <div className='mt-2 font-mono text-gray-500'>
               {props.body}            
        </div>
    </div>
  )
}

export default CommentPost