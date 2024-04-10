import api from './apiConfig'

export const getAllEvents = async () => {
    try {
      const response = await api.get('/event/');
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  };

export const createEvent = async (form) => {
    const response = await api.post('/event', form)
    return response.data
}

export const deleteEvent = async (eventId, userId) =>{

  const response = await api.delete(`/event/${eventId}/`)
  return response.data
}

export const updateEvent = async (eventId, name, address, imageUrl, details ) => {
  console.log("Updating event with ID:", eventId);
  console.log("New data:", { name, address, imageUrl, details });

  try {
    const response = await api.put(`/event/${eventId}/`, { name, address, imageUrl, details });
    console.log("Update successful. Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const createLike = async (eventId, userId, action) => {
  try {
    const response = await api.post(`/event/${eventId}/${userId}/like/`, { action });
    return response.data;
  } catch (error) {
    console.error('Error liking event:', error);
    throw error;
  }
};
export const getLikeCount = async (eventId, action) => {
  try {
    const response = await api.get(`/event/${eventId}/like/`);
    return response.data;
  } catch (error) {
    console.error('Error liking event:', error);
    throw error;
  }
};