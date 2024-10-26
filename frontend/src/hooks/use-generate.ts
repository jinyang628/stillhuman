import { generate } from "@/actions/message/generate";
import {
  GenerateRequest,
  GenerateResponse,
} from "@/types/actions/message/generate";
import { useMutation } from "@tanstack/react-query";

export const useGenerateMutation = () => {
  const generateMutation = useMutation({
    mutationKey: ["generate"],
    mutationFn: async (request: GenerateRequest): Promise<GenerateResponse> => {
      try {
        const response = await generate(request);
        return response;
      } catch (error) {
        throw error;
      }
    },
  });

  return generateMutation;
};
