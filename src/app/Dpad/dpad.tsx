'use client'
import styles from "../page.module.css";
import { MouseEvent } from "react";

export default function DPad() {
  let currentDir = "";
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    let target = e.currentTarget;
    let rect = target.getBoundingClientRect();

    let posX = e.clientX - rect.left; //x position within the element.
    let posY = e.clientY - rect.top;  //y position within the element.

    let percentX = Math.floor(posX * 100 / rect.width + 1 - 50) / 10;
    let percentY = Math.floor(posY * 100 / rect.height + 1 - 50) / 10;

    if (Math.abs(percentX) > Math.abs(percentY)){
        currentDir = percentX > 0 ? "Right": "Left";
    }
    else if (Math.abs(percentY) > Math.abs(percentX)){
      currentDir = percentY > 0 ? "Down": "Up";
    }

    console.log(currentDir);

    switch(currentDir) {
      case "L":
        var button = target.querySelector("left_button_top");
        break;
      case "U":
        var button = target.querySelector("up_button_top");
        break;
      case "R":
        var button = target.querySelector("right_button_top");
        break;
      case "D":
        var button = target.querySelector("down_button_top");
        break;
    }
    // so if 0 nothing. aka use existing val

    // console.log(percentX, percentY);
    // console.log(xDir)

    target.style.transform = `rotateX(${-percentY}deg) rotateY(${percentX}deg)`;
  };

  return (
    <div className={styles.dpad} onMouseMove={handleMouseMove}>
      <div className={styles.dpad_top} >
        <div className={styles.dpad_top_transparent} >
          <button className={`${styles.up_button}`}>
            <div className={`${styles.up_button_top}`}>
              <span>⇧</span>
            </div>
          </button>
          <button className={`${styles.left_button}`}>
            <div className={`${styles.left_button_top}`}>
              <span>⇧</span>
            </div>
          </button>
          <div className={styles.dpad_spacer}>
            <div className={styles.dpad_spacer_top}></div>
          </div>
          <button className={`${styles.right_button}`}>
            <div className={`${styles.right_button_top}`}>
              <span>⇧</span>
            </div>
          </button>
          <button className={`${styles.down_button}`}>
            <div className={`${styles.down_button_top}`}>
              <span>⇧</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
