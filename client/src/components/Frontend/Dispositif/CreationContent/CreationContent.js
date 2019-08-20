import React from 'react';
import { Row, Col, Input, InputGroup, FormGroup, Label, Spinner } from 'reactstrap';

import EVAIcon from '../../../UI/EVAIcon/EVAIcon';
import FButton from '../../../FigmaUI/FButton/FButton';

import './CreationContent.scss';
import variables from 'scss/colors.scss';

const CreationContent = props => (
  <div className="creation-content">
    <div className="form-field">
      <b>Nom de votre structure</b>
      <span className="float-right"><sup>*</sup> Champs obligatoires</span>
      <Row>
        <Col lg="9" md="9" sm="12" xs="12">
          <InputGroup>
            <EVAIcon className="input-icon" name="pricetags-outline" fill={variables.noir}/>
            <Input id="nom" placeholder="Nom de la structure&#42;" value={props.nom} onChange={props.handleChange} name="structure" />
          </InputGroup>
        </Col>
        <Col lg="3" md="3" sm="12" xs="12">
          <InputGroup>
            <EVAIcon className="input-icon" name="pricetags-outline" fill={variables.noir}/>
            <Input id="acronyme" placeholder="Acronyme" value={props.acronyme} onChange={props.handleChange} name="structure" />
          </InputGroup>
        </Col>
      </Row>
      <InputGroup>
        <EVAIcon className="input-icon" name="link-outline" fill={variables.noir}/>
        <Input id="link" placeholder="Site internet" value={props.link} onChange={props.handleChange} name="structure" />
      </InputGroup>
    </div>
    <div className="form-field">
      <b>Contact unique</b>
      <span className="float-right">Entrez vos coordonnées ou celles d’un responsable légal</span>
      <InputGroup>
        <EVAIcon className="input-icon" name="person-outline" fill={variables.noir}/>
        <Input id="contact" placeholder="Nom et prénom du contact&#42;" value={props.contact} onChange={props.handleChange} name="structure" />
      </InputGroup>
      <Row>
        <Col lg="8" md="8" sm="12" xs="12">
          <InputGroup>
            <EVAIcon className="input-icon" name="at-outline" fill={variables.noir}/>
            <Input id="mail_contact" placeholder="Email&#42;" value={props.mail_contact} onChange={props.handleChange} name="structure" />
          </InputGroup>
        </Col>
        <Col lg="4" md="4" sm="12" xs="12">
          <InputGroup>
            <EVAIcon className="input-icon" name="phone-outline" fill={variables.noir}/>
            <Input id="phone_contact" placeholder="Téléphone" value={props.phone_contact} onChange={props.handleChange} name="structure" />
          </InputGroup>
        </Col>
      </Row>
    </div>
    <div className="form-field belongs-wrapper">
      <b>{props.adminView ? "Le créateur fait-il partie de la structure ?" : "Faites-vous partie de cette structure ?"}</b>
      <div className="belongs-bloc">
        <FormGroup check className="mr-10">
          <Label check>
            <Input type="checkbox" checked={props.authorBelongs} onChange={props.handleBelongsChange} />{' '}
            <b>Oui</b>
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input type="checkbox" checked={!props.authorBelongs} onChange={props.handleBelongsChange} />{' '}
            <b>Non</b>
          </Label>
        </FormGroup>
      </div>
    </div>

    {props.adminView && 
      <>
        {props._id && 
          <div className="creator-wrapper">
            {props.createur && props.createur.picture && props.createur.picture.secure_url &&
              <img className="img-circle mr-10" src={props.createur.picture.secure_url} alt="profile"/>}
            <div className="creator-info">
              <p><b>Nom d'utilisateur : </b> {(props.createur || {}).username}</p>
              <p><b>Email : </b> {(props.createur || {}).email}</p>
              <p><b>Description : </b> {(props.createur || {}).description}</p>
            </div>
          </div>}
        <FormGroup row>
          <Col md="3" className="status-label">
            <Label htmlFor="select"><b>Administrateur de la structure</b></Label>
          </Col>
          <Col xs="12" md="9">
            <Input 
              type="select" 
              id="administrateur" 
              name="structure" 
              value={props.administrateur}
              onChange = {props.handleChange}  >
              <option value={undefined} key={0}>A définir</option>
              {props.users.map((user) =>
                <option value={user._id} key={user._id}>
                  {user.username}
                </option>
              )}
            </Input>
          </Col>
        </FormGroup>
        <div className="form-field">
          <b>Informations administratives</b>
          <span className="float-right">Renseignées par un administrateur uniquement</span>
          <Row>
            <Col lg="6" md="6" sm="12" xs="12">
              <InputGroup>
                <EVAIcon className="input-icon" name="award-outline" fill={variables.noir}/>
                <Input id="siren" placeholder="SIREN" value={props.siren} onChange={props.handleChange} name="structure" />
              </InputGroup>
            </Col>
            <Col lg="6" md="6" sm="12" xs="12">
              <InputGroup>
                <EVAIcon className="input-icon" name="award-outline" fill={variables.noir}/>
                <Input id="siret" placeholder="SIRET" value={props.siret} onChange={props.handleChange} name="structure" />
              </InputGroup>
            </Col>
          </Row>
          <InputGroup>
            <EVAIcon className="input-icon" name="pin-outline" fill={variables.noir}/>
            <Input id="adresse" placeholder="Adresse physique" value={props.adresse} onChange={props.handleChange} name="structure" />
          </InputGroup>
          <InputGroup>
            <EVAIcon className="input-icon" name="at-outline" fill={variables.noir}/>
            <Input id="mail_generique" placeholder="Mail générique de contact" value={props.mail_generique} onChange={props.handleChange} name="structure" />
          </InputGroup>
        </div>
        
        <div className="form-field inline-div">
          <b>Logo de la structure</b>
          {(props.picture || {}).secure_url ?
            <div className="image-wrapper">
              <Input 
                className="file-input"
                type="file"
                id="picture" 
                name="structure" 
                accept="image/*"
                onChange = {props.handleFileInputChange} />
              <img className="sponsor-img" src={(props.picture || {}).secure_url} alt={props.acronyme}/>
              {props.uploading && 
                <Spinner color="success" className="ml-10" />}
            </div>
            :
            <FButton className="upload-btn" type="theme" name="upload-outline">
              <Input 
                className="file-input"
                type="file"
                id="picture" 
                name="structure" 
                accept="image/*"
                onChange = {props.handleFileInputChange} />
              <span>Choisir</span>
              {props.uploading && 
                <Spinner color="success" className="ml-10" />}
            </FButton>}
        </div>
        <div className="form-field">
          <b>Texte alternatif à l’image</b>
          <InputGroup>
            <EVAIcon className="input-icon" name="eye-off-outline" fill={variables.noir}/>
            <Input id="alt" placeholder="Agi’r" value={props.alt} onChange={props.handleChange} />
          </InputGroup>
        </div>
      </>}
  </div>
)

export default CreationContent;