import React from 'react';
import { Col, Row, Table, Button } from 'reactstrap';
import Icon from 'react-eva-icons';
import {NavLink} from 'react-router-dom';
import moment from 'moment/min/moment-with-locales';

import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

moment.locale('fr');

const actionTable = (props) => {
  let data = props.limit ? props.dataArray.slice(0,props.limit) : props.dataArray;
  
  const jsUcfirst = string => {return string && string.length > 1 && (string.charAt(0).toUpperCase() + string.slice(1, string.length - 1))}

  let table = (
    <Table responsive striped className="avancement-user-table">
      <thead>
        <tr>
          {props.headers.map((element,key) => {
            return (
              <th key={key}>{element}</th>
            )}
          )}
        </tr>
      </thead>
      <tbody>
        {data.slice(0,props.limit).map((element,key) => {
          return (
            <tr key={key} >
              <td className="align-middle">
                {element.titre} 
              </td>
              <td className="align-middle">
                <Icon name={element.owner ? "shield-outline" : "people-outline" } fill="#3D3D3D" size="large"/>&nbsp;
                {element.owner ? "Propriétaire" : "Contributeur" }
              </td>
              <td className={"align-middle"}>
                <Button className={"action-btn " + element.action}>
                  <EVAIcon name={element.action === "questions" ? "question-mark-circle-outline" : "bulb-outline"} fill="#FFFFFF" />
                  {jsUcfirst(element.action)}
                </Button>
              </td>
              <td className="align-middle">
                {element.depuis ? moment(element.depuis).fromNow() : ""}
              </td>
              <td className="align-middle pointer">
                <Icon name="checkmark-circle-outline" fill="#3D3D3D"/>&nbsp;
                <u>Archiver</u>
              </td>
              <td className="align-middle pointer">
                <NavLink to={"/traduction/"+element.articleId} className="no-decoration" >
                  <Icon name="eye-outline" fill="#3D3D3D"/>&nbsp;
                  <u>Voir</u>
                </NavLink>
              </td>
            </tr>
          );
        })}
        {props.limit && 
          <tr >
            <td colSpan="6" className="align-middle voir-plus" onClick={()=>props.toggleModal('contributeur')}>
              <Icon name="expand-outline" fill="#3D3D3D"/>&nbsp;
              Voir plus
            </td>
          </tr>
        }
      </tbody>
    </Table>
  )
  
  if(props.limit){
    return(
      <div className="tableau-wrapper" id="contributions">
        <Row>
          <Col>
            <h1>{props.title}</h1>
          </Col>
          <Col className="d-flex tableau-header no-margin" lg="1">
            <div className="d-flex left-element">
              <Icon name="edit-outline" fill="#828282"/>&nbsp;
              <span> <u>Paramétrer mes modifications</u> </span>
            </div>
          </Col>
        </Row>
  
        <div className="tableau">
          {table}
        </div>

        <div className="tableau-footer">
          <Button>
            <NavLink to="/backend/user-dashboard" className="no-decoration" >
              <Icon name="options-2-outline" fill="#FFFFFF" />
              <span>Gérer mes articles</span>
            </NavLink>
          </Button>
        </div>
      </div>
    )
  }else{
    return table
  }
}

export default actionTable;