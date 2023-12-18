import React from "react";
import { useDropzone } from "react-dropzone";
import { Button, Typography, Box } from "@mui/material";
import ImageComponent from "./Image";

const UploadComponent = ({ uploadedImage, setUploadedImage }) => {
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploadedImage(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
      <Box
        {...getRootProps()}
        style={{
          border: "2px dashed #cccccc",
          borderRadius: "4px",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="body1" gutterBottom>
          Drag & drop an image here, or click to select one
        </Typography>
        <Button variant="contained" color="primary">
          Select Image
        </Button>
      </Box>
      <Typography variant="subtitle1" gutterBottom>
        Uploaded Image:
      </Typography>
      {uploadedImage ? (
        <Box textAlign="center">
          <img
            src={URL.createObjectURL(uploadedImage)}
            alt="Uploaded"
            style={imageStyles}
          />
          <img
            id="upload"
            src={URL.createObjectURL(uploadedImage)}
            alt="Uploaded"
            style={{ display: "none" }}
            width={224}
            height={224}
          />
        </Box>
      ) : (
        <ImageComponent />
      )}
    </Box>
  );
};

const imageStyles = {
  maxWidth: "100%",
  maxHeight: "300px",
  marginTop: "10px",
};

export default UploadComponent;
