import React from 'react';
import { Col, Row, Progress, Table } from 'reactstrap';
import Icon from 'react-eva-icons';
import {NavLink} from 'react-router-dom';

import marioProfile from '../../../../assets/mario-profile.jpg';
import {colorAvancement, colorStatut} from '../../../Functions/ColorFunctions';
import FButton from '../../../FigmaUI/FButton/FButton';

import variables from 'scss/colors.scss';
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

const tradTable = (props) => {
  let data = props.limit ? props.dataArray.slice(0,props.limit) : props.dataArray;
  let hideOnPhone = props.hideOnPhone || new Array(props.headers).fill(false)

  const langueItem = i18nCode => {
    let langue = props.langues.find(x => x.i18nCode === i18nCode);
    if(langue && langue.langueCode && langue.langueFr){
      return (
        <>
          <i className={'flag-icon flag-icon-' + langue.langueCode} title={langue.langueCode} id={langue.langueCode}></i>
          <span>{langue.langueFr}</span>
        </>
      )
    }else{return false}
  }
  let table = (
    <Table responsive className="avancement-user-table">
      <thead>
        <tr>
          {props.headers.map((element,key) => (<th key={key} className={hideOnPhone[key] ? "hideOnPhone" : ""}>{element}</th> ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(0,props.limit).map((element,key) => {
          let titre= (element.initialText || {}).title || '';
          return (
            <tr key={key} >
              <td className="align-middle">
                {props.windowWidth > 768 ? titre : (titre.slice(0,24) + (titre.length > 24 ? "..." : ""))}
              </td>
              <td className="align-middle">
                <div className={"status-pill bg-"+colorStatut(element.status)}>{element.status}</div>
              </td>
              <td className="align-middle hideOnPhone">
                <Row>
                  <Col>
                    <Progress color={colorAvancement(element.avancement)} value={element.avancement*100} className="mb-3" />
                  </Col>
                  <Col className={'text-'+colorAvancement(element.avancement)}>
                    {element.avancement === 1 ? 
                      <EVAIcon name="checkmark-circle-2" fill={variables.vert} /> :
                      <span>{Math.round((element.avancement || 0) * 100)} %</span> }
                  </Col>
                </Row>
              </td>
              <td className="align-middle langue-item">
                {langueItem(element.langueCible)}
              </td>
              <td className="align-middle hideOnPhone">
                {element.participants && element.participants.map((participant) => {
                  return ( 
                      <img
                        key={participant._id} 
                        src={participant.picture ? participant.picture.secure_url : marioProfile} 
                        className="profile-img-pin img-circle"
                        alt="random profiles"
                      />
                  );
                })}
              </td>
              <td className="align-middle">
                <NavLink to={"/traduction/"+element.articleId} className="no-decoration" >
                  <FButton type="light-action" name="eye-outline" fill={variables.noir} />
                </NavLink>
              </td>
            </tr>
          );
        })}
        {props.limit && 
          <tr >
            <td colSpan="6" className="align-middle voir-plus" onClick={()=>props.toggleModal('traducteur')}>
              <Icon name="expand-outline" fill="#3D3D3D" size="large"/>&nbsp;
              Voir plus
            </td>
          </tr>
        }
      </tbody>
    </Table>
  )
  
  let show=true;
  const onAnimationEnd = e => show=false;

  const startTrad = () => {
    if(props.user.selectedLanguages && props.user.selectedLanguages.length>0){
      props.history.push("/backend/user-dashboard")
    }else{
      props.toggleModal('devenirTraducteur')
    }
  }

  if(props.limit && show){
    return(
      <div className={"tableau-wrapper" + (props.hide ? " swing-out-top-bck" : "")} id="mes-traductions" onAnimationEnd={onAnimationEnd}>
        <Row>
          <Col>
            <h1>{props.title}</h1>
          </Col>
          {props.displayIndicators && props.traducteur &&
            <Col className="d-flex tableau-header">
              <Row className="full-width">
                <Col lg="3" md="3" sm="6" xs="12" className="d-flex left-element">
                  <h4>{props.motsRediges}</h4>
                  <span className="texte-small ml-10">mots rédigés</span>
                </Col>
                <Col lg="3" md="3" sm="6" xs="12" className="d-flex middle-element">
                  <h4>{props.minutesPassees}</h4>
                  <span className="texte-small ml-10">minutes passées</span>
                </Col>
                <Col lg="3" md="3" sm="12" xs="12" className="d-flex right-element">
                  <h4>22</h4>
                  <span className="texte-small ml-10">personnes informées</span>
                </Col>
                <Col lg="3" md="3" sm="12" xs="12">
                  <FButton type="dark" name="file-add-outline">
                    Espace traduction
                  </FButton>
                </Col>
              </Row>
            </Col>}
        </Row>
  
        <div className="tableau">
          {table}

          {!props.traducteur &&
            <div className="ecran-protection no-trad">
              {props.toggleSection && 
                <div className="close-box text-white" onClick={()=>{props.toggleSection('traductions');}}>
                  <Icon name="eye-off-2-outline" fill="#FFFFFF" />
                  <u>Masquer</u>
                </div>}
              <div className="content-wrapper">
                <h1>{props.overlayTitle}</h1>
                <span>{props.overlaySpan}</span>
                <FButton type="light" name="play-circle-outline" fill={variables.noir} onClick={startTrad} >
                  {props.overlayBtn}
                </FButton>
              </div>
            </div>}
        </div>
      </div>
    )
  }else if(show){
    return table
  }else{
    return false
  }
}

export default tradTable;