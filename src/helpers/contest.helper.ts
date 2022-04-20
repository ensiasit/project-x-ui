import { ContestDto, UserContestRole } from "../services/contest.service";
import { DropdownItem } from "../components/Dropdown/Dropdown";

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

export const mapUserContestRoleToDropdownItem = (
  { contest: { id, name } }: UserContestRole,
  onClick: () => void,
  selected: boolean,
): DropdownItem => {
  return {
    id: String(id),
    label: name,
    onClick,
    selected,
  };
};
