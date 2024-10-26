import { useRef } from "react";
import {
  ValidateRequest,
  ValidateResponse,
  validateResponseSchema,
} from "@/types/actions/user/validate";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useValidateMutation = () => {
  const abortValidationControllerRef = useRef<AbortController | null>(null);

  const validateMutation = useMutation({
    mutationKey: ["validate"],
    mutationFn: async (request: {
      body: ValidateRequest;
      signal: AbortSignal;
    }): Promise<ValidateResponse> => {
      try {
        const response = await axios.get("/api/user", {
          params: request.body,
          signal: request.signal,
        });
        return validateResponseSchema.parse(response.data);
      } catch (error) {
        throw error;
      }
    },
  });

  const mutateValidationWithAbort = async (body: ValidateRequest) => {
    if (abortValidationControllerRef.current) {
      abortValidationControllerRef.current.abort();
    }
    abortValidationControllerRef.current = new AbortController();

    return validateMutation.mutateAsync({
      body,
      signal: abortValidationControllerRef.current.signal,
    });
  };

  return {
    validateMutation,
    mutateValidationWithAbort,
  };
};
