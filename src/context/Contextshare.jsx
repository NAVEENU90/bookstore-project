import { useState } from "react";
import { searchKeyContext } from "./searchKeyContext";

const Contextshare = ({ children }) => {
  const [searchKey, setSearchKey] = useState("");

  return (
    <searchKeyContext.Provider value={{ searchKey, setSearchKey }}>
      {children}
    </searchKeyContext.Provider>
  );
};

export default Contextshare;
