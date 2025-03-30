import { axiosOpen } from "@/api/axios";
import { envConfig } from "@/lib/config/env-config";


export const find_user_endpoint = async (query: string) => {
    try {
        const response = await axiosOpen.get(`${envConfig.DB_URL}/findOne?_id=${query}`,

        );
        console.log("user endpoint", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching users data:", error);
        console.log("user endpoint:", error);
        throw error;
    }
}