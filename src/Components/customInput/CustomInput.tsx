import { ChangeEvent } from "react"

type propsType={
    placeholder:string,
    onChange:(e:ChangeEvent<HTMLInputElement>)=>void,
    value:string | number,
    label:string
    
}

function CustomInput(props:propsType) {

    
  return (
    <>
    
    <label className="font-bold" htmlFor={props.label}>{props.label}</label>

    <input id={props.label} className="w-[100%] px-5 py-2 rounded-md border-none bg-slate-300 placeholder-gray-500 mb-5" 
    type="text" 
    placeholder={props.placeholder}
    onChange={props.onChange}
    value={props.value}

    />
    </>
  )
}

export default CustomInput