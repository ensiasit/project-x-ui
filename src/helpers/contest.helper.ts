import { ContestDto } from "../services/contest.service";

interface ContestMenuItem {
  value: number;
  label: string;
}

export const mapContestDtoToMenuItem = ({
  id,
  name,
}: ContestDto): ContestMenuItem => {
  return {
    value: id,
    label: name,
  };
};
