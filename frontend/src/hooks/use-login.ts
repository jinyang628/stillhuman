import { login } from "@/actions/user/login";
import { LoginRequest } from "@/types/actions/user/login";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  const loginMutation = useMutation({
    mutationFn: async (request: LoginRequest) => {
      await login(request);
    },
  });

  return {
    loginMutation,
  };
};
