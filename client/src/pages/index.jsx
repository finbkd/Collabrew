import styles from "../styles/createroom.module.css";
import { v4 as uuidv4 } from "uuid";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setRoom } from "../store/roomSlice";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

const CreateRoom = () => {
  const navigate = useNavigate();
  const socket = useRef();
  // const router = useRouter();
  const [user, setUser] = useState();
  const [roomId, setRoomId] = useState(null);
  const [roomIds, setRoomsIds] = useState([]);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState();
  const [mode, setMode] = useState("Create");
  const [img, setImg] = useState(null);

  const roomIdInput = useRef();
  const nameInput = useRef();
  const roomIdInputJoin = useRef();
  const nameInputJoin = useRef();

  const dispatch = useDispatch();

  // useEffect(() => {
  //   socket.current = socketInit();
  // }, []);

  const joinHandler = () => {
    let userId = uuidv4();
    setUserId(userId);
    if (nameInputJoin.current.value === "") return;
    if (roomIdInputJoin.current.value === "") return;
    const exists = roomIds.map((room) => room === roomIdInputJoin.current.value);
    if (exists[0] === "false") {
      return;
    }
    const roomData = { name: nameInputJoin.current.value, roomId: roomIdInputJoin.current.value, userId, host: false, presenter: false };
    setUser(roomData);
    dispatch(setRoom({ roomData }));
    navigate(`/${roomIdInputJoin.current.value}`);
  };

  const generateRoomHandler = () => {
    let uuid = uuidv4();
    let roomID = uuid.substring(0, 4);
    // console.log(text);
    roomIdInput.current.value = roomID;
    setRoomId(roomID);
  };

  const submitHandler = () => {
    let userId = uuidv4();
    setUserId(userId);
    setUserName(nameInput.current.value);
    setRoomsIds((state) => [...state, roomId]);

    if (roomIdInput.current.value === "") return;
    if (nameInput.current.value === "") return;

    const roomData = { name: nameInput.current.value, roomId, userId, host: true, presenter: true };
    setUser(roomData);
    // socket.current.emit("userJoined", roomData);
    dispatch(setRoom({ roomData }));
    navigate(`/${roomId}`);
  };

  const modeHandler = (mode) => {
    setMode(mode);
  };

  return (
    <>
      <title>Collabrew | Online Whiteboard</title>
      {mode === "Create" && (
        <div className={styles.pageContainer}>
          <div className={styles.Header}>
            Collabrew
            <img className={`${styles.optionIcon}`} src="/icons/paint1.png" />
          </div>
          <div className={styles.roomContainer}>
            <div className={styles.header}>Create Room</div>
            <input className={styles.input} placeholder="Enter your name" ref={nameInput} />
            <div className={styles.generate}>
              <input className={`${styles.input} ${styles.generateInput}`} placeholder="CODE" ref={roomIdInput} value={roomIdInput?.current?.value} />
              <button onClick={generateRoomHandler} className={styles.generator}>
                Generate
              </button>
            </div>

            <button onClick={submitHandler} className={styles.submit}>
              Create a Room
            </button>
            <div className={styles.or}>or</div>
            <button onClick={() => modeHandler("Join")}>Join a Room</button>
          </div>
        </div>
      )}
      {mode === "Join" && (
        <div className={styles.pageContainer}>
          <div className={styles.Header}>
            Collabrew
            <img className={`${styles.optionIcon}`} src="/icons/paint1.png" />
          </div>
          <div className={styles.roomContainer}>
            <div className={styles.header}>Join Room</div>
            <input className={styles.input} placeholder="Enter your name" ref={nameInputJoin} />
            <input className={styles.input} placeholder="Enter Room code" ref={roomIdInputJoin} />
            <button onClick={joinHandler} className={styles.submit}>
              Join Room
            </button>
            <div className={styles.or}>or</div>
            <button onClick={() => modeHandler("Create")}>Create a Room</button>
          </div>
        </div>
      )}
    </>
  );
};
export default CreateRoom;
