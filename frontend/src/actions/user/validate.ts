"use server";

import {
  ValidateRequest,
  ValidateResponse,
  validateResponseSchema,
} from "@/types/actions/user/validate";

import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SERVICE_ENDPOINT = "api/user";

export async function validate(
  input: ValidateRequest,
): Promise<ValidateResponse> {
  try {
    const response = await axios.get(`${BACKEND_URL}/${SERVICE_ENDPOINT}`, {
      params: input,
    });
    const validateResponse = validateResponseSchema.parse(response.data);
    return validateResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
