import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
  Box,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import UploadComponent from "./UploadComponent";
import { mobilenetDemo, predict } from "./utils";
import BasicTable from "./BasicTable";

const App = () => {
  const [model, setModel] = useState(null);
  const [data, setData] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    async function loadModel() {
      const mobilenet = await mobilenetDemo();
      setModel(mobilenet);
    }
    loadModel();
  }, []);

  const hanldeClick = async () => {
    const result = await predict(model);
    console.log("image element", result.imgElement);
    setData(result.classes);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      minWidth={"100vw"}
      justifyContent={"start"}
    >
      <CssBaseline />
      <AppBar position="fixed" style={{ width: "100%" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MobileNet Object Classification - Demo with Tensorflow.js + ReactJS
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container maxWidth="md" sx={{ marginTop: "20px" }}>
        <UploadComponent
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            width: "100%",
            margin: "20px",
          }}
        >
          <Button
            variant="contained"
            onClick={hanldeClick}
            disabled={!model}
            style={{ width: "200px", height: "50px" }}
          >
            Predict
          </Button>
        </div>
        <Divider />

        {!model && (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <p>Loading model...</p>
            <div style={{ textAlign: "center" }}>
              <CircularProgress />
            </div>
          </Typography>
        )}

        {data && <BasicTable rows={data} />}
      </Container>
    </Box>
  );
};

export default App;
