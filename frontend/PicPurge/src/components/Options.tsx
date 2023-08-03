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

  const handleProcessClick = () => {
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
        <li className="DetectionLevel">
          <li className="DetectionLevelText">
            <li className="DetectionLevelMainText">
              Detection Level
            </li>
            <li className="DetectonLevelSubText">
              blah blah blah description
            </li>
          </li>
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
        </li>
        <li className="DuplicateRemoval">
          <li className="DuplicateRemovalSub">
            Remove Duplicates
            <button className="Process" onClick={handleProcessClick}>
            Process
            </button>
            Remove Non-Media
            <input
              type="checkbox"
              className="Checkbox"
              checked={removeNonMedia}
              onChange={handleRemoveNonMediaChange}
            />
          </li>
          
        </li>
        
      </ul>
    </div>
  );
}

export default Options;
