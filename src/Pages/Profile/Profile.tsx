import React, {
  useEffect,
  
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import PhotoCircle from "../../Components/PhotoCircle/PhotoCircle";
import { MuiFileInput } from "mui-file-input";
import PostCard from "../../Components/PostCard/PostCard";
import UseFirebase from "../../context/Context";
import ProgressBar from "../../Components/progressBar/ProgressBar";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CustomInput from "../../Components/customInput/CustomInput";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import 'whatwg-fetch'
import "./editor.css"
import {
  doc,
  collection,
  query,
  where,
  documentId,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  orderBy
} from "firebase/firestore";
import { MentionData } from '@draft-js-plugins/mention';
import 'whatwg-fetch'
import Editor from "@draft-js-plugins/editor";
import '@draft-js-plugins/mention/lib/plugin.css';
import createMentionPlugin from "@draft-js-plugins/mention";

import { useNavigate } from "react-router-dom";
// import "./editor.css";
import { db } from "../../firebaseConfig";
import {EditorState,convertToRaw} from "draft-js"

function Profile() {

  const data = UseFirebase();
  const navigate=useNavigate()
  const [value, setValue] = React.useState<File | null>();
  
  const [msg, setMsg] = React.useState<string>();
  const [err, setErr] = React.useState<boolean>(false);
  const [profile, setProfile] = React.useState<File | null>();
  const [name, setName] = React.useState<string>("");

  const [open1, setOpen1] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [bio, setBio] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<any>(undefined);
  const [present, setPresent] = React.useState<boolean>(false);
  const [posts, setPosts] = React.useState<Array<object> | null>(null);
  
  const [suggestions, setSuggestions] = useState<MentionData[]>([]);
  const [backup,setBackup]=useState<MentionData[]>([])
  const [str,setStr]=useState<string>("")

  const params = useParams();

  

  const handleClickOpen = () => {
    setOpen1(true);
  };

  const handleClose = () => {
    setOpen1(false);
  };

  function upload() {
    if (value != null) {
      data?.uploadImage(value.name, value);
    }
  }

  function uploadProfile() {
    if (profile != null) {
      data?.uploadImage(profile.name, profile);
    }

    
  }

  console.log("pagalkardegaaaaaaaaaaaaaaaaaaaa")

  async function checkIfFollow() {
    console.log(user);

    if (user != undefined && data && data.user) {
      console.log(user);

      const usersRef = collection(db, "users");

      const q = query(
        usersRef,
        where(documentId(), "==", data.user),
        where("followee", "array-contains", params.id)
      );

      const data2 = await getDocs(q);

      if (data2.size == 0) {
        setPresent(false);
      } else {
        setPresent(true);
      }
    }
  }

  async function getAllUsers(){

    const querySnapShot=await getDocs(collection(db,"users"))

   console.log(querySnapShot.size,"77mmnn")
    const userInfo:MentionData[]=[]

    

    

    querySnapShot.forEach((doc)=>{



      if(doc.exists()){

        const temp:MentionData={
          name:doc.data().name,
          url:doc.id
        }
       

        userInfo.push(temp)
       
        
          
        
       

      }

      
      

     
     
    })

    
    if(userInfo!=null){
      setSuggestions(userInfo)
      setBackup(userInfo)
     
    }

    



    



  }

  async function getAllUserPosts() {
    console.log(user);

    if (params != undefined) {
      console.log("reaching here");

      const usersRef = collection(db, "posts");

      const q = query(usersRef, where("addedBy", "==", params.id),orderBy("created_at","desc"));

      const data = await getDocs(q);

      
      const result:any= [];

     

      data.forEach((dat) => {

        

        result.push(dat.data());
      });

      for(let item of result){

        const userRef=doc(db,"users",item.addedBy)
        const snap= await getDoc(userRef)


        if(snap.exists()){
          item.name=snap.data().name;
          item.imgurl=snap.data().imgurl?snap.data().imgurl:item.imgurl
        }
        
      }
      console.log(result,"oooooooooooooooooooooooooooo88888888")
      setPosts(result);
    }
  }

  async function callUser() {
    setLoading(true);
    if (params != null && params.id) {
      
        data?.getOneDoc("users", params.id)
        .then((test) => {
          console.log(test,"ppppppppppppppjjjjjjjj")
          if(!test){
            navigate('/')
          }
          setUser(test);

          return "h";
        })
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(()=>{

    // setMention(prev=>{
    //   const newArr:MentionData[]=[...prev,{name:"ballu",title:"jallu",pic:"uu"}]
    //   return newArr
    // })

    getAllUsers()
   
  },[])

  useEffect(() => {
    callUser();
    getAllUserPosts();
  }, [params.id]);

  useEffect(() => {
    if (user != undefined) {
      checkIfFollow();
    }
  }, [user, present]);


  

  function postHandler() {
    
    if (!editorState.getCurrentContent().hasText() && !data?.url) {
      setErr(true);
      setMsg("both field cannot be empty");
      return;
    }

    const str=JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    const mainId = uuidv4();
    const data2 = {
      post:str,
      url: data?.url || "",
      addedBy: data?.user,
      imgurl: user.imgurl,
      name: user.name,
      likes: 0,
      dislikes: 0,
      docId: mainId,
      created_at:Timestamp.fromDate(new Date())
    };

   

    setLoading(true);
    
        data?.addPost("posts", mainId, data2)
      .then(() => {
        setErr(false);
        setMsg("successfully posted");
        
        setLoading(false);
        data.setPrgress(0);
        getAllUserPosts();
      })
      .catch((err) => {
        setErr(true);
        setMsg(err);
      });
  }

  function editHandler() {
    let editData: { name?: string; imgurl?: string; bio?: string } = {};

    let postData: { imgurl?: string; name?: string } = {};

    if (name) {
      editData.name = name;
      postData.name = name;
    }

    if (data?.url) {
      editData.imgurl = data.url;
      postData.imgurl = data.url;
    }

    if (bio) {
      editData.bio = bio;
    }

    if (Object.keys(editData).length > 0 && params && params.id) {
      setLoading(true);

      
       data?.updateOne(editData, "users", params.id)
        .then(() => {
          setErr(false);
          setMsg("edit successfull");
          setLoading(false);
          callUser();
          data.setPrgress(0)
          getAllUserPosts()
        })
        .catch((err) => {
          setErr(true);
          setMsg(err);
          setLoading(false);
        });
    }
  }

  async function follow() {
    try {
      if (params && params.id && data && data.user) {
        const userRef = doc(db, "users", params?.id);
        const followeeRef = doc(db, "users", data?.user);
        await updateDoc(userRef, {
          followers: arrayUnion(data.user),
        });

        await updateDoc(followeeRef, {
          followee: arrayUnion(params?.id),
        });

        setPresent(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function unfollow() {
    try {
      if (params && params.id && data && data.user) {
        const userRef = doc(db, "users", params?.id);
        const followeeRef = doc(db, "users", data.user);
        await updateDoc(userRef, {
          followers: arrayRemove(data.user),
        });

        await updateDoc(followeeRef, {
          followee: arrayRemove(params?.id),
        });
        setPresent(false);
      }
    } catch (err) {
      console.log(err);
    }
  }


  // functions from editor draft-js

  const ref = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [open, setOpen] = useState(false);
  

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      mentionComponent(mentionProps) {

        console.log(mentionProps,"9999999999999iiiii")
        return (
          <span
            className={mentionProps.className}
            // eslint-disable-next-line no-alert
            onClick={() => {navigate(`/profile/${mentionProps.mention.url}`)}}
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

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);
  

  useEffect(()=>{

    let val=backup.filter(item=>item.name.startsWith(str))
    console.log(val,"ffggg")
    setSuggestions(val)
  },[str.length])

  const onSearchChange = useCallback(
    ({value}:{value:string}) => {
       
        setStr(value)
       
      
      // getAllUsers()
      
      
    },
    []

    
  );

  return (
    <div className="w-[100%] min-h-[90vh] flex justify-start flex-col md:flex-row">
      <button
        onClick={() => {
          
          console.log(str);
        }}
      >
       
      </button>
      <div className="w-[100%] border-2 py-4 md:w-[20%]">
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <PhotoCircle
              url={user?.imgurl}
              width="w-[50px]"
              height="h-[50px]"
            />

            <div className="w-[100%] mb-4">
              <div className="text-center font-bold mb-2">{user?.name}</div>
              <div className="text-left pl-8 text-base text-gray-700">
                {user?.bio}
              </div>
            </div>
          </>
        )}

        <div className="text-center">
          <button
            className="px-[20px] py-0 rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500 text-white"
            onClick={
              params.id == data?.user
                ? handleClickOpen
                : present
                ? unfollow
                : follow
            }
          >
            {params.id == data?.user
              ? "Edit profile"
              : present
              ? "unfollow"
              : "follow"}
          </button>
        </div>
      </div>
      <div className="w-[100%] p-2 py-4 border-2 md:w-[60%]">
        {data?.user == params?.id ? (
          <>
          <div className="font-bold w-[50%] ">Make A Post</div><span className="text-xs text-gray-500">use @ to tag</span></>
        ) : null}



        
        <div className="cc" >
          {data?.user == params?.id ? (
            <>
              <div className="border-2 border-cyan-400 h-[20rem] overflow-y-auto"  onClick={() => {
        ref.current!.focus();
      }}>
                <Editor
                  editorKey={"editor"}
                  editorState={editorState}
                  onChange={setEditorState}
                  plugins={plugins}
                  ref={ref}
                />

              
                <MentionSuggestions
                  open={open}
                  onOpenChange={onOpenChange}
                  suggestions={suggestions}
                  onSearchChange={onSearchChange}
                  onAddMention={() => {
                    // get the mention object selected
                  }}
                />
                

                {/* <textarea onChange={(e)=>{setPost(e.target.value)}} value={post} className='border-2 border-gray-500 w-[100%] p-2 overflow-auto ' name="textArea" id="" placeholder='Type your post here'  rows={10}></textarea> */}
          </div>
              <div>
                <MuiFileInput
                  style={{ width: "90%" }}
                  value={value}
                  onChange={(e) => {
                    if (e != null) {
                      setValue(e);
                    }
                  }}
                />

                <span>
                  <ProgressBar value={Number(data?.progress1)} />

                  
                </span>
                <div className="flex justify-between items-center  mt-2 rounded-md border-2 mb-4">
                  <div className="w-[50%] ">
                    <button
                      className="mt-2 px-[20px] py-0 rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                      onClick={postHandler}
                    >
                      POST
                    </button>
                  </div>
                  <div className="w-[50%]  text-right">
                    <button
                      onClick={upload}
                      className="bg-blue-800 mt-2 text-white py-1 px-[20px] mr-[19%] rounded-3xl"
                    >
                      upload
                    </button>
                  </div>
                </div>
                {loading ? (
                  <CircularProgress />
                ) : err && msg ? (
                  <Alert severity="error" onClose={() => {
                    setMsg("")
                    setErr(false)
                  }}>{msg}</Alert>
                ) : !err && msg ? (
                  <Alert severity="success" onClose={() => {setMsg("")}}>{msg}</Alert>
                ) : null}
              </div>
            </>
          ) : null}

          {/* <div className='mb-8'>
            <button className='mt-2 px-[20px] py-0 rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500 text-white'>POST</button>

            </div> */}
      <div >
          {!posts ? (
            <CircularProgress />
          ) : posts.length == 0 ? (
            <h1>No posts to show</h1>
          ) : (
            posts.map((item: any, i) => {
              return (
                <div key={i}>
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
                </div>
              );
            })
          )}
        </div>
          {/* <div>
        <PostCard single={false} imagePresent={true} imgUrl='https://images.unsplash.com/photo-1692885228334-e3cdcb9cfad7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'/>
    </div>

    <div>
        <PostCard single={false} imagePresent={true} imgUrl='https://images.unsplash.com/photo-1692885228334-e3cdcb9cfad7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'/> */}
          {/* </div> */}
        </div>
      </div>

      {/* mui dialog box */}

      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open1}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
          fullWidth={true}
        >
          <DialogTitle id="responsive-dialog-title">
            {"Edit Profile"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <CustomInput
                label="Name"
                placeholder="enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <textarea
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                }}
                className="border-2 w-[100%] border-gray-500 p-2 overflow-auto mb-5 "
                name="textArea"
                id=""
                placeholder="write something about yourself"
                rows={10}
              ></textarea>

              <div>
                <label
                  htmlFor="img"
                  className="font-bold"
                  style={{ marginTop: "1rem" }}
                >
                  Profile pic
                </label>
                <MuiFileInput
                  id="img"
                  style={{ width: "90%" }}
                  value={profile}
                  onChange={(e) => {
                    if (e != null) {
                      setProfile(e);
                    }
                  }}
                />

                <span>
                  <ProgressBar value={Number(data?.progress1)} />
                </span>

                <div className="flex justify-between items-center  mt-2 rounded-md mb-4">
                  <div className="w-[50%] ">
                    <button
                      className="mt-2 px-[20px] py-0 rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                      onClick={editHandler}
                    >
                      EDIT
                    </button>
                  </div>
                  <div className="w-[50%]  text-right">
                    <button
                      onClick={uploadProfile}
                      className="bg-blue-800 mt-2 text-white py-1 px-[20px] mr-[19%] rounded-3xl"
                    >
                      upload
                    </button>
                  </div>
                </div>
                {loading ? (
                  <CircularProgress />
                ) : err && msg ? (
                  <Alert severity="error" onClose={() => {
                    setMsg("")
                    setErr(false)
                  
                  }}>{msg}</Alert>
                ) : !err && msg ? (
                  <Alert severity="success" onClose={() => {setMsg("")}}>{msg}</Alert>
                ) : null}
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Profile;
