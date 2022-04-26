import { createContext } from "react";
import { UserContestRole } from "../services/contest.service";

export interface GlobalContext {
  toggleTheme: () => void;
  currentContest: UserContestRole | null;
  setCurrentContest: (contestRole: UserContestRole | null) => void;
}

export const globalContext = createContext<GlobalContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleTheme: () => {},
  currentContest: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentContest: () => {},
});
