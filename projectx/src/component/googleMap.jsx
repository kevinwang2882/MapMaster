import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import EventFormModal from './eventFormModal';
import ShowModal from './eventModal';
import { getAllEvents } from '../api/event';
import { FaHotel } from "react-icons/fa";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import '../Style/map.css'
const libraries = ['places'];

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
      lng: event.latLng.lng(),
    };

    setCenter(newMarker);

    // Remove existing marker at the same location
    setMarkers(prevMarkers => {
      const filteredMarkers = prevMarkers.filter(marker => (
        marker.lat !== newMarker.lat || marker.lng !== newMarker.lng
      ));
      return [...filteredMarkers, newMarker];
    });

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

  const getMarkerIcon = (type) => {
    let iconUrl = "";
    switch (type) {
      case 'hotel':
        iconUrl = "https://cdn0.iconfinder.com/data/icons/travel-vacation/289/travel-transport-hotel-vacation-holidays-tourist-tourism-travelling-traveling_147-512.png";
        break;
      case 'restaurant':
        iconUrl = "https://cdn0.iconfinder.com/data/icons/travel-vacation/290/travel-transport-hotel-vacation-holidays-tourist-tourism-travelling-traveling_149-512.png";
        break;
      case 'school':
        iconUrl = "https://cdn-icons-png.flaticon.com/512/8/8178.png";
        break;
      case 'airport':
        iconUrl = "https://cdn-icons-png.flaticon.com/512/9/9771.png";
        break;
      case 'park':
        iconUrl = "https://cdn-icons-png.flaticon.com/512/9/9770.png";
        break;
      case 'home':
        iconUrl = "https://static.thenounproject.com/png/279259-200.png";
        break;
      case 'bubble_tea':
        iconUrl = "https://static.thenounproject.com/png/37156-200.png";
        break;
      case 'cafe':
        iconUrl = "https://static.thenounproject.com/png/331590-200.png";
        break;
      case 'amusement_park':
        iconUrl = "https://cdn-icons-png.freepik.com/512/3175/3175179.png";
        break;
      case 'hot_spring':
        iconUrl = "https://cdn-icons-png.flaticon.com/512/5508/5508087.png";
        break;
      case 'disney':
        iconUrl = "https://pngimg.com/d/disneyland_PNG24.png";
        break;
      case 'hospital':
        iconUrl = "https://i.imgur.com/pngr1W1.png";
        break;
      default:
        iconUrl = "https://cdn0.iconfinder.com/data/icons/travel-vacation/289/travel-transport-hotel-vacation-holidays-tourist-tourism-travelling-traveling_178-512.png";
        break;
    }
    return {
      url: iconUrl,
      scaledSize: new window.google.maps.Size(50, 50) // adjust the size as needed
    };
  };
  const PlacesAutocomplete = ({ setMarkers }) => {
    const {
      ready,
      value,
      setValue,
      suggestions: { status, data },
      clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address) => {
      setValue(address, false);
      clearSuggestions();

      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setMarkers([{ lat, lng }]);
    };

    return (
    
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className="combobox-input"
          placeholder="Search an address"
        />
        <ComboboxPopover>
          <ComboboxList className='list-box'>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    
    );
  };
  return (
    <LoadScript googleMapsApiKey={API_KEY} language="en" libraries={libraries}>
      <div className="places-container">
      <PlacesAutocomplete setMarkers={setMarkers} />
      </div>
      <GoogleMap
        mapContainerClassName="map-container"
        zoom={12}
        center={center}
        onDblClick={handleMapClick}
        options={{ mapId: map_id, disableDoubleClickZoom: true }}
      >
        {user && events.map(event => (
          <Marker
            key={event._id}
            position={{ lat: event.coordinates.lat, lng: event.coordinates.lng }}
            icon={getMarkerIcon(event.type)} // Use the custom marker icon
            onClick={() => handleMarkerClick(event)}
          />
        ))}
        {user && markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker}
            onClick={() => handleMarkerClick(marker)}
            icon={getMarkerIcon(marker.type)} // Use the custom marker icon based on the type
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
};

export default MapContainer;