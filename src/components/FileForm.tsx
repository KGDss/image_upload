// // pages/index.js
// "use client";
// import React, { useState } from "react";

// export default function Home() {
//   const [image, setImage] = useState(null);
//   const [prediction, setPrediction] = useState(null);

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     setImage(file);
//   };

//   const handleSubmit = async () => {
//     console.log("stoop");

//     if (!image) return;

//     const formData = new FormData();
//     formData.append("file", image);
//     console.log("im here");

//     try {
//       const response = await fetch("http://127.0.0.1:8000/predict/", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Prediction failed");
//       }

//       const data = await response.json();
//       console.log(data.prediction);

//       setPrediction(data.prediction);
//     } catch (error) {
//       console.error("Error predicting pneumonia:", error);
//     }
//   };

//   return (
//     <div className="flex">
//       <h1>Upload X-ray Image</h1>
//       <input
//         type="file"
//         accept=".jpg, .jpeg, .png"
//         onChange={handleImageChange}
//       />
//       <button onClick={handleSubmit}>Predict</button>
//       {prediction !== null && <p>Prediction: {prediction}</p>}
//       asldfkasdlkfjafsd;
//     </div>
//   );
// }
// pages/index.js

// import { useState } from "react";
// import Head from "next/head";

// export default function Home() {
//   const [imageSrc, setImageSrc] = useState(null);
//   const [imageName, setImageName] = useState(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = () => {
//       setImageSrc(reader.result);
//       setImageName(file.name);
//     };

//     if (file) {
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage = () => {
//     setImageSrc(null);
//     setImageName(null);
//   };

//   return (
//     <div>
//       <Head>
//         <title>Image Upload</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <div className="file-upload bg-white mx-auto p-8 mt-8 rounded-lg shadow-lg">
//         <input
//           className="file-upload-input hidden"
//           type="file"
//           onChange={handleImageChange}
//           accept="image/*"
//         />
//         <button
//           className="file-upload-btn w-full bg-green-500 text-white py-2 rounded-md font-bold"
//           onClick={() => document.querySelector(".file-upload-input").click()}
//         >
//           Add Image
//         </button>

//         <div className="image-upload-wrap mt-4">
//           {imageSrc && (
//             <div className="file-upload-content">
//               <img
//                 className="file-upload-image max-h-48 mx-auto"
//                 src={imageSrc}
//                 alt="Uploaded Image"
//               />
//               <div className="image-title-wrap mt-4">
//                 <button
//                   className="remove-image w-full bg-red-500 text-white py-2 rounded-md font-bold"
//                   onClick={handleRemoveImage}
//                 >
//                   Remove <span className="image-title">{imageName}</span>
//                 </button>
//               </div>
//             </div>
//           )}

//           {!imageSrc && (
//             <div className="drag-text">
//               <h3 className="text-gray-600 font-semibold">
//                 Drag and drop a file or select add Image
//               </h3>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { ChangeEvent, useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState();
  const [image, setImage] = useState(null);
  const [fileEnter, setFileEnter] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [percentage, setPercentage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = async () => {
    console.log("stoop");

    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);
    console.log("im here");

    try {
      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      console.log(data.prediction);

      setPrediction(data.prediction);
      setPercentage(data.percentage);
    } catch (error) {
      console.error("Error predicting pneumonia:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-10 text-5xl">
        Welcome to Pneumonia detection system
      </div>
      <div className="container max-w-5xl">
        {!file ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setFileEnter(true);
            }}
            onDragLeave={(e) => {
              setFileEnter(false);
            }}
            onDragEnd={(e) => {
              e.preventDefault();
              setFileEnter(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setFileEnter(false);
              if (e.dataTransfer.items) {
                [...e.dataTransfer.items].forEach((item, i) => {
                  if (item.kind === "file") {
                    const file = item.getAsFile();
                    if (file) {
                      let blobUrl = URL.createObjectURL(file);
                      setFile(blobUrl);
                    }
                    console.log(`items file[${i}].name = ${file?.name}`);
                  }
                });
              } else {
                [...e.dataTransfer.files].forEach((file, i) => {
                  console.log(`… file[${i}].name = ${file.name}`);
                });
              }
            }}
            className={`${
              fileEnter ? "border-4" : "border-2"
            } mx-auto  bg-white px-4 flex flex-col w-full max-w-xs h-72 border-dashed items-center justify-center`}
          >
            <label
              htmlFor="file"
              className="h-full flex flex-col justify-center text-center"
            >
              Click to upload or drag and drop
            </label>

            <input
              id="file"
              type="file"
              className="hidden"
              onChange={(e) => {
                handleImageChange(e);
                console.log(e.target.files);
                let files = e.target.files;
                if (files && files[0]) {
                  let blobUrl = URL.createObjectURL(files[0]);
                  setFile(blobUrl);
                }
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <object
              className="rounded-md w-full max-w-xs h-72"
              data={file}
              type="image/png" //need to be updated based on type of file
            />
            <button
              onClick={handleSubmit}
              className="px-4 mt-10 uppercase py-2 tracking-widest outline-none bg-green-600 text-white rounded"
            >
              Submit
            </button>
            <button
              onClick={() => {
                setFile("");
                setPrediction(null);
              }}
              className="px-4 mt-5 uppercase py-2 tracking-widest outline-none bg-red-600 text-white rounded"
            >
              Reset
            </button>
          </div>
        )}
      </div>
      <div className="text-xl mt-10">
        {prediction !== null && (
          <p>
            Prediction: {prediction} ({percentage}%)
          </p>
        )}
      </div>
    </div>
  );
}
