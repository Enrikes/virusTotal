import React from "react";
import styles from "./cssModules/fileInfo.module.css";

const FileInfo = ({ analysisData }) => {
  if (!analysisData || !analysisData.data || !analysisData.data.attributes) {
    return <p>No file information available.</p>;
  }

  const attributes = analysisData.data.attributes;
  const names = attributes.names || [];
  const sha256 = attributes.sha256;
  const md5 = attributes.md5;
  const sha1 = attributes.sha1;
  const magic = attributes.magic;
  const firstSubmissionDate = attributes.first_submission_date;
  const lastAnalysisDate = attributes.last_analysis_date;
  const signatureInfo = attributes.signature_info;

  // Helper: For any object or array, only display the "name" property
  const renderSignatureValue = (value) => {
    if (Array.isArray(value)) {
      // Map over each object in the array and get its "name"
      return value
        .map((item) => (item && item.name ? item.name : ""))
        .filter(Boolean)
        .join(", ");
    } else if (typeof value === "object" && value !== null) {
      // For a single object, return its "name"
      return value.name ? value.name : "";
    } else {
      return value;
    }
  };

  return (
    <div className={styles.container}>
      <h2>File Information</h2>
      {names.length > 0 && (
        <p>
          <strong>Names:</strong> {names.join(", ")}
        </p>
      )}
      {sha256 && (
        <p>
          <strong>SHA256:</strong> {sha256}
        </p>
      )}
      {md5 && (
        <p>
          <strong>MD5:</strong> {md5}
        </p>
      )}
      {sha1 && (
        <p>
          <strong>SHA1:</strong> {sha1}
        </p>
      )}
      {magic && (
        <p>
          <strong>Magic:</strong> {magic}
        </p>
      )}
      {firstSubmissionDate && (
        <p>
          <strong>First Submission Date:</strong>{" "}
          {new Date(firstSubmissionDate * 1000).toLocaleString()}
        </p>
      )}
      {lastAnalysisDate && (
        <p>
          <strong>Last Analysis Date:</strong>{" "}
          {new Date(lastAnalysisDate * 1000).toLocaleString()}
        </p>
      )}
      {signatureInfo && (
        <div>
          <h3>Signature Info</h3>
          {Object.entries(signatureInfo).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {renderSignatureValue(value)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileInfo;
