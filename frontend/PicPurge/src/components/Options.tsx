import "./Options.css";

function Options() {
  return (
    <div className="Options">
      <ul className="OptionList">
        <li className="OptionItem">
          Select A Folder To Purge
          <button className="FolderSelect">Files</button>
        </li>
        <li className="OptionItem">
          Set Agressivness
          <select className="Agro">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </li>
        <li className="OptionItem">
          Remove Non-Media
          <input type="checkbox" className="Checkbox" />
        </li>
        <button className="Process">Process</button>
      </ul>
    </div>
  );
}

export default Options;
