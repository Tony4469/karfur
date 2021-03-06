import React from "react";
import { Col, Row, Table } from "reactstrap";
import Icon from "react-eva-icons";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { withTranslation } from "react-i18next";

import marioProfile from "../../../../assets/mario-profile.jpg";
import { colorStatut } from "../../../Functions/ColorFunctions";
import FButton from "../../../FigmaUI/FButton/FButton";
import { fakeContribution } from "../../../../containers/Backend/UserProfile/data";
import { NavHashLink } from "react-router-hash-link"

import {colors} from "colors";
import _ from "lodash";

const contribTable = (props) => {
  const { t } = props;
  const contributeur = (props.dataArray || []).length > 0;
  const dataArray = contributeur
    ? props.dataArray
    : new Array(5).fill(fakeContribution);
  const data = props.limit ? dataArray.slice(0, props.limit) : dataArray;
  const hideOnPhone = props.hideOnPhone || new Array(props.headers).fill(false);

  const deleteContrib = (e, dispositif) => {
    e.stopPropagation();
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "La suppression d'un dispositif est irréversible",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: "Oui, le supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.value) {
        const newDispositif = {
          dispositifId: dispositif._id,
          status: "Supprimé",
        };
        props.deleteContrib(newDispositif, props.type);
      }
    });
  };

  const table = (
    <Table responsive className="avancement-user-table">
      <thead>
        <tr>
          {props.headers.map((element, key) => (
            <th key={key} className={hideOnPhone[key] ? "hideOnPhone" : ""}>
              {element && t("Tables." + element, element)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(0, props.limit).map((element, key) => {
          const titre =
            (element.titreMarque || "") +
            (element.titreMarque && element.titreInformatif ? " - " : "") +
            (element.titreInformatif || "");
          const deduplicatedParticipants = element.participants
            ? _.uniqBy(element.participants, "username")
            : [];

          return (
            <tr
              key={key}
              onClick={() =>
                props.history.push(
                  "/" +
                    (element.typeContenu || "dispositif") +
                    "/" +
                    element._id
                )
              }
            >
              <td className="align-middle">
                {props.windowWidth > 768
                  ? titre
                  : titre.slice(0, 24) + (titre.length > 24 ? "..." : "")}
              </td>
              <td className="align-middle">
                <div
                  className={"status-pill bg-" + colorStatut(element.status)}
                >
                  {t("Status." + element.status, element.status)}
                </div>
              </td>
              <td className="align-middle hideOnPhone">
                {deduplicatedParticipants &&
                  deduplicatedParticipants.map((participant, key) => {
                    return (
                      <img
                        key={key}
                        src={
                          participant.picture
                            ? participant.picture.secure_url
                            : marioProfile
                        }
                        className="profile-img-pin img-circle"
                        alt="Image manquante"
                      />
                    );
                  })}
              </td>
              <td className="align-middle pointer fit-content">
                {(props.type !== "user" ||
                  [
                    "En attente non prioritaire",
                    "Brouillon",
                    "Rejeté structure",
                    "Rejeté admin",
                    "Inactif",
                  ].includes(element.status)) && (
                  <FButton
                    type="light-action"
                    name="trash-2-outline"
                    fill={colors.noir}
                    onClick={(e) => deleteContrib(e, element)}
                  />
                )}
              </td>
              <td className="align-middle">
                <FButton
                  tag={NavLink}
                  to={
                    "/" +
                    (element.typeContenu || "dispositif") +
                    "/" +
                    element._id
                  }
                  type="light-action"
                  name="eye-outline"
                  fill={colors.noir}
                />
              </td>
            </tr>
          );
        })}
        {props.limit && dataArray.length > 5 && (
          <tr>
            <td
              colSpan="6"
              className="align-middle voir-plus"
              onClick={() => props.toggleModal("contributions")}
            >
              <Icon name="expand-outline" fill={colors.noir} size="large" />
              &nbsp;
              {t("Tables.Voir plus", "Voir plus")}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );

  let show = true;
  const onAnimationEnd = () => (show = false);

  if (props.limit) {
    return (
      <div
        className={"tableau-wrapper" + (props.hide ? " swing-out-top-bck" : "")}
        id="mes-contributions"
        onAnimationEnd={onAnimationEnd}
      >
        <Row>
          {!props.hideTitle && (
            <Col>
              <h1>{t("Tables." + props.title, props.title)}</h1>
            </Col>
          )}
          {props.displayIndicators && contributeur && (
            <Col className="d-flex tableau-header">
              <div style={{ position: "absolute", right: 20 }}>
                <FButton
                  tag={NavLink}
                  to="/backend/user-dash-contrib"
                  type="dark"
                  name="file-add-outline"
                >
                  {t("Tables.Espace rédaction", "Espace rédaction")}
                </FButton>
              </div>
            </Col>
          )}
        </Row>

        <div className="tableau">
          {table}

          {!contributeur && (
            <div className="ecran-protection no-contrib">
              {/*props.toggleSection && 
               <div className="close-box" onClick={()=>props.toggleSection('contributions')}>
                  <Icon name="eye-off-2-outline" fill={colors.noir} />
                  <u>Masquer</u>
              </div>*/}
              <div className="content-wrapper">
                <h1>{t("Tables." + props.overlayTitle, props.overlayTitle)}</h1>
                <span className="subtitle">
                  {t("Tables." + props.overlaySpan, props.overlaySpan)}
                </span>
                <FButton
                  type="light-action hero"
                  name="info-outline"
                  fill={colors.noir}
                  tag={NavHashLink}
                  to="/comment-contribuer#ecrire"
                >
                  {t("Tables." + props.overlayBtn, props.overlayBtn)}
                </FButton>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else if (show) {
    return table;
  }
  return false;
};

export default withTranslation()(contribTable);
