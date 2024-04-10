import React, { useState, useContext } from 'react';
import { createEvent } from '../api/event';
import { GoogleAuthContext } from './useGoogleAuth';
import "../Style/event.css"

const EventFormModal = React.forwardRef((props, ref) => {
  const [newForm, setNewForm] = useState({
    name: "",
    address: "",
    imageUrl: "",
    description: "",
    rate: 1, 
    type: "hotel", 
    coordinates: null,
    userId: null 
  });
  const { user, profile,login, logOut } = useContext(GoogleAuthContext);

  const handleChange = (event) => {
    setNewForm((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleRateChange = (value) => {
    setNewForm((prevState) => ({
      ...prevState,
      rate: value,
    }));
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  if (newForm.rate === 0) {
    // Require rating
    alert("Please select a rating");
    return;
  }

  const updatedForm = {
    name: newForm.name,
    type: newForm.type,
    address: newForm.address,
    imageUrl: newForm.imageUrl,
    description: newForm.description,
    rate: newForm.rate,
    coordinates: props.coordinates,
    userId: props.user.user._id
  };

  try {
    const response = await updateEvent(props.details._id, updatedForm);
    console.log("Event updated successfully:", response);
    props.updateNewEvents(true);
  } catch (error) {
    console.error("Error updating event:", error);
    // Handle the error, e.g., display an error message to the user
  }

  setNewForm({
    name: "",
    type: "hotel",
    address: "",
    imageUrl: "",
    description: "",
    rate: 1,
    coordinates: null,
    userId: null
  });

  props.setShow(false);
};

  if (!props.show) {
    return null; // Return null when show is false
  }

  return (
    <div ref={ref} className="EventForm">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newForm.name}
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required={true}
        />
        <input
          type="text"
          value={newForm.address}
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required={true}
        />
        <input
          type="text"
          value={newForm.imageUrl}
          name="imageUrl"
          placeholder="Image URL"
          onChange={handleChange}
          required={true}
        />
        <input
          type="text"
          value={newForm.description}
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required={true}
        />
        <div className='rating'>
         <label>Rating:</label>
         <select 
          name="rate"
          value={newForm.rate}
          onChange={handleChange}
          required={true}
         >
          <option value="">Select a rating</option>
          {[1, 2, 3, 4, 5].map((value) => (
         <option key={value} value={value}>
         {value}
          </option>
         ))}
        </select>
        </div>    
        <div className='type'>
          <label>Type:</label>
          <select
            name="type"
            value={newForm.type}
            onChange={handleChange}
            required={true}
          >
            <option value="">Select a type</option>
            <option value="hotel">Hotel</option>
            <option value="restaurant">Food/Dessert</option>
            <option value="school">School</option>
            <option value="bar">Bar/KTV</option>
            <option value="mall">Mall</option>
            <option value="tourist_attractions">tourist-attractions</option>
            <option value="home">Home</option>
            <option value="grocery_market">Grocery/Market</option>
            <option value="cafe">Cafe/Tea</option>
            <option value="entertainment">Entertainment</option>
            <option value="secret">Secret</option> 
            <option value="hospital">Hospital</option>
            <option value="awful">awful</option>
            <option value="other">Other</option>
          </select>
        </div>
        <input type="submit" value="Create Event" />
      </form>
    </div>
  );
});



EventFormModal.displayName = 'EventFormModal';
export default EventFormModal;
