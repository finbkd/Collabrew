import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [drawing, setDrawing] = useState(false);
  const [initialPosition, setinitialPosition] = useState();
  const [finalPosition, setFinalPosition] = useState();
  const [options, setOptions] = useState("rectangle");

  const canvasApi = useRef();

  const draw = (ctx) => {
    if (drawing) {
      if (options === "line") {
        ctx.beginPath();
        ctx.moveTo(initialPosition[0], initialPosition[1]);
        ctx.lineTo(finalPosition[0], finalPosition[1]);
        ctx.stroke();
        // setinitialPosition([finalPosition[0], finalPosition[1]]);
        setDrawing(false);
      }
      if (options === "rectangle") {
        ctx.rect(initialPosition[0], initialPosition[1], finalPosition[0] - initialPosition[0], finalPosition[1] - initialPosition[1]);

        ctx.stroke();
        setDrawing(false);
      }
    }
  };

  useEffect(() => {
    const ctx = canvasApi.current.getContext("2d");
    // ctx.clearRect(0, 0, 950, 450);
    draw(ctx);
  }, [draw]);

  const startDrawing = (e) => {
    // const startPosition = (e.clientX, e.clientY);
    setinitialPosition([e.clientX, e.clientY]);
  };
  const finishDrawing = (e) => {
    setFinalPosition([e.clientX, e.clientY]);
    setDrawing(true);
  };

  return (
    <div className={styles.container}>
      <canvas className={styles.canvas} id="tutorial" width="950" height="450" ref={canvasApi} onMouseDown={startDrawing} onMouseUp={finishDrawing}></canvas>
    </div>
  );
}
