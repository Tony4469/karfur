import React from "react";
import {
  StyledHeader,
  StyledTitle,
  Content,
  FigureContainer,
  StyledSort,
} from "../../sharedComponents/StyledAdmin";
import { Table } from "reactstrap";
import { userHeaders, correspondingStatus } from "../data";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import { FilterButton } from "../../sharedComponents/SubComponents";

export const LoadingAdminUsers = () => {
  const arrayLines = new Array(12).fill("a");
  const arrayContent = new Array(5).fill("a");

  const compare = (a: any, b: any) => {
    const orderA = a.order;
    const orderB = b.order;
    return orderA > orderB ? 1 : -1;
  };
  return (
    <>
      <StyledHeader>
        <StyledTitle>Utilisateurs</StyledTitle>
        <FigureContainer>{"..."}</FigureContainer>
        <StyledSort>
          {correspondingStatus.sort(compare).map((element) => (
            <FilterButton
              key={element.status}
              onClick={() => {}}
              text={`${element.status} (...)`}
              isSelected={false}
            />
          ))}
        </StyledSort>
      </StyledHeader>
      <Content>
        <Table responsive borderless>
          <thead>
            <tr>
              {userHeaders.map((element, key) => (
                <th key={key}>
                  {element.name}
                  {element.order && (
                    <EVAIcon
                      // @ts-ignore
                      name={"chevron-" + (element.croissant ? "up" : "down")}
                      fill={colors.noir}
                      className="sort-btn"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {arrayLines.map((_, key) => {
              return (
                <tr key={key} className={"bg-blancSimple"}>
                  <td>
                    <SkeletonTheme color="#CDCDCD">
                      <Skeleton width={270} count={1} />
                    </SkeletonTheme>
                  </td>
                  {arrayContent.map((_, key) => (
                    <td key={key}>
                      <SkeletonTheme color="#CDCDCD">
                        <Skeleton width={70} count={1} />
                      </SkeletonTheme>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Content>
    </>
  );
};
