'use client'

import React, { useState, useEffect, useReducer, useCallback, useRef, MouseEvent } from "react";
import Dpad from "../Dpad/dpad"
import styles from "../page.module.css";
// import { userAgent } from "next/server";

type Snake = {
  size: number,
  x: number,
  y: number,
  tail: number
}

type Food = {
  size: number,
  x: number,
  y: number,
}

const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
  // let target = e.currentTarget;
  // target.style.transform = `translateZ(4vw)`;
}

// USER THIS FOR THE DPAD
// https://stackoverflow.com/questions/74048836/in-javascript-is-there-a-click-and-drag-event-listener-for-mobiles

export default function Gameboy() {
  const handleResize = useCallback(
    (e: Event) => {
      sizeCanvas();

      if (!context || !squareCanvasSize || !snakeHeadSize) { return }

      context.fillStyle = "blue";

      context.fillRect(pos.x, pos.y, snakeHeadSize, snakeHeadSize);
    }, [])

  if (typeof window !== "undefined") {
    window.addEventListener('resize', handleResize);
  }

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [squareCanvasSize, setSquareCanvasSize] = useState<number | null>(null)

  const [snake, setSnake] = useState<Snake | null>(null);
  
  const [snakeHeadSize, setSnakeHeadSize] = useState<number | null>(null)
  // const [food, setFood] = useState

  const [start, setStart] = useState<boolean>(false);

  let minRender: number = 0;
  let maxRender: number | null = (squareCanvasSize != null && snakeHeadSize != null) ? squareCanvasSize - snakeHeadSize : null;

  const [pos, setPos] = useState({
    init: false,
    x: 0,
    y: 0  
  })

  let direction: string | null = null;

  useEffect(() => {
    // set canvas context and size

    debugger;

    sizeCanvas();

    if (!context || !squareCanvasSize || !snakeHeadSize) { return }

    context.fillStyle = "blue";

    if (pos.init == false) {
      setPos({
        init: true,
        x: (maxRender != null && minRender != null) ? Math.random() * (maxRender - minRender) + minRender : 0,
        y: (maxRender != null && minRender != null) ? Math.random() * (maxRender - minRender) + minRender : 0
      });
    }

    context.fillRect(pos.x, pos.y, snakeHeadSize, snakeHeadSize);
  }, );

  function sizeCanvas() {
    var canvasContainer = document.getElementById("Screen_Nest");
    if (!canvasContainer) {
      return;
    }

    // make it an even number by skimming off anything not divis by 100
    var h = canvasContainer.clientHeight;
    var w = canvasContainer.clientWidth;

    var average = h * 2 / 2;

    setSquareCanvasSize(average);
    setSnakeHeadSize(average / 15);

    //i.e. value other than null or undefined
    if (canvasRef.current) {
      canvasRef.current.height = h;
      canvasRef.current.width = w;
      const ctx = canvasRef.current.getContext("2d");
      setCanvas(canvasRef.current);
      setContext(ctx);
    }
  }

  function updateDirection(data: string) {

    setStart(true);

    if (!direction) {
      animate();
    }

    if (direction == "L" && data == "R") return;
    if (direction == "R" && data == "L") return;
    if (direction == "U" && data == "D") return;
    if (direction == "D" && data == "U") return;

    // this needs to update the dpad visual instead of the dpad itself... 
    // because now you may have pressed a direction and not be allowed to go that way... 
    // Or maybe it will turn that side red...  

    direction = data;
  }

  function animate() {
    if (start == false) { return };

    if (!context || !squareCanvasSize || !snakeHeadSize) {
      return;
    }

    var x = 0;
    var y = 0;

    var modifier = 150;

    switch (direction) {
      case "L":
        x = -squareCanvasSize / modifier;
        break;
      case "U":
        y = -squareCanvasSize / modifier;
        break;
      case "R":
        x = squareCanvasSize / modifier;
        break;
      case "D":
        y = squareCanvasSize / modifier;
        break;
    }

    context.clearRect(0, 0, squareCanvasSize, squareCanvasSize);
    pos.x = ((((pos.x + x) % squareCanvasSize) + squareCanvasSize) % squareCanvasSize);
    pos.y = ((((pos.y + y) % squareCanvasSize) + squareCanvasSize) % squareCanvasSize);

    context.fillStyle = "blue";
    context.fillRect(pos.x, pos.y, snakeHeadSize, snakeHeadSize);

    let yPeek = false;
    let xPeek = false;

    if (pos.x > squareCanvasSize - snakeHeadSize) {
      xPeek = true;
      // context.fillStyle = "purple";
      context.fillRect(0 - (squareCanvasSize - pos.x), pos.y, snakeHeadSize, snakeHeadSize);
    }

    if (pos.y > squareCanvasSize - snakeHeadSize) {
      yPeek = true;
      // context.fillStyle = "purple";
      context.fillRect(pos.x, 0 - (squareCanvasSize - pos.y), snakeHeadSize, snakeHeadSize);
    }

    if (xPeek && yPeek) {
      // need a 3rd extra renderer to fill the missing diagonal corner...
      // will this always be the 0,0 corder? I think so ...
      // context.fillStyle = "purple";
      context.fillRect(0 - (squareCanvasSize - pos.x), 0 - (squareCanvasSize - pos.y), snakeHeadSize, snakeHeadSize);
    }

    requestAnimationFrame(animate);
  }

  return (
    <div className={styles.gameboy}>
      <div className={styles.screen_nest} id="Screen_Nest">
        <canvas className={styles.screen} ref={canvasRef} />
      </div>
      <Dpad sendDirectionToGameboy={updateDirection} />
      <div className={styles.ab}>
        <div className={`${styles.a_button_nest}`}>
          <button className={styles.a_button}>
            <div className={styles.a_button_top} onMouseLeave={handleMouseLeave}>
              <span>A</span>
            </div>
          </button>
        </div>
        <div className={`${styles.b_button_nest}`}>
          <button className={`${styles.b_button}`}>
            <div className={`${styles.b_button_top}`}>
              <span>B</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}