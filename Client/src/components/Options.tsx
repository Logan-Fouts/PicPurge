import React, { useState, useEffect } from "react";
import "./Options.css";
import DetectionWheel from "./DetectionWheel";
import ProgressBar from "./Progress";
import Fire from "./Fire";

function Options() {
  const [folderPath, setFolderPath] = useState("");
  const [removeNonMedia, setRemoveNonMedia] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duplicates, setDuplicates] = useState(0);
  const [selectedDetection, setSelectedDetection] = useState<number | null>(
    null
  );

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
          Select Folder
          <button className="FolderSelect" onClick={handleFileButton}>
            Choose
          </button>
          <p className="folderPath">Folder: {folderPath}</p>
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
                {/* <img className="exampleImage" src={} alt="me"></img> */}
              </div>
              <div className="GreyRectangle"></div>
            </div>
          </ul>
        </ul>
        <ul className="DuplicateRemoval">
          <ul className="DuplicateRemovalSub">
            Remove Duplicates
            <li className="DuplicateRemovalCheckBox">
              Remove Non-Media
              <input
                type="checkbox"
                className="Checkbox"
                checked={removeNonMedia}
                onChange={handleRemoveNonMediaChange}
              />
            </li>
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
