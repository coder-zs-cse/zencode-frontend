import { axiosOpen } from "@/api/axios";
import { Component } from "@/components/ui/card-component/card-component";
import { envConfig } from "@/lib/config/env-config";
import { unauthorized } from "next/navigation";

export const find_components_endpoint = async (): Promise<Component[]> => {
    try {
        const userId = localStorage.getItem('userId');
        if (userId === "") {
            throw unauthorized;
        }
        const query = {
            userId: userId
        };
        const queryString = encodeURIComponent(JSON.stringify(query));
        const response = await axiosOpen.get(`${envConfig.DB_URL}/components/find?query=${queryString}`);
        console.log("components endpoint", response);
        
        // Explicitly map the response data to ensure it matches the Component interface
        const components: Component[] = response.data.map((item: any) => ({
            componentName: item.componentName || '',
            indexingStatus: item.indexingStatus || false,
            componentPath: item.componentPath || '',
            description: item.description || '',
            useCase: item.useCase || '',
            codeSamples: Array.isArray(item.codeSamples) ? item.codeSamples : [],
            dependencies: Array.isArray(item.dependencies) ? item.dependencies : [],
            importPath: item.importPath || ''
        }));
        
        return components;
    } catch (error) {
        console.error("Error fetching components data:", error);
        console.log("components endpoint:", error);
        throw error;
    }
} 