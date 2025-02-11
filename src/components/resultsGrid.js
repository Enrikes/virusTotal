import React from "react";
import styles from "./resultsGrid.module.css";

const ResultsGrid = ({ results }) => {
  // results is an object where each key represents an engine's analysis result
  return (
    <div className={styles.container}>
      {Object.keys(results).map((engineKey) => {
        const engineData = results[engineKey];
        return (
          <div key={engineKey} className={styles.gridItem}>
            <h3>{engineData.engine_name}</h3>
            <p>
              <strong>Status:</strong> {engineData.category}
            </p>
            <p>
              <strong>Version:</strong> {engineData.engine_version}
            </p>
            <p>
              <strong>Method:</strong> {engineData.method}
            </p>
            <p>
              <strong>Update:</strong> {engineData.engine_update}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ResultsGrid;
