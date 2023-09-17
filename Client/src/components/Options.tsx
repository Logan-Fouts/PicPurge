import React, { useState, useEffect } from "react";
import "./Options.css";
import DetectionWheel from "./DetectionWheel";
import ProgressBar from "./Progress";
import Fire from "./Fire";
import Darkmode from "./Darkmode";

function Options() {
  const [folderPath, setFolderPath] = useState("");
  const [removeNonMedia, setRemoveNonMedia] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duplicates, setDuplicates] = useState(0);
  const [selectedDetection, setSelectedDetection] = useState<number | null>(
    null
  );

  const imageMappings = {
    1: "/src/components/images/Examples/1/image1.png",
    2: "/src/components/images/Examples/1/image2.png",
    3: "/src/components/images/Examples/2/image1.png",
    4: "/src/components/images/Examples/2/image2.png",
    5: "/src/components/images/Examples/3/image1.png",
    6: "/src/components/images/Examples/3/image2.png",
    7: "/src/components/images/Examples/4/image1.png",
    8: "/src/components/images/Examples/4/image2.png",
    9: "/src/components/images/Examples/5/image1.png",
    10: "/src/components/images/Examples/5/image2.png",
    11: "/src/components/images/Examples/6/image1.png",
    12: "/src/components/images/Examples/6/image2.png",
    13: "/src/components/images/Examples/7/image1.png",
    14: "/src/components/images/Examples/7/image2.png",
    15: "/src/components/images/Examples/8/image1.png",
    16: "/src/components/images/Examples/8/image2.png",
  };

  const handleDetectionSelect = (selected: number | null) => {
    setSelectedDetection(selected);
  };

  useEffect(() => {
    // Receive progress updates from the main process
    (window as any).electronAPI.receive(
      "progressUpdate",
      (newProgress: number) => {
        setProgress(newProgress);
      }
    );

    let updateDuplicate = true;

    (window as any).electronAPI.receive("duplicateFound", () => {
      if (updateDuplicate) {
        setDuplicates((prevDuplicates) => prevDuplicates + 1);
      }
      updateDuplicate = !updateDuplicate;
    });
  }, []);

  const handleRemoveNonMediaChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setRemoveNonMedia(event.target.checked);
  };

  const handleProcessClick = async () => {
    if (folderPath == "") {
      console.log("No Folder Path Entered");
      return;
    }

    await (window as any).electronAPI.process(
      folderPath,
      selectedDetection,
      removeNonMedia
    );
  };

  const handleSortClick = async () => {
    await (window as any).electronAPI.mediaSort(folderPath);
  };

  const handleFileButton = async () => {
    try {
      const selectedPath = await (window as any).electronAPI.openFiles();
      if (selectedPath) {
        setFolderPath(selectedPath);
      } else {
        console.log("No folder selected.");
      }
    } catch (error) {
      console.error("Error opening file explorer:", error);
    }
  };

  return (
    <div className="Options">
      <ul className="OptionList">
        <li className="SelectFolder">
          <div className="leftside">
            Select Folder
            <button className="FolderSelect" onClick={handleFileButton}>
              Choose
            </button>
            <p className="folderPath">Folder: {folderPath}</p>
          </div>
          <div className="rightside">
            <Darkmode></Darkmode>
          </div>
        </li>
        <ul className="DetectionLevel">
          <ul className="DetectionLevelText">
            <li className="DetectionLevelMainText">Detection Level</li>
            <li className="DetectionLevelSubText">
              Adjust the level of sensitivity for duplicate detection
            </li>
          </ul>
          <ul className="DetectionWheelSection">
            <DetectionWheel onDetectionSelect={handleDetectionSelect} />
            <div className="RectangleContainer">
              <h5 className="ExampleText">
                Possible Duplicates <br></br> At This Level
              </h5>
              <div className="GreyRectangle">
                {selectedDetection !== null && (
                  <img
                    className="ExampleImage"
                    src={imageMappings[selectedDetection * 2 -1]}
                    alt=""
                  />
                )}
              </div>
              <div className="GreyRectangle">
                {selectedDetection !== null && (
                  <img
                    className="ExampleImage"
                    src={imageMappings[selectedDetection * 2]}
                    alt=""
                  />
                )}
              </div>
            </div>
          </ul>
        </ul>
        <ul className="DuplicateRemoval">
          <ul className="DuplicateRemovalSub">
            Remove Duplicates
            <button className="Sort" onClick={handleSortClick}>
              Sort
            </button>
            <div className="ProcessSection">
              <button className="Process" onClick={handleProcessClick}>
                Process
              </button>
              <ProgressBar progress={progress}></ProgressBar>
              <h4>Duplicates Found: {duplicates}</h4>
            </div>
          </ul>
        </ul>
        {/* <Fire></Fire> */}
      </ul>
    </div>
  );
}

export default Options;
