import React from "react";
import { Col, Card, CardBody, CardFooter, Spinner } from "reactstrap";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";
import FSwitch from "../../../FigmaUI/FSwitch/FSwitch";
import FButton from "../../../FigmaUI/FButton/FButton";
import { Props } from "./TopRightHeader.container";

export interface PropsBeforeInjection {
  disableEdit: boolean;
  withHelp: boolean;
  showSpinnerBookmark: boolean;
  bookmarkDispositif: () => void;
  pinned: boolean;
  toggleHelp: () => void;
  toggleModal: (arg1: boolean, arg2: string) => void;
  toggleDispositifValidateModal: () => void;
  editDispositif: () => void;
  valider_dispositif: (arg1: string) => void;
  toggleDispositifCreateModal: () => void;
  translating: boolean;
  status: string;
}

export class TopRightHeader extends React.Component<Props> {
  /**
   * props explanations :
   * disableEdit = true --> lecture, disableEdit = false --> edit or creation
   * withHelp =true --> activate help, false --> desactivate
   * showSpinnerBookmark : boolean : deal with spinner when add a favorite
   * bookmarkDispositif : called when adding a new favorite
   * pinned : boolean, bookmark empty or not
   * toggleHelp : add or remove help
   * toggleModal : toggle modal to accept or not content (for a sponsor and status 'En attente')
   * toggleDispositifValidateModal : toggle modal to attach dispositif to structure
   * editDispositif  : when click on pen button to modify dispositif
   * valider_dispositif : used to validate dispositif in Brouillon state
   * toggleDispositifCreateModal : toggle modal to explain how to write when clicking on 'Besoin d'aide'
   * translating
   * status: status of the content
   */

  render() {
    const props = this.props;

    const isAuthor =
      this.props.user &&
      this.props.selectedDispositif &&
      this.props.selectedDispositif.creatorId
        ? this.props.user._id ===
          (this.props.selectedDispositif.creatorId || {})._id
        : false;

    const userIsSponsor =
      this.props.user && this.props.selectedDispositif
        ? (
            (
              ((this.props.selectedDispositif.mainSponsor || {}).membres || [])
                // @ts-ignore
                .find((x) => x.userId === this.props.user._id) || {}
            ).roles || []
          ).some((y) => y === "administrateur" || y === "contributeur")
        : false;

    // user can validate a dispositif if he is admin or contributor of the mainsponsor of the dispositif
    if (props.status === "En attente" && userIsSponsor) {
      // top right part of dispositif when user is sponsor and dispo is 'En attente'
      return (
        <Col xl="6" lg="6" md="6" sm="6" xs="12" className="top-right">
          <Card>
            <CardBody className="backgroundColor-lightColor">
              <span className="validate-header">
                Souhaitez-vous récupérer ce contenu ?
              </span>
              <FButton
                type="validate"
                className="mt-10 full-width"
                onClick={() => props.toggleModal(true, "responsable")}
              >
                Oui
              </FButton>
              <FButton
                type="error"
                className="mt-10 full-width"
                onClick={() => props.toggleModal(true, "rejection")}
              >
                Non
              </FButton>
            </CardBody>
            <CardFooter
              className="color-darkColor cursor-pointer"
              onClick={props.toggleDispositifCreateModal}
            >
              <EVAIcon
                className="mr-8"
                name="question-mark-circle"
                viewBox="0 0 20 20"
                size="medium"
              />
              Besoin d'aide ?
            </CardFooter>
          </Card>
        </Col>
      );
    } else if (props.disableEdit) {
      // when props.disableEdit = true, favorite button and modify button (if user authorized)
      // user can modify a dispositif if he is admin or contributor of the mainsponsor of the dispositif OR if he is admin OR if he is author
      return (
        <Col xl="6" lg="6" md="6" sm="6" xs="12" className="top-right">
          {!props.translating && (isAuthor || props.admin || userIsSponsor) && (
            <div
              className="top-icon-wrapper mr-10"
              onClick={props.editDispositif}
            >
              <EVAIcon name="edit-outline" fill="#3D3D3D" id="editBtn" />
            </div>
          )}
          <div className="top-icon-wrapper" onClick={props.bookmarkDispositif}>
            {props.showSpinnerBookmark ? (
              <Spinner color="success" />
            ) : (
              <EVAIcon
                name={"bookmark" + (props.pinned ? "" : "-outline")}
                fill={"#3D3D3D"}
                id="bookmarkBtn"
              />
            )}
          </div>
        </Col>
      );
    }
    // when creating or modifying a dispositif or demarche
    return (
      <Col xl="6" lg="6" md="6" sm="6" xs="12" className="top-right">
        <Card>
          <CardBody className="telecommande">
            <FSwitch
              content="Consignes"
              checked={props.withHelp}
              onClick={props.toggleHelp}
            />
            <FButton
              className="savebtn"
              type="light-action"
              name="save-outline"
              onClick={() => props.valider_dispositif("Brouillon")}
            >
              Brouillon
            </FButton>
            <FButton
              className="validate savebtn"
              name="checkmark"
              onClick={props.toggleDispositifValidateModal}
            >
              Valider
            </FButton>
          </CardBody>
          <CardFooter
            className="helpbtn cursor-pointer"
            onClick={props.toggleDispositifCreateModal}
          >
            <EVAIcon
              className="mr-8"
              name="question-mark-circle"
              viewBox="0 0 20 20"
            />
            Besoin d'aide ?
          </CardFooter>
        </Card>
      </Col>
    );
  }
}