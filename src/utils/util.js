import * as tf from "@tensorflow/tfjs";
import fs from "fs";

const IMAGE_SIZE = 224;

export const loadModel = async () => {
  try {
    // const mirNetModel = await tf.loadGraphModel("src/utils/modeljs/model.json");
    const mirNetModel = await tf.loadGraphModel(
      "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/3/default/1",
      { fromTFHub: true }
    );
    return mirNetModel;
  } catch (error) {
    console.log(error);
  }
};

function maxValuesAndIndices(arr) {
  if (arr.length === 0) {
    return { maxValues: [], indices: [] }; // Return empty arrays for an empty input array
  }

  let max = Number.NEGATIVE_INFINITY;
  let maxValues = [];
  let indices = [];

  // Find the maximum value
  arr.forEach((value, index) => {
    if (value > max) {
      max = value;
      maxValues = [value]; // Reset maxValues to contain only the new maximum value
      indices = [index]; // Reset indices to contain the index of the new maximum value
    } else if (value === max) {
      maxValues.push(value); // Store the value if it matches the current maximum
      indices.push(index); // Store the index of the matching maximum value
    }
  });

  return { maxValues, indices };
}

export const predict = async (image, responseImagePath, mirNetModel) => {
  try {
    console.log(mirNetModel);
    console.log("Inside predict");

    // image = new Uint8Array(image);
    // Decode the image into a tensor.
    let imageTensor = tf.browser.fromPixels(image, 3);
    console.log(imageTensor);
    imageTensor = tf.image.resizeBilinear(imageTensor, [
      IMAGE_SIZE,
      IMAGE_SIZE,
    ]);
    imageTensor = tf.cast(imageTensor, "float32");
    imageTensor = tf.div(imageTensor, tf.scalar(255.0));

    let input = imageTensor.expandDims(0);

    // Feed the image tensor into the model for inference.
    const startTime = tf.util.now();
    let outputTensor = mirNetModel.predict(input);

    const endTime = tf.util.now();
    console.log(endTime - startTime);
    console.log("After Predict");

    // outputTensor = tf.reshape(outputTensor, [512, 512, 3]);

    // outputTensor = tf.mul(outputTensor, tf.scalar(255.0));
    // outputTensor = tf.clipByValue(outputTensor, 0, 255);
    const data = outputTensor.dataSync();
    console.log(maxValuesAndIndices(data));
    // outputTensor = await tf.node.encodePng(outputTensor);
    // fs.writeFileSync(responseImagePath, outputTensor);

    return outputTensor;
  } catch (error) {
    console.log(error);
    return false;
  }
};
