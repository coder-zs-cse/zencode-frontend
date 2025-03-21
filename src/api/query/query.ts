import { axiosOpen } from "@/api/axios";
import { QUERY_GENERATE_END_POINT } from "@/constants/api-constants";
import { PromptRequest } from "@/types/api-request";
import { envConfig } from "@/lib/config/env-config";


export const query_endpoint = async (requestBody: PromptRequest) => {
    try {
        const response = await axiosOpen.post(`${envConfig.BASE_URL}/${QUERY_GENERATE_END_POINT}`, requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log("query endpoint", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching query data:", error);
        console.log("query endpoint", error);

        throw error;
    }
};
