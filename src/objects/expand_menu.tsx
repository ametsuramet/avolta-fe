import { createContext } from "react";

type ExpandMenuContextType = {
    isExpanded: boolean;
    setExpanded: (val: boolean) => void;
}

export const ExpandMenuContext = createContext<ExpandMenuContextType>({
    isExpanded: true,
    setExpanded: (val) => false
  });