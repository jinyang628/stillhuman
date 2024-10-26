"use server";

import {
  GenerateRequest,
  GenerateResponse,
  generateResponseSchema,
} from "@/types/actions/message/generate";

import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SERVICE_ENDPOINT = "api/message";

export async function generate(
  input: GenerateRequest,
): Promise<GenerateResponse> {
  try {
    const response = await axios.get(`${BACKEND_URL}/${SERVICE_ENDPOINT}`, {
      params: {
        ...input,
        api_key: undefined, // This effectively removes api_key from the params
      },
      headers: {
        "X-API-Key": input.api_key,
      },
    });
    const generateResponse = generateResponseSchema.parse(response.data);
    return generateResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
