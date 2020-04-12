import React, { Component } from 'react';
const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

const MapWithASearchBox = compose(
  withProps({
    // googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyATdLC0CIj9HsOfN52N90RAlDnZri-Nhi4&v=3.exp&libraries=geometry,drawing,places",
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyATQikWKwExuEkB3s8WfbPIfiZxBqjhUfc&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}
      var initialLat, initialLng, initialMarker, initialMarkerPosition;

      if(this.props.dataMap.latitude) {
        initialLat = parseFloat(this.props.dataMap.latitude);
        initialLng = parseFloat(this.props.dataMap.longitude);
        initialMarker = true;
        initialMarkerPosition = { lat: parseFloat(this.props.dataMap.latitude), lng: parseFloat(this.props.dataMap.longitude) };
      }
      else{
        initialLat = 20.6660282;
        initialLng = -103.35507;
        initialMarker = false;
        initialMarkerPosition = { lat:initialLat, lng: initialLng };
      }

      this.setState({
        bounds: null,
        center: {
          lat: initialLat, lng: initialLng
        },
        markers: [],
        markerPosition: initialMarkerPosition,
        isMarkerShown: initialMarker,
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: _.debounce(() => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
          let { onBoundsChange } = this.props
          if (onBoundsChange) {
            onBoundsChange(refs.map)
          }
        },100,{ maxWait: 500 }),
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onMapClick: (e) => {
            console.log(e)
            if( e.placeId === undefined ){
              e.placeId = 
                Math.random().toString(36).substr(2) + 
                Math.random().toString(36).substr(2) + 
                Math.random().toString(36).substr(2);
            }
            this.setState({isMarkerShown: true});
            this.setState({markerPosition: e.latLng});
            this.props.onChange(e.latLng.lat(), e.latLng.lng(), e.placeId);
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new window.google.maps.LatLngBounds();
          this.setState({isMarkerShown: false});

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
            google_places_id: place.place_id,
            draggable: true
          }));          
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
          this.setState({
            center: nextCenter,
            markers: nextMarkers,
            placeId: nextMarkers[0].google_places_id,
          });
          console.log(nextMarkers[0].google_places_id);
          console.log(nextMarkers[0].position.lat());
          console.log(nextMarkers[0].position.lng());
          this.props.onChange(nextMarkers[0].position .lat(),nextMarkers[0].position.lng(), nextMarkers[0].google_places_id);
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
    options={{streetViewControl: false, mapTypeControl: false}}
    onClick={props.onMapClick} >
    <SearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        controlPosition={window.google.maps.ControlPosition.LEFT_TOP}
        onPlacesChanged={props.onPlacesChanged}>
      <input
          type="text"
          placeholder="Buscar un lugar..."
          style={{
            boxSizing: 'border-box',
            border: '1px solid transparent',
            width: '240px',
            height: '35px',
            marginTop: '15px',
            marginLeft: '10px',
            padding: '0 12px',
            borderRadius: '3px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            fontSize: '14px',
            outline: 'none',
            textOverflow: 'ellipses',
          }}
      />
    </SearchBox>
    {!props.isMarkerShown && props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} placeId={marker.google_places_id} />
      )
    }
    {props.isMarkerShown && <Marker position={props.markerPosition} placeId={props.google_places_id} /> }
  </GoogleMap>
);

export default MapWithASearchBox;