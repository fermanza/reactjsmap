import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';

import MapView from './MapView';

class ReactGoogleMaps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: "",
      longitude: "",
      google_places_id: ""
    }
  }

  updatePlace(lat,lng, google_places_id) {
    this.setState({latitude:''+lat, longitude:''+lng, google_places_id: google_places_id});
  }

  render() {
    return (
      <div>
          <Col>
              <Card>
                  <CardBody>
                      <br />
                      <Label>Coordinates</Label>
                      <Col>
                        <Input value={this.state.latitude} onChange={(e)=>this.handleText(e)} type="text" id="latitude" name="latitude" placeholder='Latitud' />
                        <Input value={this.state.longitude} onChange={(e)=>this.handleText(e)} type="text" id="longitude" name="longitude" placeholder='Longitud' />
                        <Input value={this.state.google_places_id} type="text" id="google_places_id" name="google_places_id" placeholder='Google Place ID' readOnly/>
                      </Col>
                      <br />
                        <Label>Map</Label>
                        <MapView onChange={this.updatePlace.bind(this)} dataMap={this.state} />
                  </CardBody>
              </Card>
           </Col>
      </div>
    );
  }
}

export default ReactGoogleMaps;
