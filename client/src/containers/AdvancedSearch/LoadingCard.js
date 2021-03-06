import React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import CustomCard from "../../components/UI/CustomCard/CustomCard";
import { CardBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import "./AdvancedSearch.scss";
import Skeleton from "react-loading-skeleton";

const CardText = styled.p`
  font-size: 32px;
  line-height: 40px !important;
  font-weight: 500;
  color: ${(props) => props.color};
`;

const LoadingCard = () => {
  return (
    <div className={"card-col puff-in-center dispositif"}>
      <CustomCard className={"border-none"}>
        <CardBody>
          <CardText>
            <Skeleton />
          </CardText>
          <Skeleton count={3}/>
{/*             <SeeMoreText>
              <Skeleton count={3}/>
            </SeeMoreText> */}
        </CardBody>
      </CustomCard>
    </div>
  );
};

export default withRouter(withTranslation()(LoadingCard));
