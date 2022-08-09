import Head from "next/head";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";

const pos = { x: 0, y: 0 };
const restorePts = { a: 0, b: 0, c: 0, d: 0 };
export default function Home() {
  const [drawing, setDrawing] = useState(false);
  const [options, setOptions] = useState("pencil");
  const [points, setPoints] = useState([]);
  const [restorePoints, setRestorePoints] = useState([]);

  const [elements, setElements] = useState([]);
  const [pencil, setPencil] = useState([]);

  const canvasApi = useRef();
  const contextRef = useRef(null);

  const actualine = (x) => {
    const { options, start1, start2, end1, end2 } = x;
    const ctx = canvasApi.current.getContext("2d");
    if (options === "line") {
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
    // if (options === "pencil") {
    //   ctx.beginPath();
    //   ctx.stroke();
    // }
  };

  useEffect(() => {
    const ctx = canvasApi.current.getContext("2d");
    if (options === "line") {
      ctx.clearRect(0, 0, 950, 450);
      elements.forEach((ele) => actualine(ele.roughEle));
    }
    if (options === "rectangle") {
      ctx.clearRect(0, 0, 950, 450);
      elements.forEach((ele) => actualine(ele.roughEle));
    }
  }, [elements]);

  useEffect(() => {
    const ctx = canvasApi.current.getContext("2d");
    // ctx.clearRect(0, 0, 950, 450);
    if (options === "pencil") {
      // ctx.clearRect(0, 0, 950, 450);
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      contextRef.current = ctx;
      points.forEach((ele) => {
        contextRef.current.lineTo(ele.x, ele.y);
        contextRef.current.stroke();
      });
    }
  }, [points]);

  const drawShape = (options, start1, start2, end1, end2) => {
    const ctx = canvasApi.current.getContext("2d");
    const roughEle = { options, start1, start2, end1, end2 };
    if (options === "line") {
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
    return { options, start1, start2, end1, end2, roughEle };
  };

  const draw = (event) => {
    const ctx = canvasApi.current.getContext("2d");
    if (drawing) {
      const { clientX, clientY } = event;
      const index = elements.length - 1;
      if (options === "line") {
        const { options, start1, start2 } = elements[index];
        const updatedEle = drawShape("line", start1, start2, clientX, clientY);
        const copyElement = [...elements];
        copyElement[index] = updatedEle; //replacing last index
        setElements(copyElement);
      }
      if (options === "rectangle") {
        const { options, start1, start2 } = elements[index];
        const updatedEle = drawShape("rectangle", start1, start2, clientX, clientY);
        const copyElement = [...elements];
        copyElement[index] = updatedEle; //replacing last index
        setElements(copyElement);
      }
      if (options === "pencil") {
        contextRef.current = ctx;

        setPoints((state) => [...state, pos]);
        // setPencil((state) => [...state, [points]]);
        contextRef.current.moveTo(pos.x, pos.y);

        const { clientX, clientY } = event;
        pos.x = clientX;
        pos.y = clientY;
        restorePts.c = clientX;
        restorePts.d = clientY;
      }
    }
  };

  const startDrawing = (e) => {
    if (options === "line") {
      setDrawing(true);
      const newEle = drawShape("line", e.clientX, e.clientY, e.clientX, e.clientY);
      setElements((state) => [...state, newEle]);
    }
    if (options === "rectangle") {
      setDrawing(true);
      const newEle = drawShape("rectangle", e.clientX, e.clientY, e.clientX, e.clientY);
      setElements((state) => [...state, newEle]);
    }
    if (options === "pencil") {
      setDrawing(true);
      // setinitialPosition([e.clientX, e.clientY]);
      const { clientX, clientY } = e;
      pos.x = clientX;
      pos.y = clientY;
      restorePts.a = clientX;
      restorePts.b = clientY;
    }
  };

  const finishDrawing = (e) => {
    setDrawing(false);
  };

  const changeMode = (x) => {
    setOptions(x);
  };

  return (
    <div className={styles.container}>
      <>
        <div>Switch To</div>
        <div className={styles.options}>
          <span onClick={() => changeMode("line")}>Line</span>
          <span onClick={() => changeMode("rectangle")}>Rectangle</span>
          <span onClick={() => changeMode("pencil")}>Pencil</span>
          <div className={styles.mode}>{options}</div>
        </div>
      </>
      <canvas className={styles.canvas} id="tutorial" width="950" height="450" ref={canvasApi} onMouseDown={startDrawing} onMouseUp={finishDrawing} onMouseMove={draw}></canvas>
    </div>
  );
}
