import styles from "./page.module.css";
import Gameboy from "./Gameboy/gameboy";

// USER THIS FOR THE DPAD
// https://stackoverflow.com/questions/74048836/in-javascript-is-there-a-click-and-drag-event-listener-for-mobiles

export default function Home() {
  return (
    <main className={styles.main}>
      <Gameboy/>
    </main>
  );
}
