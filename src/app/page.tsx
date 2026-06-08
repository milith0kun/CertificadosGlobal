import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Certificados Global</h1>
        <p className={styles.description}>
          Emisión, validación y gestión de certificados digitales. 
          Una plataforma rápida, segura y moderna.
        </p>
        <a href="#comenzar" className={styles.button}>
          Comenzar ahora
        </a>
      </div>
    </main>
  );
}
