import React, { useState, useEffect } from "react";
import "./Options.css";
import DetectionWheel from "./DetectionWheel";
import ProgressBar from "./Progress";
import Fire from "./Fire";

function Options() {
  let oldProgress = 0;
  const [folderPath, setFolderPath] = useState("");
  const [aggressiveness, setAggressiveness] = useState("1");
  const [removeNonMedia, setRemoveNonMedia] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Receive progress updates from the main process
    (window as any).electronAPI.receive(
      "progressUpdate",
      (newProgress: number) => {
        setProgress(newProgress);
      }
    );
  }, []);

  const handleFolderPathChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setFolderPath(event.target.value);
  };

  // TODO: Make this do shit
  const handleAggressivenessChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setAggressiveness(event.target.value);
  };

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
    // TODO: Fix Agro
    await (window as any).electronAPI.process(folderPath, 2, removeNonMedia);
  };

  const handleFileButton = async () => {
    try {
      const selectedPath = await (window as any).electronAPI.openFiles();
      if (selectedPath) {
        setFolderPath(selectedPath);
        console.log("Folder Path:", selectedPath);
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
        </li>
        <ul className="DetectionLevel">
          <ul className="DetectionLevelText">
            <li className="DetectionLevelMainText">Detection Level</li>
            <li className="DetectionLevelSubText">
              Adjust the level of sensitivity for duplicate detection
            </li>
          </ul>
          <ul className="DetectionWheelSection">
            <DetectionWheel />
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
            <div className="ProcessSection">
              <button className="Process" onClick={handleProcessClick}>
                Process
              </button>
              <ProgressBar progress={progress}></ProgressBar>
            </div>
          </ul>
        </ul>
        {/* <Fire></Fire> */}
      </ul>
    </div>
  );
}

export default Options;
