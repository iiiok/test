import React, { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import "./App.css";
import Uploadimg from "./Uploadimg";

function progressUpdate(packet){
  console.log('progressUpdate')
	var log = document.getElementById('log');

	if(log.firstChild && log.firstChild.status === packet.status){
		if('progress' in packet){
			var progress = log.firstChild.querySelector('progress')
			progress.value = packet.progress
		}
	}else{
		var line = document.createElement('div');
		line.status = packet.status;
		var status = document.createElement('div')
		status.className = 'status'
		status.appendChild(document.createTextNode(packet.status))
		line.appendChild(status)

		if('progress' in packet){
			var inerProgress = document.createElement('progress')
			inerProgress.value = packet.progress
			inerProgress.max = 1
			line.appendChild(inerProgress)
		}


		if(packet.status === 'done'){
      log.innerHTML = '';
      console.log('done')
		}

		log.insertBefore(line, log.firstChild)
	}
}
function App() {
  var processing = 0;

  const worker = createWorker({
    logger: (m) => progressUpdate(m),
  });
  const doOCR = async (imgData) => {
    console.log('doOCR');
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imgData);
    setOcr(text);
    progressUpdate({ status: 'done'});
  };
  const [ocr, setOcr] = useState("Waiting...");

  useEffect(() => {
    // doOCR();
  });

  function onImageUploaded(data) {
    // if (processing <2) {
      console.log("Process OCR", processing);
      processing ++;
      doOCR(data);
    // }
  }

  return (
    <div className="App">
      <Uploadimg onImageUploaded={onImageUploaded} />
      <div className="div" data-parallax="-3"></div>
      <div className="blockdiv" ></div>
      <div className="tile-row">
        <div className="tile text">
          <div className="heading">Result:</div>
          <p id="OCR">{ocr}</p>
          <div id="log"></div>

          <div className="background-square"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
