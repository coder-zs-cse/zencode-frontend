import { GENERATE_END_POINT } from "@/constants/api-constants";
import { envConfig } from "@/lib/config/env-config";
import { generateAPIResponse } from "@/types/api-response";
import { generateAPIRequest } from '../../types/api-request';
import { axiosSecure } from "../axios";

export async function generate_endpoint(
  request: generateAPIRequest
): Promise<generateAPIResponse> {
  try {
    const response = await axiosSecure.post(
      `${envConfig.BASE_URL}/${GENERATE_END_POINT}`,
      request
    );
    return response.data;
  } catch (error) {
    console.error("Error generating query data:", error);
    throw error;
  }
}
