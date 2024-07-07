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

class Coordinates {
  x: number = 0;
  y: number = 0;
}

class Boundaries {
  top: number = 0;
  bottom: number = 0;
  left: number = 0;
  right: number = 0;
}

class Snake {
  size: number = 0;
  coords: Coordinates = { x: 0, y: 0 };
  bounds: Boundaries = new Boundaries();
  initialized: boolean = false;
  tail: Tail[] = new Array();
  direction: string | null = null;
  moveHistory: Coordinates[] = new Array() // I cannot rely on this in the instance that food is gathered before 50 moves/frames
}

// TODO: Will need to allow the tail elements to move off of the length of this array ... 
// each time the headm moves .. a value is a added to this list.

class Tail {
  size: number = 0;
  coords: Coordinates = { x: 0, y: 0 };
  bounds: Boundaries = new Boundaries();
  initialized: boolean = false;
  direction: string | null = null;
  parent: Snake | Tail | null = null;
  parentTracker: Coordinates[] = new Array();
}

class Food {
  size: number = 0;
  coords: Coordinates = { x: 0, y: 0 };
  init: boolean = false;
}

const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
  // let target = e.currentTarget;
  // target.style.transform = `translateZ(4vw)`;
}

// USER THIS FOR THE DPAD
// https://stackoverflow.com/questions/74048836/in-javascript-is-there-a-click-and-drag-event-listener-for-mobiles

export default function Gameboy() {

  var stop = false;

  var modifier = 100;

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

    if (h < 400) {
      modifier = modifier * 0.7;
    }

    var screenAverage = h * 2 / 2;

    snake.size = (screenAverage * .06);
    setSquareCanvasSize(screenAverage);

    debugger;

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

    if (start) {
      let updateCoords: Coordinates = {
        x: ((((snake.coords.x + (x)) % squareCanvasSize) + squareCanvasSize) % squareCanvasSize),
        y: ((((snake.coords.y + (y)) % squareCanvasSize) + squareCanvasSize) % squareCanvasSize)
      }

      snake.coords = updateCoords;
      // if (snake.moveHistory.length == 30) {
      //   debugger;
      //   snake.moveHistory.shift();
      // }
      snake.moveHistory.push(updateCoords);

      snake.bounds = {
        top: snake.coords.y,
        bottom: snake.coords.y + snake.size,
        left: snake.coords.x,
        right: snake.coords.x + snake.size
      }

      let i = 0;
      snake.tail.forEach((tail) => {
        drawTail(tail, i);
        i += 1;
      })
    }
    else if (!snake.initialized) {
      // init
      if (maxRender != null && minRender != null) {
        let initCoords: Coordinates = {
          x: Math.random() * (maxRender - minRender) + minRender,
          y: Math.random() * (maxRender - minRender) + minRender,
        };

        setSnake({
          size: snake.size,
          coords: initCoords,
          bounds: snake.bounds,
          initialized: true,
          tail: snake.tail,
          direction: snake.direction,
          moveHistory: new Array()
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

      // TODO: Apply boundary math to these ...

      var foodBounds = {
        top: food.coords.y,
        bottom: food.coords.y + food.size,
        left: food.coords.x,
        right: food.coords.x + food.size
      };

      var withinX = (snake.bounds.left <= foodBounds.right && snake.bounds.right >= foodBounds.left)
      var withinY = (snake.bounds.top <= foodBounds.bottom && snake.bounds.bottom >= foodBounds.top)

      if (withinX && withinY) {
        let newTail = new Tail();

        newTail.parent = snake.tail.length == 0 ? snake : snake.tail[snake.tail.length - 1];
        snake.tail.push(newTail);

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

    let history = snake.moveHistory;
    let historySize = snake.moveHistory.length;

    // can i spread them out by size of snake head and snake tail? 

    let lookback = historySize - ((index + 5));

    let point = history[lookback]; // this is just for testing and this will not work below 50

    context.fillStyle = "skyblue";

    tail.size = snake.size * 0.8;

    let difference = snake.size - tail.size;

    tail.coords = {
      x: point.x + difference / 2,
      y: point.y + difference / 2
    }

    tail.bounds = {
      top: tail.coords.y,
      bottom: tail.coords.y + tail.size,
      left: tail.coords.x,
      right: tail.coords.x + tail.size
    }

    if (index > 10) {
      // not worth checking the collision before this really ... This may just be lazy though 
      let withinY = snake.bounds.top <= tail.bounds.bottom && snake.bounds.bottom >= tail.bounds.top;
      let withinX = snake.bounds.right >= tail.bounds.left && snake.bounds.left <= tail.bounds.right;

      if (withinX && withinY) {
        stop = true;
        debugger;
      }
    }

    // if boundaries of tail coords plus box size confllict with head ..
    // stop = true;

    context.fillRect(tail.coords.x, tail.coords.y, tail.size, tail.size);
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

    if (start && stop == false) {
      requestAnimationFrame(animate);
    }
    else if (stop == true) {
      debugger;
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