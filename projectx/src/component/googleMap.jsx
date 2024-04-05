import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript,Marker,DirectionsService, DirectionsRenderer  } from '@react-google-maps/api';
import EventFormModal from './eventFormModal';
import ShowModal from './modal';
import { getAllEvents } from '../api/event';

const MapContainer = ({ user, profile }) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const map_id = import.meta.env.MAP_ID;

  const defaultCenter = {
    lat: 40.694700,
    lng: -73.85000
  };
 
  const eventModalRef = useRef(null);
  const showModalRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState(defaultCenter);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [markerDetails, setMarkerDetails] = useState(null);
  const [newEvent, updateNewEvents] = useState(false);
  const [response, setResponse] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setResponse(response);
      } else {
        console.log('Directions request failed:', response.status);
      }
    }
  };
  const handleDirections = () => {
    if (origin !== '' && destination !== '') {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        directionsCallback
      );
    }
  };
  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getAllEvents();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    };
    fetchEvents();
  }, [newEvent]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        eventModalRef.current && !eventModalRef.current.contains(event.target) ||
        showModalRef.current && !showModalRef.current.contains(event.target)
      ) {
        setShowModal(false);
        setShowEventModal(false);
        setMarkers(markers => markers.slice(0, markers.length - 1));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal, showEventModal]);

  const handleMapClick = (event) => {
    if (!user) return;

    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };

    setCenter(newMarker);
    setMarkers(prev => [...prev, newMarker]);
    setShowEventModal(true);
  };

  const handleMarkerClick = (event) => {
    setMarkerDetails(event);
    setShowModal(true);
  };

  const mapContainerStyles = {
    height: "100vh",
    width: "100%"
  };

  return (
    <LoadScript googleMapsApiKey={API_KEY} language="en"> 
      <GoogleMap
        mapContainerStyle={mapContainerStyles}
        zoom={12}
        center={center}
        onDblClick={handleMapClick}
        options={{ mapId: map_id, disableDoubleClickZoom: true }}
      >
        {user && events.map(event => (
          <Marker
            key={event._id}
            position={{ lat: event.coordinates.lat, lng: event.coordinates.lng }}
            onClick={() => handleMarkerClick(event)}
          />
        
        ))}
        {user && markers.map((marker, index) => (
          <Marker 
            key={index} 
            position={marker}
            onClick={() => handleMarkerClick(marker)} 
            />
          
        ))}
        <EventFormModal 
        ref={eventModalRef} 
        user={profile} 
        show={showEventModal} 
        setShow={setShowEventModal} 
        updateNewEvents={updateNewEvents} 
        coordinates={center} 
        onClose={() => setShowEventModal(false)} 
        />
        <ShowModal 
        ref={showModalRef} 
        set={setShowModal} 
        show={showModal} 
        user={profile} 
        details={markerDetails} 
        updateNewEvents={updateNewEvents} 
        onClose={() => setShowModal(false)}
        />
        {response && <DirectionsRenderer directions={response} />}
        <input
          type="text"
          placeholder="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button onClick={handleDirections}>Get Directions</button>
      </GoogleMap>
    </LoadScript>
  );
}

export default MapContainer;
