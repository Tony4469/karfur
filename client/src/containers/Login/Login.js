import React, { Component } from 'react';
import track from 'react-tracking';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import Icon from 'react-eva-icons'
import {NavLink} from 'react-router-dom'

import API from '../../utils/API';
import setAuthToken from '../../utils/setAuthToken'

import './Login.scss'

class Login extends Component {
  state = {
    username : "",
    password: "",
    traducteur : false,
    passwordVisible:false,
    redirectTo : "/",
  }

  componentDidMount(){
    let locState = this.props.location.state ;
    if(locState){
      this.setState({traducteur: locState.traducteur, redirectTo: locState.redirectTo || "/"});
    }
  }

  togglePasswordVisibility = () => this.setState(prevState=>({passwordVisible: !prevState.passwordVisible}))

  send = () => {
    if(this.state.username.length === 0){
      Swal.fire( 'Oops...', 'Aucun nom d\'utilisateur n\'est renseigné !', 'error');return;
    }
    if(this.state.password.length === 0){
      Swal.fire( 'Oops...', 'Aucun mot de passe n\'est renseigné !', 'error');return;
    }
    let user = {
      'username' : this.state.username,
      'password' : this.state.password,
      'traducteur' : this.state.traducteur,
    }
    API.login(user).then(data => {
      Swal.fire( 'Yay...', 'Authentification réussie !', 'success');
      localStorage.setItem('token', data.data.token);
      setAuthToken(data.data.token);
      console.log(data.data.token)
      console.log(this.state.redirectTo)
      this.props.history.push(this.state.redirectTo)
      // if(this.state.traducteur){
      //   this.props.history.push("/backend/user-dashboard")
      // }else{
      //   this.props.history.push("/homepage")
      // }
    },error => {
      console.log(error);
      return;
    })
  }    

  handleChange = event => this.setState({ [event.target.id]: event.target.value });

  render() {
    return (
      <div className="app flex-row align-items-center login">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="card-left">
                  <CardBody>
                    <Form>
                      <h1>Se connecter</h1>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend" className="icon-prepend">
                          <Icon name="person-outline" fill="#3D3D3D" />
                        </InputGroupAddon>
                        <Input autoFocus id="username" type="username" placeholder="nom d'utilisateur" 
                          value={this.state.username} onChange={this.handleChange} 
                          autoComplete="username" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend" className="icon-prepend">
                          <Icon name="lock-outline" fill="#3D3D3D" />
                        </InputGroupAddon>
                        <Input type={this.state.passwordVisible ? "text" : "password"} id="password" value={this.state.password} onChange={this.handleChange} 
                          placeholder="mot de passe" autoComplete="password" />
                        <InputGroupAddon addonType="append" className="icon-append" onClick={this.togglePasswordVisibility}>
                          <Icon name="eye-outline" fill="#3D3D3D" />
                        </InputGroupAddon>
                      </InputGroup>
                      <div className="footer-buttons">
                        <Button color="transparent" className="px-0 text-dark password-btn">
                          <u>mot de passe oublié ?</u>
                        </Button>
                        <Button onClick={this.send} color="dark" className="px-4 connect-btn">
                          Connexion
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white py-5 d-md-down-none card-right">
                  <CardBody className="text-center">
                    <div>
                      <h2>Créer un compte</h2>
                      <p>Devenez contributeur, sauvegardez vos contenus favoris, rejoignez une communauté mobilisée pour aider les réfugiés...</p>
                      <NavLink to={{ 
                            pathname: "/register", 
                            state: this.props.location.state
                          }} >
                        <Button className="mt-3 btn-sign text-dark" tabIndex={-1}>S'enregistrer</Button>
                      </NavLink>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
            <div className="retour-wrapper">
              <NavLink to="/">
                <Button color="transparent" className="retour-btn text-dark">
                  <Icon name="close-circle-outline" fill="#3D3D3D" />
                  <u>Retour</u>
                </Button>
              </NavLink>
            </div>
          </Row>
        </Container>
      </div>
    );
  }
}

export default track({
  page: 'Login',
}, { dispatchOnMount: true })(Login);