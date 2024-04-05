import React, { useState, useEffect } from 'react';
import { deleteEvent, updateEvent } from '../api/event';

const Show = React.forwardRef((props, ref) => {
  const details = props.details;
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    imageUrl: "",
    rate: 0,
    description: ""
  });

  const handleChange = (event) => {
    setEditForm((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateEvent(props.details._id, editForm)
    setTimeout(() => {
      props.updateNewEvents(true)
    }, 1500)
    props.set(false)
  };

  const handleDelete = () => {
    deleteEvent(props.details._id, props.user.user._id)
    setTimeout(() => {
      console.log('FIRING')
      props.updateNewEvents(true)
    }, 1000)
    props.set(false)
  };

  const loaded = () => {
    return (
      <>
        <h1>{details.name}</h1>
        <h2>{details.address}</h2>
        <img
          className="form-image"
          src={details.imageUrl}
          alt={details.name}
        />
        <h2>{details.description}</h2>
        <h2>{details.rate}</h2>
      </>
    );
  };

  const loading = () => {
    return <h1>Loading ...</h1>;
  };

  useEffect(() => {
    if (details) {
      setEditForm(details);
    }
  }, [details]);

  if (!props.show) {
    return null;
  }

  return (
    <div className="ShowModal" ref={ref}>
      {details ? loaded() : loading()}
      {props.user.user._id === props.details.userId && (
        <>
          <button id="delete" onClick={handleDelete}>
            DELETE
          </button>
          <form onSubmit={handleSubmit}>
            <h3>EventName:</h3>
            <input
              type="text"
              value={editForm.name}
              name="name"
              placeholder="name"
              onChange={handleChange}
            />
            <h3>Address:</h3>
            <input
              type="text"
              value={editForm.address}
              name="address"
              placeholder="address"
              onChange={handleChange}
            />
            <h3>Description:</h3>
            <input
              type="text"
              value={editForm.description}
              name="description"
              placeholder="description"
              onChange={handleChange}
            />
            <div>
              <label>Rating:</label>
              {[1, 2, 3, 4, 5].map((value) => (
                <input
                  key={value}
                  type="radio"
                  value={value}
                  name="rate"
                  checked={editForm.rate === value}
                  onChange={handleChange}
                />
              ))}
            </div>
            <input type="submit" value="Update Event" />
          </form>
        </>
      )}
    </div>
  );
})

Show.displayName = 'Show'; 
export default Show;
