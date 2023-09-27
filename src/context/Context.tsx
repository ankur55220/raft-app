import { createContext,useCallback,useContext, useEffect } from 'react'
import { useState } from 'react'
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged } from 'firebase/auth'
import {app,db} from '../firebaseConfig.ts'
import { doc,query, setDoc,getDoc,getDocs,updateDoc,collection,addDoc, where } from "firebase/firestore"; 
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const FireBaseContext=createContext<text | string>("")

const auth=getAuth(app)

type propsType={
    children:JSX.Element
}
const userId: string =   null as any

// let user=window.localStorage.getItem("user") || null

{/* <string | object | null |(()=>void)> */}


type text={

    createNewUser:(a:string,b:string)=>Promise<object>,
    signInUser:(a:string,b:string)=>Promise<object>,
    signingOut:()=>void,
    onAuthchange:()=>void,
    setMsg:React.Dispatch<React.SetStateAction<string>>,
    setLoading:React.Dispatch<React.SetStateAction<boolean>>,
    msg:string,
    loading:boolean,
    err:boolean,
    setErr:React.Dispatch<React.SetStateAction<boolean>>,
    addData:(a:string,b:string,c:object)=>Promise<void>,
    user:string | null,
    setUser:React.Dispatch<React.SetStateAction<string>>,
    getOneDoc:(a:string,b:string)=>Promise<object|null>,
    uploadImage:(a:string,b:File)=>void,
    url:string,
    progress1:Number,
    updateOne:(a:object,b:string,c:string)=>Promise<void>
    addPost:(c:string,a:string,b:object)=>Promise<void>,
    setPrgress:React.Dispatch<React.SetStateAction<Number>>
    fetchAllPosts:(id:string)=>Promise<any[] | undefined>
}

function getInitialState() {
    const notes = localStorage.getItem('users')
    return notes ? JSON.parse(notes) : null
  }


export const FirbaseProvider=(props:propsType)=>{

    const [msg,setMsg]=useState<string>("")
    const [loading,setLoading]=useState<boolean>(false)
    const [err,setErr]=useState<boolean>(false)
    const [url,setUrl]=useState<string>("")
    const [progress1,setPrgress]=useState<Number>(0)
    const [user,setUser]=useState(getInitialState)

    useEffect(()=>{
        localStorage.setItem('users', JSON.stringify(user))
    },[user])


    const updateOne= async(o:object,collection:string,id:string)=>{

        if(user!=null){
            const taskDocRef = doc(db, collection, id)

            try{

                await updateDoc(taskDocRef,o)
                

            }
            catch(err){
                console.log(err)
            }

        }


    }

    const uploadImage=(name:string,image:File)=>{

        const storage = getStorage()

        const metadata = {
            contentType: 'image/jpeg'
          }

          const storageRef = ref(storage, 'images/' + name)
          const uploadTask = uploadBytesResumable(storageRef, image, metadata);

          uploadTask.on('state_changed',
          (snapshot)=>{
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
             setPrgress(progress)
          },
          (error)=>{
             console.log(error)
          },
          ()=>{
            getDownloadURL(uploadTask.snapshot.ref)
            .then((url)=>{
                setUrl(url)
            })
            
          }
          
          )
    }

    const getOneDoc=useCallback(async(collection:string,docu:string)=>{

        const docRef = doc(db, collection, docu);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.exists(),"sssss")

if (docSnap.exists()) {
    console.log("Document data:",docSnap.id, docSnap.data());

    let data4={
        ...docSnap.data(),
        id:docSnap.id
    }

    console.log(data4,"00000000000000000000000000000000000")
    return data4
} else {
  // docSnap.data() will be undefined in this case
  return null
  console.log("No such document!");
}

    },[])

    
    async function fetchAllPosts(id:string){
       

        // let userId2=JSON.parse(window.localStorage.getItem("users") as string) || null
        const userRef= doc(db,"users",id)
        const oneDoc= await getDoc(userRef)

        

        const followers:Array<string>=[]
          if(oneDoc.exists()){
            
            for (let it of oneDoc?.data().followee){
                
                followers.push(it)
            }
          }

          const mainAnswer:Array<object>=[]
          console.log(followers,"0ppo")


         
    for(let item of followers){
        
    console.log("ghtt")
        const postRef= collection(db,"posts")
        
        const q=query(postRef,where("addedBy","==",item))

        const totalPost= await getDocs(q)
       

        totalPost.forEach((docu)=>{
            mainAnswer.unshift(docu.data())
        })


        console.log(mainAnswer,item,"hhhhh10110")

        

       


                 

            

        


        




    }
     return mainAnswer
        
    }

//    async function getOneDoc(collection:string,docu:string){

//         const docRef = doc(db, collection, docu);
//         const docSnap = await getDoc(docRef);
//         console.log(docSnap.exists(),"sssss")

// if (docSnap.exists()) {
//     console.log("Document data:", docSnap.data());

//     return docSnap.data()
// } else {
  
//   return null
//   console.log("No such document!");
// }
//     }

   function createNewUser(email:string,password:string):Promise<object>{

        const ans=createUserWithEmailAndPassword(auth,email,password)
            
        return ans

    }

    

    function signInUser(email:string,password:string):Promise<object>{

        return signInWithEmailAndPassword(auth,email,password)

    }


    


    function addData(collection:string,doc_name:string,info:object):Promise<void>{

        return setDoc(doc(db, collection, doc_name),info );

          

    }

   function addPost(collection:string,doc_name:string,info:object):Promise<void>{

        return setDoc(doc(db, collection, doc_name),info );

        // const   addRef= await addDoc(collection(db,docu),info)


        // return addRef



    }
   
    function signingOut(){
        return signOut(auth)
    }

    function onAuthchange(){
       return onAuthStateChanged(auth, (user) => {
            if (user) {
              
              const uid = user.uid;

              return uid
             
            } else {
              
            }
          });

    }
    
   const val:text={
    createNewUser,
    onAuthchange,
    signInUser,
    signingOut,
    setMsg,
    setLoading,
    msg,
    loading,
    err,
    setErr,
    addData,
    user,
    setUser,
    getOneDoc,
    uploadImage,
    url,
    progress1,
    updateOne,
    addPost,
    setPrgress,
    fetchAllPosts

    

   }
    

    return <FireBaseContext.Provider value={val}>
         {props.children}
    </FireBaseContext.Provider>

}

export default function UseFirebase():text | null{

    const rr=useContext(FireBaseContext)

    
    if(!rr ||  typeof(rr)=="string"){
        console.log("sssssssss")
        return null
    }else{

        
        return rr
    }


    console.log(rr,"iiiiiiiiiiiiiii")
}

