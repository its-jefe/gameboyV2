import Image from "next/image";
import styles from "./page.module.css";

// import React, {useState, useEffect} from "react";

export default function Home() {

  let width = 0;//window.innerWidth;
  let height = 0;//window.innerHeight;

  const handleResize = () => {
    debugger;
    width = window.innerWidth;
    height = window.innerHeight;
  };

  return (
    <main className={styles.main}>
      <div className={styles.screen}></div>
      <div className={styles.controls}>
        <div className={styles.dpad}>
          <button className={`${styles.gameboy_button} ${styles.directional_button} ${styles.up_button}`}>U</button>
          <button className={`${styles.gameboy_button} ${styles.directional_button} ${styles.right_button}`}>R</button>
          <button className={`${styles.gameboy_button} ${styles.directional_button} ${styles.left_button}`}>L</button>
          <button className={`${styles.gameboy_button} ${styles.directional_button} ${styles.down_button}`}>D</button>
        </div>
        <div className={styles.ab}>
          <button className={`${styles.gameboy_button} ${styles.a_button}`}>A</button>
          <button className={`${styles.gameboy_button} ${styles.b_button}`}>B</button>
        </div>
      </div>
    </main>
  );
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/app/page.tsx</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
