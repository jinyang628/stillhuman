import { validate } from "@/actions/user/validate";
import { ValidateRequest, ValidateResponse } from "@/types/actions/user/validate";
import { useMutation } from "@tanstack/react-query";

export const useValidateMutation = () => {
  const validateMutation = useMutation({
    mutationKey: ['validate'],
    mutationFn: async (request: ValidateRequest): Promise<ValidateResponse> => {
      try {
        return await validate(request);
      } catch (error) {
        throw error;
      }
    },
  });

  return validateMutation;
};
