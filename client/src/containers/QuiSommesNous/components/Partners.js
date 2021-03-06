import React from "react";
import styled from "styled-components";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import { partners } from "../data";

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const DescriptionContainer = styled.div`
  font-size: 16px;
  line-height: 20px;
  width: 360px;
  margin-right: 60px;
`;
const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

const ImageContainer = styled.div`
  margin-right: 32px;
  margin-bottom: 32px;
  align-self: center;
`;
const sortPartners = () =>
  partners.sort((a, b) => {
    if (a.date === b.date) return 0;
    if (a.date > b.date) return 1;
    return -1;
  });

export const Partners = (props) => {
  const sortedPartners = sortPartners();

  return (
    <MainContainer>
      <DescriptionContainer>
        <b>
          {props.t(
            "QuiSommesNous.appel-a-manifestation1",
            "Ces organisations ont signé un Appel à manifestation d’intérêt et participent à l’évolution de la plateforme."
          )}
        </b>
        <br />
        <br />
        {props.t(
          "QuiSommesNous.appel-a-manifestation2",
          "Vous représentez une organisation liée à l’intégration des personnes réfugiées et souhaitez rejoindre l’aventure ? Téléchargez l’appel ci-dessous et envoyez-le à nour@refugies.info. Nous prendrons contact avec vous pour définir les modalités de notre partenariat."
        )}
        <div style={{ marginTop: "32px" }}>
          <a href="/AMI_REFUGIE_INFO.pdf" download>
            <FButton type="fill-dark" name="download-outline">
              {props.t(
                "QuiSommesNous.telechargerAppel",
                "Télécharger l’appel [PDF] "
              )}
            </FButton>
          </a>
        </div>
      </DescriptionContainer>
      <LogoContainer>
        {sortedPartners.map((partner) => {
          if (partner.logo)
            return (
              <ImageContainer>
                <img src={partner.logo} alt={partner.name} />
              </ImageContainer>
            );
        })}
      </LogoContainer>
    </MainContainer>
  );
};
