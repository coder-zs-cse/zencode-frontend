import { axiosOpen } from "@/api/axios";
import { envConfig } from "@/lib/config/env-config";
import { unauthorized } from "next/navigation";


export const find_user_endpoint = async () => {
    try {
        const userId = localStorage.getItem('userId');
        if (userId == ""){
            throw unauthorized;
        }
        const query = {
            userId: userId
        };
        const queryString = encodeURIComponent(JSON.stringify(query));
        const response = await axiosOpen.get(`${envConfig.DB_URL}/github/findOne?query=${queryString}`);
        console.log("user endpoint", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching users data:", error);
        console.log("user endpoint:", error);
        throw error;
    }
}