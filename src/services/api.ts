import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
  headers: { 'Content-Type': 'application/json' },
});

const api = {
  character: async (page = 1, searchParams = {}) => {
    // Build query string with page and search params
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    // Add search params only if they have value
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        params.append(key, value.toString());
      }
    });
    
    const url = `/character?${params.toString()}`;
    const response = await axiosInstance.get(url);

    return response.data;
  },
  
};

export default api;