import * as ScanditSDK from "scandit-sdk";
import {Barcode, BarcodePicker, ScanSettings, configure} from "scandit-sdk";

function Scanner() {


    ScanditSDK.configure("Aawv4RIiMj90EhR+lwn8qaAi8GllP2X6N3vQk5YxE/CoAixjwnBmYgY75AXWTPlC41PUvSlDL7VkdV5CnVHBVic3ExBLfHRAGWIOySduAdnUSY96pyTHWQwXPI+oGGlDVyfXkwk19rQMePJBpzZ+kQ4N2PAmEHsh0U8RmGFbBqvIU1/jkpWWFdmIidThAn4/23E7ydHIGOdobhnkiAfDVyMWjO4GGjsn1E+96tjARiU+BVfQaIA6+klb8Di+jmtx1M2j3ipaVplQylvMkEPSCt+/h2OQ5Eb9oI0CId1EGgMQNqASxbBNwwvLSI99Cwpe77IFPmooVfkBkzrfsn0AwkdwVcZJBCbe3BqGnd9ENwvzxxE3xXX3zIeTZYmPmD6+kAKZvsJuNKzfVsxpqsAOxCglmlnF6L3xS6dGcOHcG3Kh5vZl18Vx+KEb1QJEeVT76QadVQwW4Kq8UNarh7yvioNcWx39kBBUXX+OaCTpuVQgc+7r5MP3slnzeu6K6t/9Iqjn8sxbyfozTsR8z6s08AYMv/7d+b5J3df4uy7DSTz+tUlFnDT6jQc8AoBkfLWSZGLeBKr/pEhTGhO0F/qPsu0XT/RT1fbgIJbIknSUuOXlYWVONJUsX3ZDySjGeDXIxv/8Eyqd1HivBuQLTtaM0d/mQ60+OLX59Vi4yjhnHvaxPuU4lMWbjnjzoY7tjn/vG6jp7rx+2TEz5UkzEZ4c2rqyBMVRbAIgdG8LbQ6voZ09sSbxDihabtdnMre5+NIw8puiQRrFxgQQCEHp8K+q1nlEGMn92ziyvzcOcueTWe6lpDM=", {
        engineLocation: "https://cdn.jsdelivr.net/npm/scandit-sdk@5.x",
    }).then(() => {
        const videoFit = ScanditSDK.BarcodePicker.ObjectFit.CONTAIN;


        // ... ready to instantiate a BarcodePicker or Scanner from here
        ScanditSDK.BarcodePicker.create(document.getElementById("barcode-picker"), {
            videoFit: videoFit,
            guiStyle: ScanditSDK.BarcodePicker.GuiStyle.NONE,
            playSoundOnScan: true,
        }).then(function (barcodePicker) {
            const codeLocationCanvasElement = document.createElement("canvas");

            codeLocationCanvasElement.classList.add("code-location-canvas");

            // Set the code location canvas to fit in its parent element in the same way as the camera video inside the barcode picker
            codeLocationCanvasElement.style.objectFit = codeLocationCanvasElement.dataset.objectFit = videoFit; // Second value used by "objectFitPolyfill" library

            const codeLocationCanvasContext = codeLocationCanvasElement.getContext("2d");

            document.getElementsByClassName("scandit-barcode-picker")[0].appendChild(codeLocationCanvasElement);

            function drawCodeLocation(location) {
                codeLocationCanvasContext.beginPath();
                codeLocationCanvasContext.moveTo(location.topLeft.x, location.topLeft.y);
                codeLocationCanvasContext.lineTo(location.topRight.x, location.topRight.y);
                codeLocationCanvasContext.lineTo(location.bottomRight.x, location.bottomRight.y);
                codeLocationCanvasContext.lineTo(location.bottomLeft.x, location.bottomLeft.y);
                codeLocationCanvasContext.closePath();
                codeLocationCanvasContext.lineWidth = 3;
                codeLocationCanvasContext.strokeStyle = "rgba(46, 192, 204, 0.6)";
                codeLocationCanvasContext.stroke();
                codeLocationCanvasContext.fillStyle = "rgba(46, 192, 204, 0.3)";
                codeLocationCanvasContext.fill();
            }

            const scanSettings = new ScanditSDK.ScanSettings({
                enabledSymbologies: ["ean8", "ean13", "upca", "upce", "code128", "code39", "itf", "qr", "data-matrix"],
                searchArea: {x: 0, y: 0.333, width: 1, height: 0.333},
            });
            barcodePicker.applyScanSettings(scanSettings);
            barcodePicker.on("ready", function () {

            });
            barcodePicker.on("scan", function (scanResult) {


                codeLocationCanvasContext.clearRect(
                    0,
                    0,
                    codeLocationCanvasContext.canvas.width,
                    codeLocationCanvasContext.canvas.height
                );
                // Adjust code location canvas context size based on currently active camera resolution
                codeLocationCanvasContext.canvas.width = scanResult.imageSettings.width;
                codeLocationCanvasContext.canvas.height = scanResult.imageSettings.height;
                // Mirror code location canvas if the camera image is also mirrored
                if (barcodePicker.isMirrorImageEnabled()) {
                    codeLocationCanvasElement.classList.add("mirrored");
                } else {
                    codeLocationCanvasElement.classList.remove("mirrored");
                }
                // Draw new code locations
                scanResult.barcodes.forEach(function (barcode) {
                    drawCodeLocation(barcode.location);
                });
                document.getElementById("barcode-result").innerHTML = scanResult.barcodes.reduce(function (
                    string,
                    barcode
                    ) {
                        return (
                            string +
                            ScanditSDK.Barcode.Symbology.toHumanizedName(barcode.symbology) +
                            ": " +
                            barcode.data +
                            "<br>"
                        );
                    },
                    "");
            });
            barcodePicker.on("scanError", function (error) {
                console.error(error);
            });
        });
    });

    return (
        <div className="App">


            <div className="logo"></div>
            <div className="name">Simple sample</div>
            <div id="description" className="description">Start the scanner and then aim at a barcode to get the encoded
                data.
            </div>
            <div id="lib-loading"><br/>Library is loading, please wait...</div>
            {/*<button id="barcode-picker-starter-button" onClick="startBarcodePicker();" hidden>Start Scanning</button>*/}
            <div id="barcode-result" className="result-text">&nbsp;</div>
            <div id="barcode-picker" className="scanner"/>


        </div>
    );
}

export default Scanner;
