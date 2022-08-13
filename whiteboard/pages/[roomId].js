import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { socketInit } from "../context/socket";
import styles from "../styles/Home.module.css";
import { HexColorPicker } from "react-colorful";

const pos = { x: 0, y: 0 };
const restorePts = { a: 0, b: 0, c: 0, d: 0 };

export default function Home() {
  const socket = useRef();

  useEffect(() => {
    socket.current = socketInit();
  }, []);

  const [color, setColor] = useState("#000");
  const [points, setPoints] = useState([]);
  const [restorepoints, setrestorePoints] = useState([]);

  const [pencilElements, setPencilElements] = useState([]);

  const [drawing, setDrawing] = useState(false);
  const [options, setOptions] = useState("pencil");

  const [elements, setElements] = useState([]);
  const [otherUserElements, setOtherUserElements] = useState([]);
  const [myUserElements, setMyUserElements] = useState([]);

  const [colorPickerOption, setColorPickerOption] = useState(false);

  const canvasApi = useRef();
  const contextRef = useRef(null);

  //a/ SOCKET IO FOR OTHER USER
  useEffect(() => {
    socket.current.on("lineDrew", (x) => {
      const { elements, otherUserElements, pencilElements } = x;

      setOtherUserElements(elements);

      const ctx = canvasApi?.current?.getContext("2d");
      ctx.clearRect(0, 0, 950, 450);

      elements.forEach((ele) => actualine(ele.roughEle));
      otherUserElements.forEach((ele) => actualine(ele.roughEle));
      pencilElements?.forEach((elee) => {
        elee.forEach((ele, i) => {
          const newEle = elee[i + 1];
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
          ctx.beginPath();
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
        elee.forEach((ele, i) => {
          const newEle = elee[i + 1];
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
          ctx.beginPath();
        });
      });

      elements.forEach((ele) => actualine(ele.roughEle));
      otherUserElements.forEach((ele) => actualine(ele.roughEle));
      socket.current.emit("drawing", { elements, otherUserElements, pencilElements });
    }

    if (options === "rectangle") {
      ctx.clearRect(0, 0, 950, 450);

      pencilElements.forEach((elee) => {
        elee.forEach((ele, i) => {
          const newEle = elee[i + 1];
          contextRef.current.moveTo(ele.clientX, ele.clientY);
          contextRef.current.lineTo(newEle?.clientX, newEle?.clientY);
          contextRef.current.stroke();
          ctx.beginPath();
        });
      });

      elements.forEach((ele) => actualine(ele.roughEle));
      otherUserElements.forEach((ele) => actualine(ele.roughEle));
      socket.current.emit("drawing", { elements, otherUserElements, pencilElements });
    }
    if (options === "pencil") {
      socket.current.emit("drawing", { elements, otherUserElements, pencilElements });
    }
  }, [elements, pencilElements]);

  //a/ ACTUAl LINE
  const actualine = (x) => {
    if (!x) return;
    const { options, color, start1, start2, end1, end2 } = x;

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
  };

  //a/ PENCIL
  useEffect(() => {
    const ctx = canvasApi.current.getContext("2d");
    if (options === "pencil") {
      contextRef.current = ctx;

      contextRef.current.strokeStyle = color;
      points.forEach((ele) => {
        contextRef.current.lineTo(ele.x, ele.y);
        contextRef.current.stroke();
      });
    }
  }, [points]);

  const drawShape = (options, color, start1, start2, end1, end2) => {
    const ctx = canvasApi.current.getContext("2d");
    const roughEle = { options, color, start1, start2, end1, end2 };
    if (options === "line") {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(start1, start2);
      ctx.lineTo(end1, end2);
      ctx.stroke();
    }
    if (options === "rectangle") {
      ctx.beginPath();
      ctx.rect(start1, start2, end1 - start1, end2 - start2);
      ctx.stroke();
    }
    return { options, color, start1, start2, end1, end2, roughEle };
  };

  //a/ DRAWING
  const draw = (event) => {
    const ctx = canvasApi.current.getContext("2d");
    if (drawing) {
      const index = elements.length - 1;
      if (options === "line") {
        const { clientX, clientY } = event;
        const { options, color, start1, start2 } = elements[index];
        const updatedEle = drawShape("line", color, start1, start2, clientX, clientY);
        const copyElement = [...elements];
        copyElement[index] = updatedEle; //replacing last index
        setElements(copyElement);
        setMyUserElements(copyElement);
      }
      if (options === "rectangle") {
        const { clientX, clientY } = event;
        const { options, color, start1, start2 } = elements[index];
        const updatedEle = drawShape("rectangle", color, start1, start2, clientX, clientY);
        const copyElement = [...elements];
        copyElement[index] = updatedEle; //replacing last index
        setElements(copyElement);
      }
      if (options === "pencil") {
        contextRef.current = ctx;

        setPoints((state) => [...state, pos]);

        contextRef.current.strokeStyle = color;
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
      const newEle = drawShape("line", color, e.clientX, e.clientY, e.clientX, e.clientY);
      setElements((state) => [...state, newEle]);
    }
    if (options === "rectangle") {
      setDrawing(true);
      const newEle = drawShape("rectangle", color, e.clientX, e.clientY, e.clientX, e.clientY);
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
    setPencilElements((state) => [...state, restorepoints]);
    setrestorePoints([]);
    setPoints([]);
  };

  const changeMode = (x) => {
    setOptions(x);
  };

  const colorPicker = () => {
    setColorPickerOption(!colorPickerOption);
  };

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
          <div onClick={() => changeMode("pencil")} className={styles.option}>
            <img className={options === "pencil" ? `${styles.optionIcon}   ${styles.active}` : `${styles.optionIcon}`} src="/icons/pencil.png" />
          </div>
          <div className={styles.option}>
            <img onClick={colorPicker} className={options === "colorr" ? `${styles.optionIcon}   ${styles.active}` : `${styles.optionIcon}`} src="/icons/color-dropper.png" />
          </div>
          {colorPickerOption && <HexColorPicker color={color} onChange={setColor} />}
        </div>
      </div>
      <div className={styles.chatBox}>CHAT BOX</div>
    </div>
  );
}
