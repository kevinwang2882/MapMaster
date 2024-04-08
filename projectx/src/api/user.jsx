
import api from './apiConfig';

export const createUser = async (googleUser, googleProfile) => {
    try {
        const response = await api.post('/user', googleProfile);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};
export const getUser = async () => {
    try {
      const response = await api.get('/user/');
      console.log('receiving data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return [];
    }
  };