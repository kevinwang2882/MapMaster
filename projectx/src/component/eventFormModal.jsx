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
    coordinates: null,
    userId: null // Set userId based on the logged-in user ID
  });
  const { user, profile, login, logOut } = useContext(GoogleAuthContext);
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
    console.log(props.coordinates, props.user.user._id)
    event.preventDefault();
    // TODO refactor and fix the arguments being passed
    const updatedForm = {
      name: newForm.name,
      address: newForm.address,
      imageUrl: newForm.imageUrl,
      description: newForm.description,
      rate: newForm.rate,
      coordinates: props.coordinates,
      userId: props.user.user._id
    };
    createEvent(updatedForm)
    setTimeout(() => {
        props.updateNewEvents(true)
    }, 1000)
    setNewForm({
      name: "",
      address: "",
      imageUrl: "",
      description: "",
      rate:0,
      coordinates: null,
      userId: null
    })
    props.setShow(false)
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
            <input
              key={value}
              type="radio"
              value={value}
              name="rate"
              checked={newForm.rate === value}
              onChange={() => handleRateChange(value)}
              required
            />
          ))}
        </div>
        <input type="submit" value="Create Event" />
      </form>
    </div>
  );
});

EventFormModal.displayName = 'EventFormModal';
export default EventFormModal;
