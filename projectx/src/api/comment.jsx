import api from './apiConfig'

export const getAllComment = async () => {
    try {
      const response = await api.get('/comment');
      console.log('receiving data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

export const createComment = async (form) => {
    const response = await api.post('/comment', form)
    return response.data
}

export const deleteComment = async (commentId, userId) =>{

  const response = await api.delete(`/comment/${commentId}`)
  return response.data
}

export const updateComment= async (commentId, content ) => {
  console.log(commentId)
  const response = await api.put(`/comment/${commentId}`,content )
  return response.data
}