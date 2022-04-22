import { useContext, useState } from "react";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useQueryClient } from "react-query";
import { Role } from "../../../services/security.service";
import {
  UserContestRole,
  useUpdateUserContestRole,
} from "../../../services/contest.service";
import { globalContext } from "../../../helpers/context.helper";

interface UserRoleSelectProps {
  userId: number;
  currentUserId: number;
  initialRole: Role;
}

const UserRoleSelect = ({
  initialRole,
  userId,
  currentUserId,
}: UserRoleSelectProps) => {
  const { currentContest, setCurrentContest } = useContext(globalContext);
  const queryClient = useQueryClient();

  const [role, setRole] = useState(initialRole);

  const updateUserContestRole = useUpdateUserContestRole({
    onSuccess: () => {
      queryClient.invalidateQueries("getUserContests");
    },
  });

  const mapRoleValueToLabel = (roleValue: string): string => {
    return roleValue.charAt(5) + roleValue.slice(6).toLowerCase();
  };

  const onChange = (e: SelectChangeEvent<Role>) => {
    const selectedRole: Role = Role[e.target.value as keyof typeof Role];

    updateUserContestRole.mutate({
      contestId: (currentContest as UserContestRole).contest.id,
      userId,
      role: selectedRole,
    });

    if (userId === currentUserId) {
      setCurrentContest({
        ...(currentContest as UserContestRole),
        role: selectedRole,
      });
    }

    setRole(selectedRole);
  };

  return (
    <Select
      size="small"
      sx={{ width: "200px" }}
      value={role}
      onChange={onChange}
    >
      {Object.entries(Role).map(([key, value]) => (
        <MenuItem key={key} value={key}>
          {mapRoleValueToLabel(value)}
        </MenuItem>
      ))}
    </Select>
  );
};

export default UserRoleSelect;
