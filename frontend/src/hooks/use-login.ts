import { login } from "@/actions/user/login";
import { LoginRequest } from "@/types/actions/user/login";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (request: LoginRequest) => {
      try {
        const response = await login(request);
        return response;
      } catch (error) {
        throw error;
      }
    },
  });

  return loginMutation;
};
