"use client";
import { ChangeEvent, useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState("");
  const [image, setImage] = useState(null);
  const [fileEnter, setFileEnter] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [percentage, setPercentage] = useState(null);

  const handleImageChange = (event: any) => {
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
