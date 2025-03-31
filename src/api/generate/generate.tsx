import { GENERATE_END_POINT } from "@/constants/api-constants";
import { envConfig } from "@/lib/config/env-config";
import { generateAPIResponse } from "@/types/api-response";
import axios from "axios";
import { generateAPIRequest } from '../../types/api-request';

export async function generate_endpoint(
  request: generateAPIRequest
): Promise<generateAPIResponse> {
  try {
    const response = await axios.post(
      `${envConfig.BASE_URL}/${GENERATE_END_POINT}`,
      request
    );
    return response.data;
  } catch (error) {
    console.error("Error generating query data:", error);
    throw error;
  }
}
