import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import EventFormModal from './eventFormModal';
import ShowModal from './eventModal';
import { getAllEvents } from '../api/event';

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
  const [map, setMap] = useState(null);
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
  const [hideMarkers, setHideMarkers] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

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
      setEvents(data);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
 
    const fetchEvents = async () => {
      const data = await getAllEvents();
      setEvents(data);
    };
    fetchEvents();
    updateNewEvents(false)
  }, [newEvent, eventModalRef, showModalRef]);

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

  //change to dark model
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const darkStyles = [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#242f3e',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#746855',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#242f3e',
        },
      ],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          color: '#263c3f',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#6b9a76',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#38414e',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#212a37',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9ca5b3',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#746855',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#1f2835',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#f3d19c',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [
        {
          color: '#2f3948',
        },
      ],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#17263c',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#515c6d',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#17263c',
        },
      ],
    },
  ];
  //custom icon
  const getMarkerIcon = (type) => {
    let iconUrl = "";
    switch (type) {
      case 'hotel':
        iconUrl = "https://i.imgur.com/kJz8kLw.png";
        break;
      case 'restaurant':
        iconUrl = "https://i.imgur.com/LIEKYta.png";
        break;
      case 'school':
        iconUrl = "https://i.imgur.com/34xnIxj.png";
        break;
      case 'bar':
        iconUrl = "https://i.imgur.com/CKYi6fq.png";
        break;
      case 'tourist_attractions':
        iconUrl = "https://i.imgur.com/M59y9CI.png";
        break;
      case 'home':
        iconUrl = "https://i.imgur.com/irkiLu4.png";
        break;
      case 'grocery_market':
        iconUrl = "https://i.imgur.com/DjbGFpH.png";
        break;
      case 'awful':
        iconUrl = "https://i.imgur.com/T2FDEG2.png";
        break;
      case 'cafe':
        iconUrl = "https://i.imgur.com/9KpHlYs.png";
        break;
      case 'entertainment':
        iconUrl = "https://i.imgur.com/vmZJxSp.png";
        break;
      case 'social':
        iconUrl = "https://i.imgur.com/XJz3ztQ.png";
        break;
      case 'secret':
        iconUrl = "https://i.imgur.com/TrfWqeT.png";
        break;
      case 'hospital':
        iconUrl = "https://i.imgur.com/HqIjcgW.png";
        break;
      case 'mall':
        iconUrl = "https://i.imgur.com/oQvHjv0.png";
        break;
      default:
        iconUrl = "https://www.svgrepo.com/show/1276/map-pin.svg";
        break;
    }
    return {
      url: iconUrl,
      scaledSize: new window.google.maps.Size(60, 60) 
    };
  };
  const PlacesAutocomplete = ({ setMarkers, map }) => {
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
  
      if (map) {
        map.setCenter({ lat, lng }); // Direct the map to the selected place
      }
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
        <PlacesAutocomplete setMarkers={setMarkers} map={map} />
      </div>
      <div className="dark-mode-button-container">
        <button className="dark-mode-button" onClick={toggleDarkMode}>
          Dark Mode
        </button>
      </div>
      <GoogleMap
        onLoad={(map) => setMap(map)}
        mapContainerClassName="map-container"
        zoom={12}
        center={center}
        onDblClick={handleMapClick}
        options={{ mapId: map_id, disableDoubleClickZoom: true, styles: darkMode ? darkStyles : undefined }}
      >
        {user && markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker}
            onClick={() => handleMarkerClick(marker)}
            icon={getMarkerIcon(marker.type)} // Use the custom marker icon based on the type
          />
        ))}
        {user && events.map(event => (
          <Marker
            key={event._id}
            position={{ lat: event.coordinates.lat, lng: event.coordinates.lng }}
            icon={getMarkerIcon(event.type)} // Use the custom marker icon
            onClick={() => handleMarkerClick(event)}
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
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;