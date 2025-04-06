import { axiosOpen } from "@/api/axios";
import { envConfig } from "@/lib/config/env-config";
import { unauthorized } from "next/navigation";

// Fetches GitHub repository indexing status for a user
export const fetch_github_details = async () => {
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
        console.log("GitHub repository data:", response);
        if (response.data.success && response.data.data){
            return response.data.data;
        }
        // Return NOT_STARTED status when no repository is found
        return { indexingStatus: "NOT_STARTED" };
    } catch (error) {
        console.error("Error fetching GitHub repository data:", error);
        throw error;
    }
}