import React, { useState } from "react";
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
      // Save the initial analysis response.
      setAnalysisData(response.data);
      setMessage(
        "Upload successful! Scan status: " +
          response.data.data.attributes.status
      );
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Upload failed.");
    }
  };

  // This function manually refreshes the scan status.
  const handleRefresh = async () => {
    if (
      analysisData &&
      analysisData.data &&
      analysisData.data.links &&
      analysisData.data.links.self
    ) {
      const analysisUrl = analysisData.data.links.self;
      setMessage("Refreshing scan status...");
      try {
        const response = await axios.get(analysisUrl, {
          headers: { "x-apikey": "<YOUR_API_KEY>" }, // Only needed if required by the API.
        });
        setAnalysisData(response.data);
        setMessage(
          "Refresh successful! Scan status: " +
            response.data.data.attributes.status
        );
      } catch (error) {
        console.error("Refresh failed:", error);
        setMessage("Refresh failed.");
      }
    } else {
      setMessage("No analysis URL available to refresh.");
    }
  };

  return (
    <div className="App">
      <Navbar />
      <UploadSection
        handleFileChange={handleFileChange}
        handleUpload={handleUpload}
        message={message}
      />
      {/* If analysisData exists, show the current scan status and refresh button if needed */}
      {analysisData && analysisData.data && analysisData.data.attributes && (
        <div style={{ textAlign: "center", margin: "16px" }}>
          <p>Current Scan Status: {analysisData.data.attributes.status}</p>
          {analysisData.data.attributes.status !== "completed" && (
            <button onClick={handleRefresh}>Refresh</button>
          )}
        </div>
      )}
      {/* Only render the ResultsGrid once the scan is completed */}
      {analysisData &&
        analysisData.data &&
        analysisData.data.attributes &&
        analysisData.data.attributes.status === "completed" && (
          <ResultsGrid results={analysisData.data.attributes.results} />
        )}
    </div>
  );
}

export default App;
