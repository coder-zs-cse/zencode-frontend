import { TEMPLATE_END_POINT } from '@/constants';
import { envConfig } from '@/lib/config/env-config';
import { templateAPIResponse } from '@/types';
import axios from 'axios';

export async function template_endpoint(): Promise<templateAPIResponse> {
  try {
    const response = await axios.get(`${envConfig.BASE_URL}/${TEMPLATE_END_POINT}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching template data:', error);
    throw error;
  }
} 


