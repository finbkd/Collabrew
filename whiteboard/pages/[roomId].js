import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { socketInit } from "../context/socket";
import styles from "../styles/Home.module.css";
import { HexColorPicker } from "react-colorful";

const pos = { x: 0, y: 0 };
const restorePts = { a: 0, b: 0, c: 0, d: 0 };

export default function Home() {
  const socket = useRef();
  const [color, setColor] = useState("#000");

  const textInputRef = useRef();

  useEffect(() => {
    socket.current = socketInit();
  }, []);

  const [restorepoints, setrestorePoints] = useState([]);
  const [points, setPoints] = useState([]);
  const [changes, setChanges] = useState(false);

  const [pencilElements, setPencilElements] = useState([]);
  const [otherpencilElements, setOtherPencilElements] = useState([]);

  const [undoElements, setUndoElements] = useState([]);
  const [elements, setElements] = useState([]);
  const [otherUserElements, setOtherUserElements] = useState([]);
  const [myUserElements, setMyUserElements] = useState([]);
  const [currentElements, setCurrentELements] = useState([]);

  const [eraser, setEraser] = useState(false);
  const [textInput, setTextInput] = useState(false);
  const [text, setText] = useState("Hey!");

  const [drawing, setDrawing] = useState(false);
  const [options, setOptions] = useState("pencil");

  const [colorPickerOption, setColorPickerOption] = useState(false);

  const canvasApi = useRef();
  const contextRef = useRef(null);

  //a/ SOCKET IO FOR OTHER USER
  useEffect(() => {
    socket.current.on("lineDrew", (x) => {
      const { elements, otherUserElements, pencilElements, otherpencilElements } = x;

      setOtherUserElements(elements);
      setOtherPencilElements(pencilElements);

      const ctx = canvasApi?.current?.getContext("2d");
      ctx.clearRect(0, 0, 950, 450);

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
      ctx.clearRect(0, 0, 950, 450);

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
      ctx.clearRect(0, 0, 950, 450);

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
      ctx.clearRect(0, 0, 950, 450);

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
      ctx.clearRect(0, 0, 950, 450);

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
    if (eraser) {
      setPencilElements((state) => [...state, { color: "#fff", restorepoints }]);
    } else {
      setPencilElements((state) => [...state, { color, restorepoints }]);
    }
    setrestorePoints([]);
    setPoints([]);
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
    if (elements.length === 0) return;
    const undoElementz = elements.pop();
    setUndoElements((state) => [...state, undoElementz]);
    setCurrentELements(elements);
    setChanges(!changes);

    // elements.forEach((ele) => actualine(ele.roughEle));
    // otherUserElements.forEach((ele) => actualine(ele.roughEle));
  };

  const redoHandler = () => {
    if (undoElements.length === 0) return;
    const redoElement = undoElements.pop();
    setElements((state) => [...state, redoElement]);
    setCurrentELements((state) => [...state, redoElement]);
    setChanges(!changes);

    // elements.forEach((ele) => actualine(ele.roughEle));
    // otherUserElements.forEach((ele) => actualine(ele.roughEle));
  };

  useEffect(() => {
    if (elements > currentElements) {
      setUndoElements([]);
    }
  }, [elements, currentElements]);

  return (
    <div className={styles.container}>
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
          {colorPickerOption && <HexColorPicker color={color} onChange={setColor} />}
          <div onClick={() => eraserHandler()} className={styles.option}>
            <img className={options === "pencil" && eraser ? `${styles.optionIcon}   ${styles.active}` : `${styles.optionIcon}`} src="/icons/eraser.png" />
          </div>
          <div onClick={() => undoHandler()} className={styles.option}>
            <img className={options === "pencil" && eraser ? `${styles.optionIcon}   ${styles.active}` : `${styles.optionIcon}`} src="/icons/undo.png" />
          </div>
          <div onClick={() => redoHandler()} className={styles.option}>
            <img className={options === "pencil" && eraser ? `${styles.optionIcon}   ${styles.active}` : `${styles.optionIcon}`} src="/icons/redo.png" />
          </div>
        </div>
      </div>
      <div className={styles.chatBox}>CHAT BOX</div>
    </div>
  );
}
