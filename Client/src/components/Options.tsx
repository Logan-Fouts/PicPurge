import React, { useState, useEffect } from "react";
import "./Options.css";
import Octagon from "./Octagon";
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
          <button onClick={handleFileButton}>Select Folder</button>
        </li>
        <ul className="DetectionLevel">
          <ul className="DetectionLevelText">
            <li className="DetectionLevelMainText">Detection Level</li>
            <li className="DetectionLevelSubText">
              Adjust the photo similarity threshold on the wheel to determine
              when photos should be treated as duplicates.
            </li>
          </ul>
          <ul className="DetectionWheelSection">
            <Octagon />
          </ul>
        </ul>
        <ul className="DuplicateRemoval">
          <ul className="DuplicateRemovalSub">
            Remove Duplicates
            <button className="Process" onClick={handleProcessClick}>
              Process
            </button>
            <li className="DuplicateRemovalCheckBox">
              Remove Non-Media
              <input
                type="checkbox"
                className="Checkbox"
                checked={removeNonMedia}
                onChange={handleRemoveNonMediaChange}
              />
            </li>
          </ul>
        </ul>
        <ProgressBar progress={progress}></ProgressBar>
        <Fire></Fire>
      </ul>
    </div>
  );
}

export default Options;
