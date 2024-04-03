
import apiConfig from './apiConfig';

export const createUser = async (googleUser, googleProfile) => {
    try {
        const response = await apiConfig.post('/user', googleProfile);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};
