import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUser } from "../services/security.service";

export const useCurrentUser = (secure: boolean) => {
  const navigate = useNavigate();
  const currentUser = useGetCurrentUser();

  useEffect(() => {
    if (currentUser.isError && secure) {
      navigate("/signin?error=1");
    }

    if (currentUser.isSuccess && !secure) {
      navigate("/dashboard");
    }
  }, [currentUser.status, secure]);

  return currentUser;
};
