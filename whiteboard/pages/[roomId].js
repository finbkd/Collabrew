import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { socketInit } from "../context/socket";
import styles from "../styles/Home.module.css";
import { HexColorPicker } from "react-colorful";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const pos = { x: 0, y: 0 };
const restorePts = { a: 0, b: 0, c: 0, d: 0 };

export default function Home() {
  let Peer;
  if (typeof navigator !== "undefined") {
    Peer = require("peerjs").default;
  }

  const [stream, setStream] = useState();
  const [other, setOther] = useState();
  const [change, setChange] = useState(false);

  const router = useRouter();
  const roomData = useSelector((state) => state.room.roomData);
  const inputText = useRef();

  const videoRef = useRef();
  const othervideoRef = useRef(null);

  const { roomId } = router.query;
  const socket = useRef();
  const [color, setColor] = useState("#000");
  const [otherUser, setOtherUser] = useState("");
  const [messages, setMessages] = useState([]);

  const textInputRef = useRef();

  const messageHandler = (e) => {
    setMessages((state) => [...state, { id: "a", user: roomData.name, msg: textInputRef.current.value }]);
    socket.current.emit("messageSend", { user: roomData.name, msg: textInputRef.current.value });
  };

  const messageHandlerr = (e) => {
    if (e.key === "Enter") {
      setMessages((state) => [...state, { id: "a", user: roomData.name, msg: textInputRef.current.value }]);
      socket.current.emit("messageSend", { id: "a", user: roomData.name, msg: textInputRef.current.value });
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  useEffect(() => {
    socket.current = socketInit();
  }, []);

  useEffect(() => {
    socket.current.emit("userJoined", roomData);
  }, []);

  useEffect(() => {
    socket.current.on("otherUserJoined", (x) => setOtherUser(x));
    socket.current.on("messageDelivered", (msg) => setMessages((state) => [...state, msg]));
  }, []);

  const [elementTypes, setElementTypes] = useState([]);
  const [undoElementType, setUndoElementTypes] = useState([]);

  const [restorepoints, setrestorePoints] = useState([]);
  const [points, setPoints] = useState([]);
  const [changes, setChanges] = useState(false);

  const [pencilElements, setPencilElements] = useState([]);
  const [otherpencilElements, setOtherPencilElements] = useState([]);

  const [undoElements, setUndoElements] = useState([]);
  const [undopencilElements, setUndoPencilElements] = useState([]);
  const [elements, setElements] = useState([]);
  const [otherUserElements, setOtherUserElements] = useState([]);
  const [myUserElements, setMyUserElements] = useState([]);
  const [currentElements, setCurrentELements] = useState([]);
  const [currentPencilElements, setCurrentPencilELements] = useState([]);

  const [eraser, setEraser] = useState(false);
  const [textInput, setTextInput] = useState(false);
  const [text, setText] = useState("Hey!");

  const [drawing, setDrawing] = useState(false);
  const [options, setOptions] = useState("pencil");

  const [colorPickerOption, setColorPickerOption] = useState(false);

  const canvasApi = useRef();
  const contextRef = useRef(null);

  useEffect(() => {
    canvasApi.current.width = window.innerWidth;
    // console.log(window.innerWidth);
    // console.log(window.innerWidth * 0.2);
    canvasApi.current.height = window.innerHeight;
  }, []);

  useEffect(() => {
    //* get user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream); //Get the current streaming media, and then set it to setStream state.
      videoRef.current.srcObject = currentStream;
      //save stream to myVideo ref, so could connect it to <video />
    });
  }, []);

  useEffect(() => {
    //PEER CONNECTION

    const peer = new Peer();

    peer.on("open", function (id) {
      // setMe(id);
      socket.current.emit("join room", id);

      socket.current.on("user-joined", (userId) => {
        console.log(userId);
        setOther(userId);
        peer.connect(userId);

        peer.call(userId, stream);
        console.log(`${userId} has been called`);
        console.log(`${id} this is my my id`);
        socket.current.emit("call the other user", id);
      });
    });

    socket.current.on("call the other user", (id) => {
      peer.call(id, stream);
    });

    peer.on("call", function (call) {
      console.log("this peer is being called");
      call.answer(stream);

      call.on("stream", function (stream) {
        console.log("streaming from other user");
        // setOtherStream(stream);
        // `stream` is the MediaStream of the remote peer.
        othervideoRef.current.srcObject = stream;

        // setOtherStream(true);
        // Here you'd add it to an HTML video/canvas element.
      });
    });
  }, [stream]);

  //a/ SOCKET IO FOR OTHER USER
  useEffect(() => {
    socket.current.on("lineDrew", (x) => {
      const { elements, otherUserElements, pencilElements, otherpencilElements } = x;

      setOtherUserElements(elements);
      setOtherPencilElements(pencilElements);

      const ctx = canvasApi?.current?.getContext("2d");
      ctx.clearRect(0, 0, 1200, 1200);

      elements.forEach((ele) => actualine(ele.roughEle));
      otherUserElements.forEach((ele) => actualine(ele.roughEle));
      pencilElements.forEach((elee) => {
        elee.restorepoints.forEach((ele, i) => {
          contextRef.current.strokeStyle = elee.color;
          const newEle = elee.restorepoints[i + 1];
          contextRef.current.beginPath();
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
        });
      });
      otherpencilElements.forEach((elee) => {
        elee.restorepoints.forEach((ele, i) => {
          contextRef.current.strokeStyle = elee.color;
          const newEle = elee.restorepoints[i + 1];
          contextRef.current.beginPath();
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
        });
      });
    });
  }, []);

  //a/ SOCKET IO FOR MY USER
  useEffect(() => {
    const ctx = canvasApi.current.getContext("2d");
    if (options === "line") {
      ctx.clearRect(0, 0, 1200, 1200);

      pencilElements.forEach((elee) => {
        elee.restorepoints.forEach((ele, i) => {
          contextRef.current.strokeStyle = elee.color;
          const newEle = elee.restorepoints[i + 1];
          contextRef.current.beginPath();
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
        });
      });

      otherpencilElements.forEach((elee) => {
        elee.restorepoints.forEach((ele, i) => {
          contextRef.current.strokeStyle = elee.color;
          const newEle = elee.restorepoints[i + 1];
          contextRef.current.beginPath();
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
        });
      });

      elements.forEach((ele) => actualine(ele.roughEle));
      otherUserElements.forEach((ele) => actualine(ele.roughEle));
      socket.current.emit("drawing", { elements, otherUserElements, pencilElements, otherpencilElements });
    }

    if (options === "rectangle") {
      ctx.clearRect(0, 0, 1200, 1200);

      pencilElements.forEach((elee) => {
        elee.restorepoints.forEach((ele, i) => {
          contextRef.current.strokeStyle = elee.color;
          const newEle = elee.restorepoints[i + 1];
          contextRef.current.beginPath();
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
        });
      });

      otherpencilElements.forEach((elee) => {
        elee.restorepoints.forEach((ele, i) => {
          contextRef.current.strokeStyle = elee.color;
          const newEle = elee.restorepoints[i + 1];
          contextRef.current.beginPath();
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
        });
      });

      elements.forEach((ele) => actualine(ele.roughEle));
      otherUserElements.forEach((ele) => actualine(ele.roughEle));
      socket.current.emit("drawing", { elements, otherUserElements, pencilElements, otherpencilElements });
    }
    if (options === "circle") {
      ctx.clearRect(0, 0, 1200, 1200);

      pencilElements.forEach((elee) => {
        elee.restorepoints.forEach((ele, i) => {
          contextRef.current.strokeStyle = elee.color;
          const newEle = elee.restorepoints[i + 1];
          contextRef.current.beginPath();
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
        });
      });

      otherpencilElements.forEach((elee) => {
        elee.restorepoints.forEach((ele, i) => {
          contextRef.current.strokeStyle = elee.color;
          const newEle = elee.restorepoints[i + 1];
          contextRef.current.beginPath();
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
        });
      });

      elements.forEach((ele) => actualine(ele.roughEle));
      otherUserElements.forEach((ele) => actualine(ele.roughEle));
      socket.current.emit("drawing", { elements, otherUserElements, pencilElements, otherpencilElements });
    }
    if (options === "text") {
      ctx.clearRect(0, 0, 1200, 1200);

      pencilElements.forEach((elee) => {
        elee.restorepoints.forEach((ele, i) => {
          contextRef.current.strokeStyle = elee.color;
          const newEle = elee.restorepoints[i + 1];
          contextRef.current.beginPath();
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
        });
      });

      otherpencilElements.forEach((elee) => {
        elee.restorepoints.forEach((ele, i) => {
          contextRef.current.strokeStyle = elee.color;
          const newEle = elee.restorepoints[i + 1];
          contextRef.current.beginPath();
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
        });
      });

      elements.forEach((ele) => actualine(ele.roughEle));
      otherUserElements.forEach((ele) => actualine(ele.roughEle));
      socket.current.emit("drawing", { elements, otherUserElements, pencilElements, otherpencilElements });
    }
    if (options === "pencil") {
      ctx.clearRect(0, 0, 1200, 1200);

      pencilElements.forEach((elee) => {
        elee.restorepoints.forEach((ele, i) => {
          contextRef.current.strokeStyle = elee.color;
          const newEle = elee.restorepoints[i + 1];
          contextRef.current.beginPath();
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
        });
      });

      otherpencilElements.forEach((elee) => {
        elee.restorepoints.forEach((ele, i) => {
          contextRef.current.strokeStyle = elee.color;
          const newEle = elee.restorepoints[i + 1];
          contextRef.current.beginPath();
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
        });
      });

      elements.forEach((ele) => actualine(ele.roughEle));
      otherUserElements.forEach((ele) => actualine(ele.roughEle));
      socket.current.emit("drawing", { elements, otherUserElements, pencilElements, otherpencilElements });
    }
  }, [elements, pencilElements, changes]);

  //a/ ACTUAl LINE
  const actualine = (x) => {
    if (!x) return;
    const { options, text, color, start1, start2, end1, end2 } = x;

    const ctx = canvasApi.current.getContext("2d");
    if (options === "line") {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(start1, start2);
      ctx.lineTo(end1, end2);
      ctx.stroke();
    }
    if (options === "rectangle") {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.rect(start1, start2, end1 - start1, end2 - start2);
      ctx.stroke();
    }
    if (options === "circle") {
      ctx.beginPath();
      // contextRef.current.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.arc(start1, end2, Math.abs(end1 - start1), 0, 2 * Math.PI, false);
      ctx.stroke();
    }
    if (options === "text") {
      // ctx.strokeStyle = color;
      ctx.font = "10px serif";
      ctx.fillText(text, start1, end1);
    }
  };

  //a/ PENCIL
  useEffect(() => {
    const ctx = canvasApi.current.getContext("2d");
    if (options === "pencil") {
      contextRef.current = ctx;

      points.forEach((ele) => {
        contextRef.current.lineTo(ele.x, ele.y);
        contextRef.current.stroke();
      });

      if (pencilElements.length !== 0) {
        pencilElements.forEach((elee) => {
          elee.restorepoints.forEach((ele, i) => {
            contextRef.current.strokeStyle = elee.color;
            const newEle = elee.restorepoints[i + 1];
            contextRef.current.beginPath();
            contextRef.current.moveTo(ele.clientX, ele.clientY);
            contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
            contextRef.current.stroke();
          });
        });

        elements.forEach((ele) => actualine(ele.roughEle));
      }
    }
  }, [points]);

  const drawShape = (options, text, color, start1, start2, end1, end2) => {
    const ctx = canvasApi.current.getContext("2d");
    const roughEle = { options, text, color, start1, start2, end1, end2 };
    if (options === "line") {
      // ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(start1, start2);
      ctx.lineTo(end1, end2);
      ctx.stroke();
    }
    if (options === "rectangle") {
      ctx.beginPath();
      ctx.rect(start1, start1, end1 - start1, end2 - start2);
      ctx.stroke();
    }
    if (options === "circle") {
      // ctx.strokeStyle = color;
      contextRef.current.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(start1, end2, Math.abs(end1 - start1), 0, 2 * Math.PI, false);
      ctx.stroke();
    }
    if (options === "text") {
      // ctx.strokeStyle = color;
      ctx.font = "10px serif";
      ctx.fillText(text, start1, end1);
    }
    return { options, text, color, start1, start2, end1, end2, roughEle };
  };

  //a/ DRAWING
  const draw = (event) => {
    const ctx = canvasApi.current.getContext("2d");
    if (drawing) {
      const index = elements.length - 1;
      if (options === "line") {
        const { clientX, clientY } = event;
        const { options, color, start1, start2 } = elements[index];
        const updatedEle = drawShape("line", text, color, start1, start2, clientX, clientY);
        const copyElement = [...elements];
        copyElement[index] = updatedEle; //replacing last index
        setElements(copyElement);
        setMyUserElements(copyElement);
      }
      if (options === "rectangle") {
        const { clientX, clientY } = event;
        const { options, color, start1, start2 } = elements[index];
        const updatedEle = drawShape("rectangle", text, color, start1, start2, clientX, clientY);
        const copyElement = [...elements];
        copyElement[index] = updatedEle; //replacing last index
        setElements(copyElement);
      }
      if (options === "circle") {
        const { clientX, clientY } = event;
        const { options, color, start1, start2 } = elements[index];
        const updatedEle = drawShape("circle", text, color, start1, start2, clientX, clientY);
        const copyElement = [...elements];
        copyElement[index] = updatedEle; //replacing last index
        setElements(copyElement);
      }
      if (options === "text") {
        const { clientX, clientY } = event;
        const { options, text, color, start1, start2 } = elements[index];
        const updatedEle = drawShape("text", text, color, start1, start2, clientX, clientY);
        const copyElement = [...elements];
        copyElement[index] = updatedEle; //replacing last index
        setElements(copyElement);
      }
      if (options === "pencil") {
        contextRef.current = ctx;

        setPoints((state) => [...state, pos]);

        if (eraser) {
          contextRef.current.strokeStyle = "#fff";
          contextRef.current.lineWidth = 1;
        } else {
          contextRef.current.strokeStyle = color;
        }
        contextRef.current.moveTo(pos.x, pos.y);

        setrestorePoints((state) => [...state, { clientX, clientY }]);

        const { clientX, clientY } = event;
        restorePts.c = clientX;
        restorePts.d = clientY;

        pos.x = clientX;
        pos.y = clientY;
      }
    }
  };

  //a/ START
  const startDrawing = (e) => {
    if (options === "line") {
      setDrawing(true);
      const newEle = drawShape("line", text, color, e.clientX, e.clientY, e.clientX, e.clientY);
      setElements((state) => [...state, newEle]);
    }
    if (options === "rectangle") {
      setDrawing(true);
      const newEle = drawShape("rectangle", text, color, e.clientX, e.clientY, e.clientX, e.clientY);
      setElements((state) => [...state, newEle]);
    }
    if (options === "circle") {
      setDrawing(true);
      const newEle = drawShape("circle", text, color, e.clientX, e.clientY, e.clientX, e.clientY);
      setElements((state) => [...state, newEle]);
    }
    if (options === "text") {
      setDrawing(true);
      const newEle = drawShape("text", text, color, e.clientX, e.clientY, e.clientX, e.clientY);
      setElements((state) => [...state, newEle]);
    }
    if (options === "pencil") {
      setDrawing(true);
      const { clientX, clientY } = e;
      pos.x = clientX;
      pos.y = clientY;
      restorePts.a = clientX;
      restorePts.b = clientY;
    }
  };

  //a/ END
  const finishDrawing = (e) => {
    setDrawing(false);
    if (options === "pencil" || options === "eraser") {
      if (eraser) {
        setPencilElements((state) => [...state, { color: "#fff", restorepoints }]);
      } else {
        setPencilElements((state) => [...state, { color, restorepoints }]);
      }
      setElementTypes((state) => [...state, "pencil"]);
    } else {
      setElementTypes((state) => [...state, "shape"]);
    }

    setrestorePoints([]);
    setPoints([]);
    setUndoElements([]);
    setUndoElementTypes([]);
    setUndoPencilElements([]);
  };

  const changeMode = (x) => {
    setOptions(x);
    if (eraser) {
      setEraser(false);
    }
  };

  const eraserHandler = (x) => {
    setEraser(true);
    setOptions("pencil");
  };

  const textHandler = () => {
    setTextInput(!textInput);
  };

  const textInputHandler = () => {
    setText(textInputRef.current.value);
    setTextInput(false);
    changeMode("text");
    textInputRef.current.value = "";
  };

  const colorPicker = () => {
    setColorPickerOption(!colorPickerOption);
  };

  const undoHandler = () => {
    const lastEle = elementTypes[elementTypes.length - 1];
    if (lastEle === "shape") {
      if (elements.length === 0) return;
      const undoElementz = elements.pop();
      setUndoElements((state) => [...state, undoElementz]);
      setCurrentELements(elements);
      const undoElementType = elementTypes.pop();
      setUndoElementTypes((state) => [...state, undoElementType]);
      setChanges(!changes);
    }
    if (lastEle === "pencil") {
      if (pencilElements.length === 0) return;
      const undoElementz = pencilElements.pop();
      setUndoPencilElements((state) => [...state, undoElementz]);
      setCurrentPencilELements(pencilElements);
      const undoElementType = elementTypes.pop();
      setUndoElementTypes((state) => [...state, undoElementType]);
      setChanges(!changes);
    }
  };

  const redoHandler = () => {
    console.log(undoElementType);
    const lastElementType = undoElementType[undoElementType.length - 1];

    if (lastElementType === "shape") {
      if (undoElements.length === 0) return;
      const redoElement = undoElements.pop();
      setElements((state) => [...state, redoElement]);
      setCurrentELements((state) => [...state, redoElement]);
      undoElementType.pop();
      setChanges(!changes);
    }
    if (lastElementType === "pencil") {
      if (undopencilElements.length === 0) return;
      const redoElement = undopencilElements.pop();
      setPencilElements((state) => [...state, redoElement]);
      setCurrentPencilELements((state) => [...state, redoElement]);
      undoElementType.pop();

      setChanges(!changes);
    }
  };

  return (
    <>
      <title>Collabrew | Online Whiteboard</title>
      <div className={styles.container}>
        <div className={styles.userContainer}>
          <div>{roomData.name}</div>
        </div>
        <div
          onClick={() => {
            router.push("/");
          }}
          className={styles.exit}
        >
          <img className={`${styles.optionIcon}`} src="/icons/exit.png" />
        </div>
        <div className={styles.canvasContainer}>
          <canvas className={styles.canvas} id="tutorial" ref={canvasApi} onMouseDown={startDrawing} onMouseUp={finishDrawing} onMouseMove={draw}></canvas>
          <div className={styles.options}>
            <div onClick={() => changeMode("line")} className={styles.option}>
              <img className={options === "line" ? `${styles.optionIcon}   ${styles.active}` : `${styles.optionIcon}`} src="/icons/line.png" />
            </div>
            <div onClick={() => changeMode("rectangle")} className={styles.option}>
              <img className={options === "rectangle" ? `${styles.optionIcon}   ${styles.active}` : `${styles.optionIcon}`} src="/icons/rectangle.png" />
            </div>
            <div onClick={() => changeMode("circle")} className={styles.option}>
              <img className={options === "circle" && !eraser ? `${styles.optionIcon}   ${styles.active}` : `${styles.optionIcon}`} src="/icons/circle.png" />
            </div>
            <div onClick={textHandler} className={styles.option}>
              <img className={options === "text" && !eraser ? `${styles.optionIcon}   ${styles.active}` : `${styles.optionIcon}`} src="/icons/text.png" />
            </div>
            {textInput && (
              <div className={styles.textInput}>
                <img className={styles.leftarrow} src="/icons/left.png" />
                <input className={styles.input} ref={textInputRef} placeholder={text} />
                <button className={styles.button} onClick={textInputHandler}>
                  Save
                </button>
              </div>
            )}
            <div onClick={() => changeMode("pencil")} className={styles.option}>
              <img className={options === "pencil" && !eraser ? `${styles.optionIcon}   ${styles.active}` : `${styles.optionIcon}`} src="/icons/pencil.png" />
            </div>
            <div className={styles.option}>
              <img onClick={colorPicker} className={options === "color" ? `${styles.optionIcon}   ${styles.active}` : `${styles.optionIcon}`} src="/icons/color-dropper.png" />
            </div>
            {/* {colorPickerOption && <HexColorPicker color={color} onChange={setColor} />} */}
            {colorPickerOption && (
              <div className={styles.colorPicker}>
                <img className={styles.leftarrow} src="/icons/left.png" />
                {colorPickerOption && <HexColorPicker color={color} onChange={setColor} />}
              </div>
            )}

            <div onClick={() => eraserHandler()} className={styles.option}>
              <img className={options === "pencil" && eraser ? `${styles.optionIcon}   ${styles.active}` : `${styles.optionIcon}`} src="/icons/eraser.png" />
            </div>
            <div onClick={() => undoHandler()} className={styles.option}>
              <img className={`${styles.optionIcon}`} src="/icons/undo.png" />
            </div>
            <div onClick={() => redoHandler()} className={styles.option}>
              <img className={`${styles.optionIcon}`} src="/icons/redo.png" />
            </div>
          </div>
        </div>
        <div className={styles.chatBox}>
          <div className={styles.videoContainer}>
            <div className={styles.ourUserVideoplayer}>
              <video autoPlay playsInline controls={false} ref={videoRef}>
                Your browser does not support the video tag.
              </video>
            </div>
            <div className={styles.otherUserVideoPlayer}>
              <video autoPlay playsInline controls={false} ref={othervideoRef}>
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <div className={styles.chatContainer}>
            {/* <div className={styles.chatHeader}>{otherUser?.name}</div> */}
            <div className={styles.chatContent}>
              {messages.map((msg) => {
                return (
                  <div key={msg.id} className={msg.user === roomData.name ? styles.myMessage : styles.otherUserMessage}>
                    {/* {msg.user !== roomData.name && <div className={styles.msg}>{msg.user}: </div>} */}
                    <div className={styles.msg}>{msg.msg}</div>
                  </div>
                );
              })}
            </div>
            <div className={styles.chatInputContainer}>
              <input className={styles.chatInput} ref={textInputRef} onKeyDown={messageHandlerr} />
              <button
                className={styles.chatBtn}
                onClick={(e) => {
                  messageHandler(e);
                }}
              >
                <img className={`${styles.sendIcon}`} src="/icons/send.png" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
