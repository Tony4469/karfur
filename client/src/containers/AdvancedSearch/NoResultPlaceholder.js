import React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import "./AdvancedSearch.scss";
import NoResultsBackgroundImage from "../../assets/no_results.svg";
import FButton from "../../components/FigmaUI/FButton/FButton";

const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${NoResultsBackgroundImage});
  min-width: 254px;
  height: 180px;
  margin-right: 75px;
`;

const NoResultsTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoResultsButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const NoResultsTitle = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  margin-bottom: 24px !important;
`;

const NoResultsText = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 23px !important;
  margin-bottom: 24px !important;
  max-width: 520px;
`;

const NoResultPlaceholder = ({ restart, writeNew, t }) => {
  return (
    <NoResultsContainer>
      <NoResults />
      <NoResultsTextContainer>
        <NoResultsTitle>{t("Aucun résultat", "Aucun résultat")}</NoResultsTitle>
        <NoResultsText>
          {t(
            "AdvancedSearch.Elargir recherche",
            "Il n’existe aucune fiche correspondant aux critères sélectionnés. Essayez d’élargir votre recherche en retirant des critères."
          )}{" "}
        </NoResultsText>
        <NoResultsButtonsContainer>
          <FButton
            type="dark"
            name="refresh-outline"
            className="mr-10"
            onClick={restart}
          >
            Recommencer
          </FButton>
          <FButton
            type="white-yellow-hover"
            name="file-add-outline"
            onClick={writeNew}
          >
            Rédiger une nouvelle fiche
          </FButton>
        </NoResultsButtonsContainer>
      </NoResultsTextContainer>
    </NoResultsContainer>
  );
};

export default withRouter(withTranslation()(NoResultPlaceholder));
