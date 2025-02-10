import { useEffect, useState } from "react";
import "./App.css";
import Upload from "./components/upload";
import axios from "axios";

function App() {
  const [uploadFile, setUploadFile] = useState();
  console.log(uploadFile);
  useEffect(() => {
    async function handleSubmit() {
      if (!uploadFile) {
        return "File is not uploaded";
      }

      const formData = new FormData();
      formData.append("file", uploadFile);

      try {
        const response = await axios.post(
          "https://www.virustotal.com/api/v3/files",
          formData,
          {
            headers: {
              "x-apikey":
                "",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const results = await axios.get(await response.data.data.links.self, {
          headers: {
            "x-apikey":
              "",
          },
        });
        console.log(results.data);
      } catch (error) {
        console.log(error, "failed");
      }
    }
    handleSubmit();
  }, [uploadFile]);

  return (
    <div>
      <Upload setUploadFile={setUploadFile} />
      <p>Hello</p>
    </div>
  );
}

export default App;
