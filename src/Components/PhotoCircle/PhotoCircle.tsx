import React from 'react'

type url={
    url:string,
    width:string,
    height:string,
    type?:string
}
function PhotoCircle(props:url) {
    
    console.log(props)
  return (


    <div className={`${props.height} ${props.width} ${!props.type?"mx-auto":null} rounded-full`}>
        <img className='w-[100%] h-[100%] object-cover rounded-full' src={props.url} alt="" />
    </div>
  )
}

export default PhotoCircle