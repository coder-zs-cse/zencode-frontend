import { axiosSecure } from "@/api/axios";
import { envConfig } from "@/lib/config/env-config";
import { trainingAPIRequest } from "@/types/api-request";
import { trainingAPIResponse } from "@/types/api-response";

export const training_endpoint = async (
  request: trainingAPIRequest
): Promise<trainingAPIResponse> => {
  try {
    const response = await axiosSecure.post(
      `${envConfig.DB_URL}/train/github`,
      request
    );
    console.log("train endpoint", response);
    return response.data;
  } catch (error) {
    console.error("Error training data:", error);
    console.log("train endpoint:", error);
    throw error;
  }
};
