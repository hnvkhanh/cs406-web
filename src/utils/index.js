/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tf from "@tensorflow/tfjs";

import { IMAGENET_CLASSES } from "./imagenet_classes";

const MOBILENET_MODEL_PATH =
  // tslint:disable-next-line:max-line-length
  "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_130_224/classification/3/default/1";

const IMAGE_SIZE = 224;
const TOPK_PREDICTIONS = 10;

export const mobilenetDemo = async () => {
  console.log("Loading model...");

  const mobilenet = await tf.loadGraphModel(MOBILENET_MODEL_PATH, {
    fromTFHub: true,
  });
  console.log(mobilenet);
  mobilenet.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose();

  console.log("");

  return mobilenet;
};

export async function predict(model, img = null) {
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
