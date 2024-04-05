import React, { useState, useContext } from 'react';
import { createEvent } from '../api/event';
import { GoogleAuthContext } from './useGoogleAuth';

const EventFormModal = React.forwardRef((props, ref) => {
  const [newForm, setNewForm] = useState({
    name: "",
    address: "",
    imageUrl: "",
    description: "",
    rate: 0, // Initialize rate to 0
    type: "", // Initialize type to empty string
    coordinates: null,
    userId: null // Set userId based on the logged-in user ID
  });
  const { user, profile } = useContext(GoogleAuthContext);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newForm.rate === 0) {
      // Show an alert or error message to the user
      alert("Please select a rating");
      return; // Exit the function without submitting the form
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
    createEvent(updatedForm);
    setTimeout(() => {
      props.updateNewEvents(true);
    }, 1000);
    setNewForm({
      name: "",
      type: "",
      address: "",
      imageUrl: "",
      description: "",
      rate: 0,
      coordinates: null,
      userId: null
    });
    props.setShow(false);
  };

  if (!props.show) {
    return null; // Return null when show is false
  }

  return (
    <div ref={ref} className="EventModal">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newForm.name}
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          value={newForm.address}
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          value={newForm.imageUrl}
          name="imageUrl"
          placeholder="Image URL"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          value={newForm.description}
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <div>
          <label>Rating:</label>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="rate"
                value={value}
                checked={newForm.rate === value}
                onChange={() => handleRateChange(value)}
                style={{ display: 'none' }}
                required
              />
              <span className="star">&#9733;</span>
            </label>
          ))}
        </div>
        <div>
          <label>Type:</label>
          <select
            name="type"
            value={newForm.type}
            onChange={handleChange}
            required
          >
            <option value="">Select a type</option>
            <option value="hotel">Hotel</option>
            <option value="restaurant">Restaurant</option>
            <option value="school">School</option>
            <option value="airport">Airport</option>
            <option value="park">Park</option>
            <option value="home">Home</option>
            <option value="bubble_tea">Bubble Tea</option>
            <option value="cafe ">Cafe</option>
            <option value="amusement_park">Amusement Park</option>
            <option value="hot_spring">Hot Spring</option>
            <option value="disney">Disney</option>
            <option value="hospital">Hospital</option>
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
