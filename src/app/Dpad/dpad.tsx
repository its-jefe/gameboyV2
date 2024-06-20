'use client'
import styles from "../page.module.css";
import { MouseEvent } from "react";

export default function DPad({sendDirectionToGameboy}: any) {
  let currentDir = "";
  let percentX = 0;
  let percentY = 0;
  
  let leftButtonObserved = false;
  let upButtonObserved = false;
  let rightButtonObserved = false;
  let downButtonObserved = false;

  let leftButton : HTMLDivElement; // = document.querySelector(`#dpad_left`) as HTMLDivElement;
  let upButton : HTMLDivElement; //  = document.querySelector(`#dpad_up`) as HTMLDivElement;
  let rightButton : HTMLDivElement; //  = document.querySelector(`#dpad_right`) as HTMLDivElement;
  let downButton : HTMLDivElement; //  = document.querySelector(`#dpad_down`) as HTMLDivElement;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    let newDir = "";

    let target = e.currentTarget;
    let rect = target.getBoundingClientRect();
    
    let posX = e.clientX - rect.left; //x position within the element.
    let posY = e.clientY - rect.top;  //y position within the element.
    
    percentX = Math.floor(posX * 100 / rect.width + 1 - 50) / 10;
    percentY = Math.floor(posY * 100 / rect.height + 1 - 50) / 10;
    
    if (Math.abs(percentX) > Math.abs(percentY)) {
      newDir = percentX > 0 ? "R" : "L";
    }
    else if (Math.abs(percentY) > Math.abs(percentX)) {
      newDir = percentY > 0 ? "D" : "U";
    }
    
    if (!leftButtonObserved){
      leftButton = target.querySelector(`#dpad_left`) as HTMLDivElement;
    }
    if (!upButtonObserved){
      upButton = target.querySelector(`#dpad_up`) as HTMLDivElement;
    }
    if (!rightButtonObserved){
      rightButton = target.querySelector(`#dpad_right`) as HTMLDivElement;
    }
    if (!downButtonObserved){
      downButton = target.querySelector(`#dpad_down`) as HTMLDivElement;
    }
    
    switch (newDir) {
      case "L":
        leftButton.style.color = "rgba(113, 255, 194, 0.5)";
        upButton.style.color = "rgb(105, 105, 105)";
        rightButton.style.color = "rgb(105, 105, 105)";
        downButton.style.color = "rgb(105, 105, 105)";
        break;
      case "U":
        leftButton.style.color = "rgb(105, 105, 105)";
        upButton.style.color = "rgba(113, 255, 194, 0.5)";
        rightButton.style.color = "rgb(105, 105, 105)";
        downButton.style.color = "rgb(105, 105, 105)";
        break;
      case "R":
        leftButton.style.color = "rgb(105, 105, 105)";
        upButton.style.color = "rgb(105, 105, 105)";
        rightButton.style.color = "rgba(113, 255, 194, 0.5)";
        downButton.style.color = "rgb(105, 105, 105)";
        break;
      case "D":
        leftButton.style.color = "rgb(105, 105, 105)";;
        upButton.style.color = "rgb(105, 105, 105)";
        rightButton.style.color = "rgb(105, 105, 105)";
        downButton.style.color = "rgba(113, 255, 194, 0.5)";
        break;
    }

    if (newDir != "" && currentDir != newDir){
      if (currentDir == "R" && newDir == "L") {
        rightButton.style.color = "rgba(113, 255, 194, 0.5)";
        leftButton.style.color = "rgb(105, 33, 33)";
        return;
      }
      if (currentDir == "L" && newDir == "R") {
        leftButton.style.color = "rgba(113, 255, 194, 0.5)";
        rightButton.style.color = "rgb(105, 33, 33)";
        return;
      }
      if (currentDir == "U" && newDir == "D") {
        upButton.style.color = "rgba(113, 255, 194, 0.5)";
        downButton.style.color = "rgb(105, 33, 33)";
        return;
      }
      if (currentDir == "D" && newDir == "U") {
        downButton.style.color = "rgba(113, 255, 194, 0.5)";
        upButton.style.color = "rgb(105, 33, 33)";
        return;
      }
      currentDir = newDir;
      sendDirectionToGameboy(newDir as string);
    }

    // so if 0 nothing. aka use existing val

    // console.log(percentX, percentY);
    // console.log(xDir)

    target.style.transform = `rotateX(${-percentY}deg) rotateY(${percentX}deg)`;
  };

  const handleMouseLeave =  (e: MouseEvent<HTMLDivElement>) => {
    // ez
    if (currentDir == "L"){
      rightButton.style.color = "rgb(105, 105, 105)";
    }
    if (currentDir == "R"){
      leftButton.style.color = "rgb(105, 105, 105)";
    }
    if (currentDir == "U"){
      downButton.style.color = "rgb(105, 105, 105)";
    }
    if (currentDir == "D"){
      upButton.style.color = "rgb(105, 105, 105)";
    }
    // let target = e.currentTarget;
    // leftButton.style.color = "rgb(105, 105, 105)";
    // upButton.style.color = "rgb(105, 105, 105)";
    // rightButton.style.color = "rgb(105, 105, 105)";
    // downButton.style.color = "rgb(105, 105, 105)";  
  }

  return (
    <div className={styles.dpad} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className={styles.dpad_top} >
        <div className={styles.dpad_top_transparent} >
          <button className={`${styles.up_button}`}>
            <div className={`${styles.up_button_top}`} id="dpad_up">
              <span>⇧</span>
            </div>
          </button>
          <button className={`${styles.left_button}`}>
            <div className={`${styles.left_button_top}`} id="dpad_left">
              <span>⇧</span>
            </div>
          </button>
          <div className={styles.dpad_spacer}>
            <div className={styles.dpad_spacer_top}></div>
          </div>
          <button className={`${styles.right_button}`}>
            <div className={`${styles.right_button_top}`} id="dpad_right">
              <span>⇧</span>
            </div>
          </button>
          <button className={`${styles.down_button}`}>
            <div className={`${styles.down_button_top}`} id="dpad_down">
              <span>⇧</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
