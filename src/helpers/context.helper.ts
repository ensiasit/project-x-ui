import { createContext } from "react";

export interface GlobalContext {
  toggleTheme: () => void;
}

export const globalContext = createContext<GlobalContext>({
  toggleTheme: () => {
    /* Never mind this comment */
  },
});
