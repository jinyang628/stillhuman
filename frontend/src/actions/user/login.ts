"use server";

import { LoginRequest } from "@/types/actions/user/login";

import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SERVICE_ENDPOINT = "api/user";

export async function login(input: LoginRequest) {
  try {
    const response = await axios.post(`${BACKEND_URL}/${SERVICE_ENDPOINT}`, input);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
