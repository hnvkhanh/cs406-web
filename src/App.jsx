import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
  Box,
  Button,
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
            Image Enhancement App
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container maxWidth="md" sx={{ marginTop: "20px" }}>
        <UploadComponent
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
        />
        <Button variant="contained" onClick={hanldeClick} disabled={!model}>Predict</Button>
        <hr style={{ margin: "20px 0" }} />

        {data && <BasicTable rows={data} />}
      </Container>
    </Box>
  );
};

export default App;
