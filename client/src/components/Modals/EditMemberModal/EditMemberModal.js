import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
} from "reactstrap";
import Swal from "sweetalert2";

import FButton from "../../FigmaUI/FButton/FButton";
import { roles } from "./data";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";
import API from "../../../utils/API";

import "./EditMemberModal.scss";
import { colors } from "colors";

class EditMemberModal extends Component {
  state = {
    roles: roles,
    selection: true,
  };

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (nextProps.selected && nextProps.selected.structRole) {
      this.setState({
        roles: roles.map((x) => ({
          ...x,
          checked: nextProps.selected.structRole === x.role,
        })),
        selection: true,
      });
    }
  }

  handleRoleClick = (key) =>
    this.setState((pS) => ({
      roles: pS.roles.map((x, i) => ({ ...x, checked: i === key })),
    }));

  onValidate = () => {
    const selectedRole = (this.state.roles.find((x) => x.checked) || {}).role;
    const userRoles =
      (
        (this.props.structure.membres || []).find(
          (x) => x.userId === this.props.user._id
        ) || {}
      ).roles || [];
    if (
      !selectedRole ||
      !this.props.selected ||
      !this.props.structure ||
      !this.props.structure._id
    ) {
      Swal.fire({
        title: "Oh non!",
        text: "Certaines informations sont manquantes",
        type: "error",
        timer: 1500,
      });
      return;
    }

    if (selectedRole === "delete" && this.state.selection) {
      this.setState({ selection: false });
    } else {
      if (
        this.props.selected.structRole === "administrateur" &&
        (
          this.props.structure.membres.filter((x) =>
            x.roles.includes("administrateur")
          ) || []
        ).length < 2 &&
        selectedRole !== "administrateur"
      ) {
        Swal.fire({
          title: "Oh non!",
          text: "Il doit toujours y avoir un responsable de structure ",
          type: "error",
          timer: 1500,
        });
        return;
      } //Si on change le rôle de l'administrateur il faut s'assurer qu'il en reste toujours un
      if (
        (this.props.selected.structRole === "administrateur" ||
          selectedRole === "administrateur") &&
        !userRoles.includes("administrateur") &&
        !this.props.isAdmin
      ) {
        Swal.fire({
          title: "Oh non!",
          text:
            "Seul un responsable peut donner ou retirer les droits administrateurs",
          type: "error",
          timer: 1500,
        });
        return;
      } //On touche pas aux droits admins sans être admin
      if (
        selectedRole === "contributeur" &&
        !userRoles.includes("administrateur") &&
        !userRoles.includes("contributeur") &&
        !this.props.isAdmin
      ) {
        Swal.fire({
          title: "Oh non!",
          text: "Seul un rédacteur peut donner ou retirer les droits d'édition",
          type: "error",
          timer: 1500,
        });
        return;
      } //On touche pas aux droits admins sans être admin

      let structure = {};
      if (selectedRole === "delete") {
        if (!userRoles.includes("administrateur") && !this.props.isAdmin) {
          Swal.fire({
            title: "Oh non!",
            text: "Seul un responsable peut supprimer un membre",
            type: "error",
            timer: 1500,
          });
          return;
        } //On supprime pas un membre sans être admin

        structure = {
          membreId: this.props.selected._id,
          structureId: this.props.structure._id,
          action: "delete",
        };
      } else if (
        ["membre", "contributeur", "administrateur"].includes(selectedRole)
      ) {
        structure = {
          membreId: this.props.selected._id,
          structureId: this.props.structure._id,
          action: "modify",
          role: selectedRole,
        };
      }

      API.modifyUserRoleInStructure({
        query: structure,
      }).then(() => {
        Swal.fire({
          title: "Yay...",
          text: "La mise à jour a bien été effectuée, merci",
          type: "success",
          timer: 1500,
        });
        this.props.initializeStructure();
        this.props.toggle();
      });
    }
  };

  render() {
    const { show, toggle, selected } = this.props;
    const { selection } = this.state;
    return (
      <Modal isOpen={show} toggle={toggle} className="edit-member-modal">
        <ModalHeader toggle={toggle}>
          {selection ? "Droits d’édition" : "Confirmation"}
        </ModalHeader>
        <ModalBody>
          {selection ? (
            <>
              <div className="sub-header mb-10">
                <span>Modifiez les droits d’édition de :</span>
                <div className="user-card">
                  {selected.picture && selected.picture.secure_url && (
                    <img
                      className="user-img mr-10"
                      src={selected.picture.secure_url}
                      alt={selected.alt}
                    />
                  )}
                  {selected.username}
                </div>
              </div>
              <ListGroup>
                {this.state.roles.map((role, key) => (
                  <ListGroupItem
                    action
                    key={key}
                    className={
                      "mb-10" + (role.role === "delete" ? " delete-item" : "")
                    }
                    onClick={() => this.handleRoleClick(key)}
                  >
                    <Row>
                      <Col lg={role.role === "delete" ? "11" : "4"}>
                        <b>{role.titre}</b>
                      </Col>
                      {role.contenu && <Col lg="7">{role.contenu}</Col>}
                      <Col lg="1">
                        <EVAIcon
                          name={"radio-button-" + (role.checked ? "on" : "off")}
                          fill={colors.noir}
                        />
                      </Col>
                    </Row>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </>
          ) : (
            <div className="confirmation-block">
              Êtes-vous sûr de vouloir enlever {selected.username} de votre
              structure ?
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <FButton type="light" onClick={toggle}>
            Plus tard
          </FButton>
          <FButton
            type="validate"
            name="checkmark-circle-outline"
            onClick={this.onValidate}
          >
            {selection ? "D'accord" : "Oui"}
          </FButton>
        </ModalFooter>
      </Modal>
    );
  }
}

export default EditMemberModal;
