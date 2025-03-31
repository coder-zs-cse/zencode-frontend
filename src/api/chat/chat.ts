import { axiosSecure } from "@/api/axios";
import { CHAT_END_POINT } from "@/constants/api-constants";
import { envConfig } from "@/lib/config/env-config";


export const chat_endpoint = async () => {
    try {
        const response = await axiosSecure.get(`${envConfig.BASE_URL}/${CHAT_END_POINT}`);
        console.log("chatapi endpoint", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching chat data:", error);
        console.log("chatapi endpoint", error);

        throw error;
    }
}