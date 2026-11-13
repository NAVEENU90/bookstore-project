import { createContext } from "react";

export const searchKeyContext = createContext({
  searchKey: "",
  setSearchKey: () => {},
});
