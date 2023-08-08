import React, { useState } from "react";
import "./Options.css";


function Options() {
  const [folderPath, setFolderPath] = useState("");
  const [aggressiveness, setAggressiveness] = useState("1");
  const [removeNonMedia, setRemoveNonMedia] = useState(false);

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

  const handleProcessClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    ripple.classList.add('ripple');
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
    // Prepare the URL with the query parameters
    const url = `http://localhost:5002/picAPI/run/${encodeURIComponent(
      folderPath
    )}/${aggressiveness}/${removeNonMedia}`;

    // Make the GET request
    fetch(url);
    // TODO: Handle Response and Errors
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
            <li className="DetectionLevelSubText">Adjust the photo similarity threshold on the wheel to determine when photos should be treated as duplicates.</li>
          </ul>
          <ul className="DetectionWheelSection">
            <select
              className="Agro"
              value={aggressiveness}
              onChange={handleAggressivenessChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
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
      </ul>
    </div>
  );
}

export default Options;