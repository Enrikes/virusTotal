import React from "react";
import styles from "./cssModules/upload.module.css";

export default function Upload({ handleFileChange, handleUpload, message }) {
  return (
    <div className={styles.uploadContainer}>
      <input type="file" onChange={handleFileChange} className={styles.input} />
      <button onClick={handleUpload} className={styles.button}>
        Upload File
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
