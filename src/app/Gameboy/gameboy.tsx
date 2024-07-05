'use client'

import React, { useState, useEffect, useReducer, useCallback, useRef, MouseEvent } from "react";
import Dpad from "../Dpad/dpad"
import styles from "../page.module.css";
// import { userAgent } from "next/server";

// type Screen = {
//   canvasRef: HTMLCanvasElement | null,
//   canvas: HTMLCanvasElement | null,
//   size: number
// }

// type Snake = {
//   size: number,
//   x: number,
//   y: number,
//   tail: number,
//   init: boolean
// }

class Snake {
  constructor(public parent : Snake | null = null) {
    if (parent != null) {
      this.parent = parent;
      this.id = parent.id + 1;
    }
  }
  id: number = 0;
  size: number = 0;
  x: number = 0;
  y: number = 0;
  initialized: boolean = false;
  init = () => {

  };
  tail: Snake | null = null;
  draw = () => {

  };
}

class Food {
  size: number = 0;
  x: number = 0;
  y: number = 0;
  init: boolean = false;
}

const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
  // let target = e.currentTarget;
  // target.style.transform = `translateZ(4vw)`;
}

// USER THIS FOR THE DPAD
// https://stackoverflow.com/questions/74048836/in-javascript-is-there-a-click-and-drag-event-listener-for-mobiles

export default function Gameboy() {

  /* // Resize functionality 
  // const handleResize = useCallback(
  //   (e: Event) => {
  //     sizeCanvas(); // dont want this to reset x.y values on the snake

  //     if (!context || !squareCanvasSize || !snake.size) { return }

  //     context.fillStyle = "blue";

  //     context.fillRect(snake.x, snake.y, snake.size, snake.size);
  //   }, [])

  // if (typeof window !== "undefined") {
  //   window.addEventListener('resize', handleResize);
  // }
  */

  useEffect(() => {
    // set canvas context and size
    sizeCanvas();
    init();
  },);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [squareCanvasSize, setSquareCanvasSize] = useState<number | null>(null)
  const [start, setStart] = useState<boolean>(false);

  // TODO: I dont think i need the inits 
  const [snake, setSnake] = useState<Snake>(new Snake());
  const [food, setFood] = useState<Food>(new Food());

  let minRender: number = 0;
  let maxRender: number | null = (squareCanvasSize != null && snake.size != null) ? squareCanvasSize - snake.size : null;
  let direction: string | null = null;

  function sizeCanvas() {
    var canvasContainer = document.getElementById("Screen_Nest");

    if (!canvasContainer) {
      return;
    }

    // make it an even number by skimming off anything not divis by 100
    var h = canvasContainer.clientHeight;
    var w = canvasContainer.clientWidth;

    var screenAverage = h * 2 / 2;

    snake.size = (screenAverage * .06);
    setSquareCanvasSize(screenAverage);

    //i.e. value other than null or undefined
    if (canvasRef.current) {
      canvasRef.current.height = h;
      canvasRef.current.width = w;
      const ctx = canvasRef.current.getContext("2d");
      setCanvas(canvasRef.current);
      setContext(ctx);
    }
  }

  function init() {
    animate();
  }

  function updateSnake(x: number, y: number) {
    if (!context || !squareCanvasSize || !snake.size) { return }

    snake.size = snake.size;

    if (start) {
      snake.x = ((((snake.x + (x)) % squareCanvasSize) + squareCanvasSize) % squareCanvasSize);
      snake.y = ((((snake.y + (y)) % squareCanvasSize) + squareCanvasSize) % squareCanvasSize);

      // if i made the tail of type snake . and each snake had its own tail . 
      // I could probably run a nice chain that way
      // so each snake would manage its own tail .. etc etc .. 
      if (snake.tail != null) {
        drawTail();
      }
    }
    else if (!snake.init) {
      // init
      if (maxRender != null && minRender != null) {
        setSnake({
          id: 0,
          parent: null,
          size: snake.size,
          x: Math.random() * (maxRender - minRender) + minRender,
          y: Math.random() * (maxRender - minRender) + minRender,
          initialized: true,
          tail: null,
          init(){},
          draw(){}
        })
      }
    }

    context.fillStyle = "blue";
    context.fillRect(snake.x, snake.y, snake.size, snake.size);

    let yPeek = false;
    let xPeek = false;

    if (snake.x > squareCanvasSize - snake.size) {
      xPeek = true;
      // context.fillStyle = "purple";
      context.fillRect(0 - (squareCanvasSize - snake.x), snake.y, snake.size, snake.size);
    }

    if (snake.y > squareCanvasSize - snake.size) {
      yPeek = true;
      // context.fillStyle = "purple";
      context.fillRect(snake.x, 0 - (squareCanvasSize - snake.y), snake.size, snake.size);
    }

    if (xPeek && yPeek) {
      // need a 3rd extra renderer to fill the missing diagonal corner...
      // will this always be the 0,0 corder? I think so ...
      // context.fillStyle = "purple";
      context.fillRect(0 - (squareCanvasSize - snake.x), 0 - (squareCanvasSize - snake.y), snake.size, snake.size);
    }
  }

  function updateFood() {
    if (!context || !squareCanvasSize || !snake.size) { return }

    // snake position should be called before food position..
    // If the snsake moves into the food position ... 
    // then need to recalc food position ...

    // HERE : Check snake position 
    if (!food.init) {
      // init
      setFood({
        size: snake.size * .75,
        x: (maxRender != null && minRender != null) ? Math.random() * (maxRender - minRender) + minRender : 0,
        y: (maxRender != null && minRender != null) ? Math.random() * (maxRender - minRender) + minRender : 0,
        init: true
      });
    }
    else { // CALC THE BOUNDS
      var foodBounds = {
        top: food.y,
        bottom: food.y + food.size,
        left: food.x,
        right: food.x + food.size
      };

      var snakeBounds = {
        top: snake.y,
        bottom: snake.y + snake.size,
        left: snake.x,
        right: snake.x + snake.size
      }

      var withinX = (snakeBounds.left <= foodBounds.right && snakeBounds.right >= foodBounds.left)
      var withinY = (snakeBounds.top <= foodBounds.bottom && snakeBounds.bottom >= foodBounds.top)

      if (withinX && withinY) {
        snake.tail = new Snake;

        // on snake collision 
        food.size = snake.size * .75;
        food.x = (maxRender != null && minRender != null) ? Math.random() * (maxRender - minRender) + minRender : 0;
        food.y = (maxRender != null && minRender != null) ? Math.random() * (maxRender - minRender) + minRender : 0;
      }
    }

    context.fillStyle = "red";
    context.fillRect(food.x, food.y, food.size, food.size);
  }

  function drawTail() {
    if (!context || !squareCanvasSize || !snake.size) { return }

    var tailX = 0;
    var tailY = 0;

    if (direction == "U") {
      tailY = snake.y + snake.size;
      tailX = snake.x;
    }
    if (direction == "D") {
      tailY = snake.y - snake.size;
      tailX = snake.x;
    }
    if (direction == "L") {
      tailX = snake.x + snake.size;
      tailY = snake.y;
    }
    if (direction == "R") {
      tailX = snake.x - snake.size;
      tailY = snake.y;
    }

    context.fillStyle = "grey";
    context.fillRect(tailX, tailY, snake.size, snake.size);
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
    if (!context || !squareCanvasSize || !snake.size) {
      return;
    }

    var x = 0;
    var y = 0;

    var modifier = 300;

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

    updateSnake(x, y);
    updateFood();

    if (start) {
      requestAnimationFrame(animate);
    }
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