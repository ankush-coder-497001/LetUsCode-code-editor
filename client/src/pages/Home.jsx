import { useRef, useState } from 'react';
import {v4 as uuidv4} from 'uuid';
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
const HomePage = ()=>{

    //generating automatic id for room 
    const [roomId , setroomId] = useState('')
    const [userId , setuserId] = useState('')
    const GenerateId = (e)=>{
        e.preventDefault();
        const Id  = uuidv4();
        setroomId(Id);
        toast.success("New Id Generated!")
    }

    //navigate from home to editor.
    const navigator = useNavigate()
    const joinRoom = ()=>{
        if(!roomId || !userId){
            toast.error("UserId and RoomId is requared!");
            return;
        }
      
        navigator(`/editor/${roomId}`,{
            state:{
                userId
            },
        })
    }

    const handleonEnter = (e)=>{
      if(e.code==='Enter'){
        joinRoom();
      }
    }


  return(
    <>
      <div className="homePageWrapper">
            <div className="formWrapper">
               
                <h4 className="mainLabel">Paste invitation ROOM ID</h4>
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        onChange={e=>setroomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleonEnter}
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        onChange={e=>setuserId(e.target.value)}
                        value={userId}
                        onKeyUp={handleonEnter}
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>
                        Join
                    </button>
                    <span className="createInfo">
                        If you don't have an invite then create &nbsp;
                        <a
                            href=""
                            className="createNewBtn"
                            onClick={e=>GenerateId(e)}
                        >
                            new room
                        </a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>
                    Built with 💛 &nbsp; by &nbsp;
                    <a href="https://ankush-kumar-gupta-portfolio.netlify.app/">Ankush Kumar Gupta</a>
                </h4>
            </footer>
        </div>
    </>
  )
}

export default HomePage;