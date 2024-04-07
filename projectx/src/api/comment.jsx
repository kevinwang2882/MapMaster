import api from './apiConfig'

export const getComment = async () => {
    try {
      const response = await api.get('/comment/');
      console.log('receiving data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  export const createComment = async (eventId, userId, content,userName) => {
    const response = await api.post('/comment/', { eventId, userId, content,userName });
    return response.data;
  };
export const deleteComment = async (commentId, userId) =>{

  const response = await api.delete(`/comment/${commentId}`)
  return response.data
}

export const updateComment= async (eventId, content ) => {
  console.log(eventId)
  const response = await api.put(`/comment/${eventId}`,content )
  return response.data
}