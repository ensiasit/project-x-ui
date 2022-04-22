import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UseQueryOptions } from "react-query/types/react/types";
import { useGetCurrentUser } from "../services/security.service";
import { UserDto } from "../services/user.service";

export const useCurrentUser = (
  secure: boolean,
  options?: UseQueryOptions<UserDto, Error>,
) => {
  const navigate = useNavigate();
  const currentUser = useGetCurrentUser(options);

  useEffect(() => {
    if (currentUser.isError && secure) {
      navigate("/signin");
    }

    if (currentUser.isSuccess && !secure) {
      navigate("/dashboard");
    }
  }, [currentUser.status, secure]);

  return currentUser;
};
