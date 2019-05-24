import React from 'react';
import { Col, Row, Card, CardBody, CardHeader, CardFooter, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ContentEditable from 'react-contenteditable';
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

const modifyProfile = (props) => {
  let { user, langues, editing } = props;
  return (
    <Card className="profile-modify">
      <div className={"shadow-wrapper" + (editing ? " active" : "")}>
        <CardHeader className={editing ? "editing" : ""}>
          {editing ? "Modifier mon profil" : "Votre profil"}
          {!editing && <EVAIcon name="settings-2-outline" className="align-right pointer" onClick={props.toggleEditing} />}
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg="3">
              Pseudonyme
            </Col>
            <Col>
              <ContentEditable
                id="username"
                html={user.username || ''}
                disabled={!editing}
                onChange={props.handleChange} />
            </Col>
          </Row>
          <Row>
            <Col lg="3">
              Langue
            </Col>
            <Col>
              {(user.selectedLanguages || []).map((lang, key) => (
                <ButtonDropdown isOpen={props.isDropdownOpen[key]} toggle={(e) => props.toggleDropdown(e, key)} className="langues-dropdown" key={key}>
                  <DropdownToggle caret={editing}>
                    <i className={'margin-right-8 flag-icon flag-icon-' + lang.langueCode} title={lang.langueCode} id={lang.langueCode}></i>
                    {lang.langueFr}
                  </DropdownToggle>
                  <DropdownMenu>
                    {langues.map((l, i) => {
                      return (
                        <DropdownItem key={i} id={i}>
                          <i className={'flag-icon flag-icon-' + l.langueCode} title={l.langueCode} id={l.langueCode}></i>
                          <span>{l.langueFr}</span>
                        </DropdownItem>
                      )
                    }
                    )}
                  </DropdownMenu>
                </ButtonDropdown>
              ))}
              {editing && <Button className="plus-langue" onClick={props.addLangue}>
                <EVAIcon name="plus-circle-outline" fill="#3D3D3D" />
              </Button>}
            </Col>
          </Row>
          <Row>
            <Col lg="3">
              Email
            </Col>
            <Col>
              <ContentEditable
                id="email"
                html={user.email || ''}
                disabled={!editing}
                onChange={props.handleChange} />
            </Col>
          </Row>
          <Row>
            <Col lg="3">
              A propos
            </Col>
            <Col>
              <ContentEditable
                id="description"
                html={user.description || ''}
                disabled={!editing}
                onChange={props.handleChange} />
            </Col>
          </Row>
        </CardBody>
      </div>
      {editing && <CardFooter>
        <Button color="success" className="validate-btn d-flex align-items-center" onClick={props.validateProfile}>
          <EVAIcon className="margin-right-8 d-inline-flex" name="checkmark-circle-outline" />
          Valider
        </Button>
      </CardFooter>}
    </Card>
  )
}

export default modifyProfile;