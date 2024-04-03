
import React, { useState, useContext } from 'react';
import {createEvent} from '../api/event'
import { GoogleAuthContext } from './useGoogleAuth';

const EventFormModal = React.forwardRef((props, ref) => {
  const [newForm, setNewForm] = useState({
    name: "",
    address: "",
    imageUrl: "",
    description: "",
    coordinates: null,
    userId: null
  });

  const handleChange = (event) => {
    setNewForm((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Your form submission logic here
    console.log(newForm);
  };

  return (
    <div ref={ref} className="EventModal">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newForm.name}
          name="name"
          placeholder="name"
          onChange={handleChange}
          required={true}
        />
        <input
          type="text"
          value={newForm.address}
          name="address"
          placeholder="address"
          onChange={handleChange}
          required={true}
        />
        <input
          type="text"
          value={newForm.imageUrl}
          name="imageUrl"
          placeholder="image URL"
          onChange={handleChange}
          required={true}
        />
        <input
          type="text"
          value={newForm.description}
          name="description"
          placeholder="description"
          onChange={handleChange}
          required={true}
        />
        <input type="submit" value="Create Event" />
      </form>
    </div>
  );
});

export default EventFormModal;
