import React from "react";
import styles from "./cssModules/resultsGrid.module.css";

const ResultsGrid = ({ results }) => {
  // Helper function to assign a sort value based on category.
  const getSortValue = (category) => {
    if (category === "malicious") return 1;
    if (category === "undetected" || category === "harmless") return 2;
    // For timeouts, type-unsupported, failure, etc., assign 3.
    return 3;
  };

  // Sort engine keys based on sort values and alphabetically if equal.
  const sortedEngineKeys = Object.keys(results).sort((a, b) => {
    const sortA = getSortValue(results[a].category);
    const sortB = getSortValue(results[b].category);
    if (sortA !== sortB) {
      return sortA - sortB;
    }
    return results[a].engine_name.localeCompare(results[b].engine_name);
  });

  // Helper to determine the icon based on the category.
  const getResultIcon = (category) => {
    if (category === "undetected" || category === "harmless") {
      return <span style={{ color: "green", fontSize: "1.5em" }}>✓</span>;
    } else if (category === "malicious") {
      return <span style={{ color: "red", fontSize: "1.5em" }}>✗</span>;
    } else {
      // For any failed category (timeouts, type-unsupported, failure, etc.)
      return <span style={{ color: "grey", fontSize: "1.5em" }}>👁️</span>;
    }
  };

  return (
    <div className={styles.container}>
      {sortedEngineKeys.map((engineKey) => {
        const engineData = results[engineKey];
        // Determine if this engine falls into the failed category.
        const isFailed = getSortValue(engineData.category) === 3;
        return (
          <div key={engineKey} className={styles.gridItem}>
            <span className={isFailed ? styles.failedText : ""}>
              {engineData.engine_name}
            </span>
            <span>{getResultIcon(engineData.category)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ResultsGrid;
