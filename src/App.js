import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

function App() {


  const [selectedFile, setSelectedFile] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState(false);
  const [images, setImages] = useState(false);

  const onChangeHandler = (event) => {
    console.log(event.target.files[0])
    setSelectedFile(event.target.files[0]);
  };

  const onClickHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('file', selectedFile);
    axios.post('http://localhost:8080/api/upload', data, 
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        setLoaded(Math.round((progressEvent.loaded / progressEvent.total) * 100));
      },
    })
      .then((res) => {
        console.log(res);
        setMessage({status:"success",message:"file uploaded successfully"});
      })
      .catch((err) => {
        setMessage({status:"fail",message:"there was an error in the upload: "+JSON.stringify(err)});
        console.log(err);
      });
  };
  
  const fetchImages = (e) => {
    axios.get('http://localhost:8080/api/list')
      .then((res) => {
        console.log(res);
        setImages(res.data);
      })
      .catch((err) => {
        setImages([]);
        console.log(err);
      });
  };

  return (
    <div className="App">
      <form className="main-form">
        <input type="file" name="file" onChange={onChangeHandler}/>
        <p>{selectedFile ? selectedFile.name :"Drag your files here or click in this area."}</p>
        <button type="submit" onClick={onClickHandler}>Upload</button>
      </form>
      <br />
      {(message && <p className={"status "+message.status}>{message.message}</p>)}
      {(!!images &&
      <React.Fragment>
      <div id="img-wrapper">
                  {
                      images.map(image =>(
                        <div><p>{image.key}</p></div>
                      ))
                  }
          </div>
      </React.Fragment>
      )}
      <button onClick={fetchImages}>Fetch Images from S3</button>
    </div>
  );
}

export default App;
