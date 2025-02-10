import css from "./cssModules/upload.module.css";

export default function Upload({ setUploadFile }) {
  function handleSelct(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setUploadFile(selectedFile);
    }
  }
  return (
    <div className={css.container}>
      <input type="file" onChange={(e) => handleSelct(e)}></input>
    </div>
  );
}
