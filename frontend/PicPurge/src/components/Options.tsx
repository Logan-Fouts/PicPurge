import React, { useState, useEffect } from "react";
import "./Options.css";
import Octagon from "./Octagon";
import ProgressBar from "./Progress";

function Options() {
  let oldProgress = 0
  const [folderPath, setFolderPath] = useState("");
  const [aggressiveness, setAggressiveness] = useState("1");
  const [removeNonMedia, setRemoveNonMedia] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  let progressInterval: ReturnType<typeof setInterval> | undefined;

  useEffect(() => {
    if (buttonClicked) {
      progressInterval = setInterval(() => {
        fetchProgress();
      }, 200);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [buttonClicked]);

  const fetchProgress = async () => {
    try {
      const response = await fetch("http://localhost:5002/picAPI/get_progress");
      if (response.ok) {
        const data = await response.json();
        const newProgress = data.progress;

        if (Number(newProgress) !== Number(oldProgress)) {
          setProgress(newProgress);
          oldProgress = newProgress;
        } else {
          clearInterval(progressInterval);
        }
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const handleFolderPathChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setFolderPath(event.target.value);
  };

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
    setButtonClicked(true); // Mark the button as clicked

    const url = `http://localhost:5002/picAPI/run/${encodeURIComponent(
      folderPath
    )}/${aggressiveness}/${removeNonMedia}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log("Process started");
      } else {
        console.error("Process failed");
      }
    } catch (error) {
      console.error("Error starting process:", error);
    }
  };

  return (
    <div className="Options">
      <ul className="OptionList">
        <li className="SelectFolder">
          Select Folder
          <input
            type="text"
            className="FolderSelect"
            value={folderPath}
            onChange={handleFolderPathChange}
          />
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
      </ul>
    </div>
  );
}

export default Options;