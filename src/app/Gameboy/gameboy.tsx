'use client'

/* 
  THOUGHTS 

  1. Maybe don't allow the snake to turn back onto itself .. 
    - Just like you can't turn the exact opposite direction .. 
    - Since it can turn on a dime... it can turn onto itself if it is allowed to... 
      - This will cause it to overlap and honestly differenciating between that and the snake running into itself might be difficult.
      - And this may look bad ... 
  
  - The snake should not grow in sections ... 
    - It should just be one long rectngle 

  TODO: 
  
  - figure out how much needs to be stored ( is this based on tail size )
  - and then start to pop the values from the array ...
  
  - TRY : From the second the food gets picked up and the tail is added ... start tracking head the head or tail parent 
    - Track these movements down from head ... not exactly sure how many moves ahead I need to track 
      - Maybe I need to do this dynamically and grab the coordinates that the head is on when it collects the food 
*/

import React, { useState, useEffect, useReducer, useCallback, useRef, MouseEvent } from "react";
import Dpad from "../Dpad/dpad"
import styles from "../page.module.css";
// import { userAgent } from "next/server";

function calcCenter(x: number, y: number, size: number) {
  return { x: x + size / 2, y: y + size / 2 }
}

class Coordinates {
  x: number = 0;
  y: number = 0;
}

class Snake {
  size: number = 0;
  coords: Coordinates = {x: 0, y: 0};
  initialized: boolean = false;
  tail: Tail[] = new Array();
  direction: string | null = null;
  center: any = { x: 0, y: 0};
}

class Tail {
  size: number = 0;
  coords: Coordinates = {x: 0, y: 0};
  initialized: boolean = false;
  direction: string | null = null;
  center: any = { x: 0, y: 0};
  parent: Snake | Tail | null = null;
  parentTracker: Coordinates[] = new Array();
}

class Food {
  size: number = 0;
  coords: Coordinates = {x: 0, y: 0};
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

  //     context.fillRect(snake.coords.x, snake.coords.y, snake.size, snake.size);
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
      let updateCoords : Coordinates = {
        x: ((((snake.coords.x + (x)) % squareCanvasSize) + squareCanvasSize) % squareCanvasSize),
        y: ((((snake.coords.y + (y)) % squareCanvasSize) + squareCanvasSize) % squareCanvasSize)
      } 
      snake.coords = updateCoords;

      var i = 0;
      snake.tail.forEach((tail) => {
        drawTail(tail, i++);
      })
    }
    else if (!snake.initialized) {
      // init
      if (maxRender != null && minRender != null) {
        let initCoords : Coordinates = {
          x: Math.random() * (maxRender - minRender) + minRender,
          y: Math.random() * (maxRender - minRender) + minRender,
        };

        let initCoordsArr : Coordinates[] = new Array(initCoords);

        setSnake({
          size: snake.size,
          coords: initCoords,
          initialized: true,
          tail: snake.tail,
          direction: snake.direction,
          center: snake.center,
        })
      }
    }

    context.fillStyle = "blue";
    context.fillRect(snake.coords.x, snake.coords.y, snake.size, snake.size);

    let yPeek = false;
    let xPeek = false;

    if (snake.coords.x > squareCanvasSize - snake.size) {
      xPeek = true;
      // context.fillStyle = "purple";
      context.fillRect(0 - (squareCanvasSize - snake.coords.x), snake.coords.y, snake.size, snake.size);
    }

    if (snake.coords.y > squareCanvasSize - snake.size) {
      yPeek = true;
      // context.fillStyle = "purple";
      context.fillRect(snake.coords.x, 0 - (squareCanvasSize - snake.coords.y), snake.size, snake.size);
    }

    if (xPeek && yPeek) {
      // need a 3rd extra renderer to fill the missing diagonal corner...
      // will this always be the 0,0 corder? I think so ...
      // context.fillStyle = "purple";
      context.fillRect(0 - (squareCanvasSize - snake.coords.x), 0 - (squareCanvasSize - snake.coords.y), snake.size, snake.size);
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
        coords: {
          x: (maxRender != null && minRender != null) ? Math.random() * (maxRender - minRender) + minRender : 0,
          y: (maxRender != null && minRender != null) ? Math.random() * (maxRender - minRender) + minRender : 0,
        },
        init: true
      });
    }
    else { // CALC THE BOUNDS
      var foodBounds = {
        top: food.coords.y,
        bottom: food.coords.y + food.size,
        left: food.coords.x,
        right: food.coords.x + food.size
      };

      var snakeBounds = {
        top: snake.coords.y,
        bottom: snake.coords.y + snake.size,
        left: snake.coords.x,
        right: snake.coords.x + snake.size
      }

      var withinX = (snakeBounds.left <= foodBounds.right && snakeBounds.right >= foodBounds.left)
      var withinY = (snakeBounds.top <= foodBounds.bottom && snakeBounds.bottom >= foodBounds.top)

      if (withinX && withinY) {
        let newTail = new Tail();
        snake.tail.push(new Tail());

        // on snake collision 
        food.size = snake.size * .75;
        food.coords.x = (maxRender != null && minRender != null) ? Math.random() * (maxRender - minRender) + minRender : 0;
        food.coords.y = (maxRender != null && minRender != null) ? Math.random() * (maxRender - minRender) + minRender : 0;
      }
    }

    context.fillStyle = "red";
    context.fillRect(food.coords.x, food.coords.y, food.size, food.size);
  }

  function drawTail(tail: Tail, index: number) {
    if (!context || !squareCanvasSize || !snake.size) { return }

    // if tail index = 0 ... head is the reference 
    // else tail i - 1 == reference 

    let parent : Snake | Tail = (index == 0) ? snake : snake.tail[index - 1];
    let self : Tail = snake.tail[index];

    var tailSize = snake.size ; // * 0.95;

    // if (snake.direction == "U") {
    //   tailY = reference.y + reference.size + 2;
    //   tailX = reference.x;
    // }
    // if (snake.direction == "D") {
    //   tailY = reference.y - reference.size - 2;
    //   tailX = reference.x;
    // }
    // if (snake.direction == "L") {
    //   tailX = reference.x + reference.size + 2;
    //   tailY = reference.y;
    // }
    // if (snake.direction == "R") {
    //   tailX = reference.x - reference.size - 2;
    //   tailY = reference.y;
    // }

    context.fillStyle = "grey";
    // context.fillRect(tailX, tailY, tailSize, tailSize);
  }

  function updateDirection(data: string) {
    setStart(true);

    if (!snake.direction) {
      animate();
    }

    if (snake.direction == "L" && data == "R") return;
    if (snake.direction == "R" && data == "L") return;
    if (snake.direction == "U" && data == "D") return;
    if (snake.direction == "D" && data == "U") return;

    // this needs to update the dpad visual instead of the dpad itself... 
    // because now you may have pressed a direction and not be allowed to go that way... 
    // Or maybe it will turn that side red...  

    snake.direction = data;
  }

  function animate() {
    if (!context || !squareCanvasSize || !snake.size) {
      return;
    }

    var x = 0;
    var y = 0;

    var modifier = 200;

    switch (snake.direction) {
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