import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/navBar";
import UploadSection from "./components/upload";
import ResultsGrid from "./components/resultsGrid";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysisData(null);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }
    setMessage("Uploading...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setAnalysisData(response.data);
      // Compute a display status.
      let scanStatus = response.data.data.attributes.status;
      if (!scanStatus && response.data.data.attributes.last_analysis_stats) {
        const stats = response.data.data.attributes.last_analysis_stats;
        scanStatus = stats.malicious > 0 ? "malicious" : "clean";
      }
      setMessage("Upload successful! Scan status: " + scanStatus);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Upload failed.");
    }
  };

  const handleRefresh = async () => {
    if (
      analysisData &&
      analysisData.data &&
      analysisData.data.links &&
      analysisData.data.links.self
    ) {
      setMessage("Refreshing scan status...");
      try {
        const response = await axios.get("http://localhost:3001/refresh", {
          params: { analysisUrl: analysisData.data.links.self },
        });
        setAnalysisData(response.data);
        let scanStatus = response.data.data.attributes.status;
        if (!scanStatus && response.data.data.attributes.last_analysis_stats) {
          const stats = response.data.data.attributes.last_analysis_stats;
          scanStatus = stats.malicious > 0 ? "malicious" : "clean";
        }
        setMessage("Refresh successful! Scan status: " + scanStatus);
      } catch (error) {
        console.error("Refresh failed:", error);
        setMessage("Refresh failed.");
      }
    } else {
      setMessage("No analysis URL available to refresh.");
    }
  };

  // Automatic refresh: poll every 15 seconds if scan isn't complete.
  useEffect(() => {
    let intervalId;
    if (analysisData && analysisData.data && analysisData.data.attributes) {
      const attrs = analysisData.data.attributes;
      // If the historical scan already has results, or if it's a new scan that's completed, no need to poll.
      if (!attrs.last_analysis_results && attrs.status !== "completed") {
        intervalId = setInterval(() => {
          handleRefresh();
        }, 15000);
      }
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [analysisData]);

  // Determine display status for showing current scan status.
  let displayStatus = "";
  if (analysisData && analysisData.data && analysisData.data.attributes) {
    displayStatus = analysisData.data.attributes.status;
    if (!displayStatus && analysisData.data.attributes.last_analysis_stats) {
      const stats = analysisData.data.attributes.last_analysis_stats;
      displayStatus = stats.malicious > 0 ? "malicious" : "clean";
    }
  }

  return (
    <div className="App">
      <Navbar />
      <UploadSection
        handleFileChange={handleFileChange}
        handleUpload={handleUpload}
        message={message}
      />
      {analysisData && analysisData.data && analysisData.data.attributes && (
        <div style={{ textAlign: "center", margin: "16px" }}>
          <p>Current Scan Status: {displayStatus}</p>
          {displayStatus !== "completed" && (
            <button onClick={handleRefresh}>Refresh</button>
          )}
        </div>
      )}
      {analysisData && analysisData.data && analysisData.data.attributes ? (
        analysisData.data.attributes.last_analysis_results ? (
          <ResultsGrid
            results={analysisData.data.attributes.last_analysis_results}
          />
        ) : (
          <p>Waiting for scan to complete...</p>
        )
      ) : null}
    </div>
  );
}

export default App;
