# ProdAI

An opensource on-device (runs locally) AI Assistant powered by Mediapipe and Gemma 2B.   
Conversations are being saved in the browser's localstorage. ✨

## Minimum System Requirements
  * 8 Gig of RAM
  * Any GPU
  * Chromium Based Browser (Chrome, Edge, etc. - Does not work on Firefox)

## Current Status:   
In-progress


## Roadmap:
* [ ] Parse Markdown
* [ ] Perform RAG (Retrieval Augmented Generation)
* [ ] Web Search

&nbsp;
&nbsp;
&nbsp;

## Running the demo
Follow the following instructions to run the sample on your device:

1. Clone this repo.
2. Download [Gemma 2B](https://www.kaggle.com/models/google/gemma/frameworks/tfLite/variations/gemma-2b-it-gpu-int4) (TensorFlow Lite 2b-it-gpu-int4 or 2b-it-gpu-int8) or convert an external LLM (Phi-2, Falcon, or StableLM) following the [guide](https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference/web_js#convert-model) (only gpu backend is currently supported), into the your folder.
3. In your index.js file, update ```modelFileName``` with your model file's name.
4. Run python3 ```-m http.server 8000``` under your folder to host the three files (or python -m SimpleHTTPServer 8000 for older python versions).
5. Open localhost:8000 in Chrome. Then the button on the webpage will be enabled when the task is ready (~10 seconds).

Note: You may use **Live Server** in your **VS Code** if you don't want to use python.

## Feel Free to Contribute! 
