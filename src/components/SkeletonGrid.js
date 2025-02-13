import React from "react";
import styles from "./cssModules/resultsGrid.module.css";

const SkeletonGrid = () => {
  // Let's assume we want to show 8 placeholder items.
  const placeholders = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className={styles.container}>
      {placeholders.map((item) => (
        <div key={item} className={styles.skeletonItem} />
      ))}
    </div>
  );
};

export default SkeletonGrid;
