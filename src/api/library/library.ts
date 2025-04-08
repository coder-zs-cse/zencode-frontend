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


export const update_component_endpoint = async (component: Component) => {
    try {
        const userId = localStorage.getItem('userId');
        if (userId === "") {
            throw unauthorized;
        }
        const query = {
            userId: userId,
            componentPath: component.componentPath
        };
        const update = {
            '$set': {
                componentName: component.componentName,
                componentPath: component.componentPath,
                indexingStatus: component.indexingStatus,
                description: component.description,
                useCase: component.useCase,
                codeSamples: component.codeSamples,
                dependencies: component.dependencies,
                importPath: component.importPath,
            }
        };
        const request = { query, update }
        const response = await axiosOpen.patch(`${envConfig.DB_URL}/components/update_one`, request);
        console.log("update components endpoint", response);
    } catch (error) {
        console.error("Error fetching components data:", error);
        console.log("components endpoint:", error);
        throw error;
    }
}

export const insert_component_endpoint = async (component: Component) => {
    try {
        const userId = localStorage.getItem('userId');
        if (userId === "") {
            throw unauthorized;
        }
        const componentData = {
            ...component,
            userId: userId
        };
        const response = await axiosOpen.post(`${envConfig.DB_URL}/components`, componentData);
        console.log("insert component endpoint", response);
        return response.data;
    } catch (error) {
        console.error("Error inserting component:", error);
        console.log("insert component endpoint:", error);
        throw error;
    }
}

