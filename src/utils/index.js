import * as tf from "@tensorflow/tfjs";

import { IMAGENET_CLASSES } from "./imagenet_classes";

const MOBILENET_MODEL_PATH =
  // tslint:disable-next-line:max-line-length
  'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';

const IMAGE_SIZE = 224;
const TOPK_PREDICTIONS = 10;

export const mobilenetDemo = async () => {
  console.log("Loading model...");

  const mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH);
  console.log(mobilenet);
  mobilenet.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose();

  console.log("");

  return mobilenet;
};

export const predict = async (model, img = null) => {
  if (img){
    return predict(model, img);
  }
  const imgElement = document.getElementById('upload');
  if (imgElement.complete && imgElement.naturalHeight !== 0) {
    console.log('complete')
  } else {
    imgElement.onload = () => {
      console.log('on loading')
      return predict(model, imgElement);
    }
  }
  console.log("Predicting...");

  const logits = tf.tidy(() => {
    // tf.browser.fromPixels() returns a Tensor from an image element.
    const img = tf.cast(tf.browser.fromPixels(imgElement), "float32");

    const offset = tf.scalar(127.5);
    // Normalize the image from [0, 255] to [-1, 1].
    const normalized = img.sub(offset).div(offset);

    // Reshape to a single-element batch so we can pass it to predict.
    const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
    return model.predict(batched);
  });

  const classes = await getTopKClasses(logits, TOPK_PREDICTIONS);

  return { imgElement, classes };
}

export async function getTopKClasses(logits, topK) {
  const values = await logits.data();

  const valuesAndIndices = [];
  for (let i = 0; i < values.length; i++) {
    valuesAndIndices.push({ value: values[i], index: i });
  }
  valuesAndIndices.sort((a, b) => {
    return b.value - a.value;
  });
  const topkValues = new Float32Array(topK);
  const topkIndices = new Int32Array(topK);
  for (let i = 0; i < topK; i++) {
    topkValues[i] = valuesAndIndices[i].value;
    topkIndices[i] = valuesAndIndices[i].index;
  }

  const topClassesAndProbs = [];
  for (let i = 0; i < topkIndices.length; i++) {
    topClassesAndProbs.push({
      className: IMAGENET_CLASSES[topkIndices[i]],
      probability: topkValues[i],
    });
  }
  return topClassesAndProbs;
}
