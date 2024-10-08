import { useEffect, useRef, useState } from "react";
import Client from "../components/client";
import Editor from "../components/Editor";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Socket } from "../Socket";
import Actions from "../components/Actions";
import toast from "react-hot-toast";

const EditorPage = ()=>{
    const [client ,setclient] = useState([])
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');

    const SocketRef = useRef(null);
    const location  = useLocation();
    const navigator = useNavigate();
    const {roomId} = useParams();
   const [showlang,setshowlang] = useState('')

    useEffect(()=>{
    const init = async ()=>{
   SocketRef.current = await Socket();

   SocketRef.current.on('connect_error' , ()=>{
    toast.error('Somthing Went Wrong!');
    navigator('/')
   })
   SocketRef.current.on('connect_failed' , ()=>{
    toast.error('Somthing Went Wrong!');
    navigator('/')
   })



   SocketRef.current.emit('join',{
    roomId,
    username: location?.state?.userId,
   })

   SocketRef.current.on('joined',({Clients,username,SocketId})=>{
    if(username!==location.state?.userId){
        toast.success(`${username} joined the room`)
    }
    const newarr = RemoveDublicate(Clients);
    setclient(newarr);
   })

   SocketRef.current.on(Actions.DISCONNECT,({socketId,username})=>{
     toast.success(`${username !== undefined ? username : ''} left the room`)
     setclient((prev)=>{
        return prev.filter((client)=>{
           return client.socketId !== socketId
        })
     })
    
   })

  
    }
    init();

    return ()=>{
         SocketRef?.current?.disconnect();
         SocketRef?.current?.off(Actions.JOINED)
         SocketRef.current?.off(Actions.DISCONNECT)
    }
    },[])

    
    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        setshowlang(e.target.value);
        toast.success(`${e.target.value} Selected!`)
        return {lang : e.target.value};
      };


    useEffect(()=>{
        if(SocketRef.current){
            SocketRef.current.emit('typingCode',{code,roomId});
            SocketRef.current.on('recCode',({code})=>{
             setCode(code);
            })
        }
    },[code,SocketRef.current])
    useEffect(()=>{
        if(SocketRef.current){
            SocketRef.current.emit('send-lang',{language,roomId});
                SocketRef.current.on('rec-lang',({language})=>{
                  setLanguage(language);
                  setshowlang(language);
                  })
        }
    },[language,SocketRef.current])


    const handleOnLeave = ()=>{
        SocketRef.current.emit('leaveRoom',{roomId});
        SocketRef.current.on('left',({socketId,username})=>{
        toast.success(`left the room`)
        })
        SocketRef.current.disconnect();
        navigator('/');
    }


    function RemoveDublicate(arr) {
        const Myarr = [];
       for(let i = 0 ; i< arr.length;i++){
        if(arr[i]?.username !== arr[i+1]?.username){
        Myarr[i] = arr[i];
        }
       }
       return Myarr;
    }

    const handleOnCopy = ()=>{
        if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(roomId)
        .then(()=>{
            toast.success('Copied to clipboard')
        }).catch(()=>{
            toast.error('Failed to copy to clipboard')
        })
    }else{
       const textarea =  document.createElement('textarea');
       textarea.value = roomId;
       document.body.appendChild(textarea);
       textarea.select();
       try{
        document.execCommand("copy");
        toast.success('Copied to clipboard')
       }catch(error){
        toast.error('Failed to copy to clipboard')
       }
    }
    }
 

  return(
    <>
     <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                      
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                     {client?.map((client)=>(
                        <Client key={client.socketid} username={client.username}/>
                     ))}
                    </div>
                </div>
                <button className="btn copyBtn" onClick={handleOnCopy}>
                    Copy ROOM ID
                </button>
                <button className="btn leaveBtn" onClick={handleOnLeave}>
                    Leave
                </button>
            </div>
            <div className="editorWrap">
            <Editor showlang={showlang} setshowlang ={setshowlang}  code={code} setCode={setCode} handleLanguageChange= {handleLanguageChange}  language= {language} setLanguage={setLanguage} />
            </div>
        </div>
    </>
  )
}
export default EditorPage;