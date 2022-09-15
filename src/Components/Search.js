import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";

export default function Search({ globalFilter, setGlobalFilter }) {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 300);
  return (
    <div>
      <h2>Locations</h2>
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Search"
        className="searchInput"
      ></input>
    </div>
  );
}
