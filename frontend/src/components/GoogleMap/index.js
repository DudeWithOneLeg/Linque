import React, { useState, useEffect, useRef } from 'react'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete from "use-places-autocomplete";
import * as placeActions from '../../store/google';
import { useDispatch, useSelector } from 'react-redux';
import './index.css'

const libraries = ['places']

export default function GoogleMap({coord, stylingId, containerStyle, mapOptions}) {
    // const [address, setAddress] = useState('Address')
    // const [city, setCity] = useState('City')
    // const [state, setState] = useState('State')
    const [position, setPosition] = useState(coord)

    const dispatch = useDispatch()

    // const placeDetails = useSelector(state => state.map.place)

    // const mapRef = useRef(null);

    // const [zoom, setZoom] = useState(19)
    // const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete({

    // })
    // useEffect(() => {
    //     console.log('hello')
    //     geocoder.geocode({ location: position }, (results, status) => {
    //         if (status === "OK") {
    //             if (results[0]) {
    //                 const placeID = results[0].place_id;
    //                 dispatch(placeActions.fetchDetails(placeID))
    //             } else {
    //                 console.error("No results found");
    //             }
    //         } else {
    //             console.error("Geocoder failed due to: " + status);
    //         }

    //     });



    // }, [position])

    // useEffect(() => {
    //     console.log(placeDetails)
    //     if (placeDetails) {
    //         let info = ''
    //         let newAddress = ''
    //         Object.values(placeDetails).map((details) => {
    //             if (details.types.includes('administrative_area_level_1')) {
    //                 const newState = details.long_name
    //                 info += details.long_name + ', '
    //                 setState(newState)
    //                 console.log(state)
    //             }
    //             if (details.types.includes('locality')) {
    //                 const newCity = details.long_name
    //                 info += details.long_name + ', '
    //                 console.log(details.long_name)
    //                 setCity(newCity)
    //             }
    //             if (details.types.includes('route')) {
    //                 newAddress += details.long_name
    //                 info += details.long_name + ', '
    //             }
    //             if (details.types.includes('street_number')) {
    //                 newAddress += details.long_name + ' '
    //                 info += details.long_name + ', '
    //             }
    //         })
    //         if (newAddress) setAddress(newAddress)
    //         console.log(address)

    //     }
    // }, [placeDetails])



    const { isLoaded } = useLoadScript({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyBiC-knCF8B1sha04loDyGfM3sM_yaC93U',
        libraries: libraries,
    })

    const marker = () => {
        return (
            <Marker position={position}></Marker>
        )
    }

    // const geocoder = new window.google.maps.Geocoder();

    // const handleMapClick = (e) => {
    //     setPosition({
    //         lat: e.latLng.lat(),
    //         lng: e.latLng.lng()
    //     })
    //     console.log(position)

    //     if (zoom <= 15) {
    //         setZoom(19)
    //     }
    //     if (zoom <= 12) {
    //         setZoom(15)
    //     }
    //     if (zoom <= 9) {
    //         setZoom(12)
    //     }
    //     if (zoom <= 6) {
    //         setZoom(9)
    //     }
    //     if (zoom <= 3) {
    //         setZoom(6)
    //     }
    //     const currentZoom = mapRef.current.getZoom()
    //     setZoom(currentZoom)

    // }

    // const handleResults = () => {
    //     console.log(status, data)
    //     return data.map(location => {

    //         return (<p onClick={(e) => {
    //             setAddress(e.target.value)
    //             clearSuggestions()
    //             const service = new window.google.maps.places.PlacesService(mapRef.current);
    //             service.getDetails({ placeId: location.place_id }, (result, status) => {
    //                 if (status === window.google.maps.places.PlacesServiceStatus.OK) {
    //                     const location = result.geometry.location;
    //                     const lat = location.lat();
    //                     const lng = location.lng();
    //                     let i = mapRef.current.getZoom()
    //                     let time = 150
    //                     if (i < 4) {

    //                         let id = setInterval(() => {
    //                             if (i >= 4) {

    //                                 setPosition({ lat: lat, lng: lng })
    //                                 let newId = setInterval(() => {
    //                                     if (i >= 17) {
    //                                         clearInterval(newId)
    //                                     }
    //                                     setZoom(i++)
    //                                 }, time)
    //                                 clearInterval(id)
    //                             }
    //                             setZoom(i++)
    //                         }, time)


    //                         return

    //                     }

    //                     if (i > 4) {

    //                         let id = setInterval(() => {
    //                             if (i <= 4) {

    //                                 console.log(i)
    //                                 setPosition({ lat: lat, lng: lng })
    //                                 let newId = setInterval(() => {
    //                                     if (i >= 17) {
    //                                         clearInterval(newId)
    //                                     }
    //                                     setZoom(i++)
    //                                 }, time)
    //                                 clearInterval(id)
    //                             }
    //                             setZoom(i--)
    //                         }, time)


    //                         return
    //                     }

    //                     if (i === 4) {
    //                         setPosition({ lat: lat, lng: lng })
    //                         let newId = setInterval(() => {
    //                             if (i >= 17) {
    //                                 clearInterval(newId)
    //                             }
    //                             setZoom(i++)
    //                         }, time)
    //                         return
    //                     }
    //                 } else {
    //                     console.error('Place details request failed:', status);
    //                 }
    //             });
    //         }}
    //             value={location.description}
    //             tabIndex={1}
    //         >{location.description}</p>)
    //     })
    // }



    return (
        <div id={stylingId}>
            <div>
            <script
                defer
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`}
            ></script>
            {/* <div id='location-info'>
                <div className='event-location-info'>
                    <h2>Address: </h2>
                    <p>{address}</p>
                </div>
                <div className='event-location-info'>
                <h2>City: </h2>
                    <p>{city}</p>
                </div>
                <div className='event-location-info'>
                <h2>State: </h2>
                    <p>{state}</p>
                </div>
            </div> */}
            <div id='map'>
                {
                    isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={position}
                            zoom={zoom}

                            options={mapOptions}
                            //onClick={(e) => handleMapClick(e)}
                            onLoad={(map) => mapRef.current = map

                            }
                        >
                            { /* Child components, such as markers, info windows, etc. */}
                            {
                                marker()
                            }
                        </GoogleMap>

                    ) : <></>
                }
            </div>
            </div>
        </div>
    )
}
