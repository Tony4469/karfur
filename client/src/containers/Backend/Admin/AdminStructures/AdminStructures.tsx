import React, { useState } from "react";
import { Table } from "reactstrap";
import { useSelector } from "react-redux";
import { allStructuresSelector } from "../../../../services/AllStructures/allStructures.selector";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
import { LoadingAdminStructures } from "./components/LoadingAdminStructures";
import {
  StyledTitle,
  StyledHeader,
  Content,
  FigureContainer,
  StyledSort,
  SearchBarContainer,
} from "../sharedComponents/StyledAdmin";
import "./AdminStructures.scss";
import {
  TabHeader,
  StyledStatus,
  FilterButton,
} from "../sharedComponents/SubComponents";
import moment from "moment/min/moment-with-locales";
import { headers, correspondingStatus } from "./data";
import {
  RowContainer,
  StructureName,
  ResponsableComponent,
} from "./components/AdminStructureComponents";
import {
  SimplifiedStructureForAdmin,
  Responsable,
} from "../../../../types/interface";
import { compare } from "../AdminContenu/AdminContenu";
import { CustomSearchBar } from "components/Frontend/Dispositif/CustomSeachBar/CustomSearchBar";
import FButton from "components/FigmaUI/FButton/FButton";
import { StructureDetailsModal } from "./StructureDetailsModal/StructureDetailsModal";
import { SelectFirstResponsableModal } from "./SelectFirstResponsableModal/SelectFirstResponsableModal";
import { NewStructureModal } from "./NewStructureModal/NewStructureModal";
import { ObjectId } from "mongodb";
import { UserDetailsModal } from "../AdminUsers/UserDetailsModal/UserDetailsModal";

moment.locale("fr");

export const AdminStructures = () => {
  const defaultSortedHeader = {
    name: "none",
    sens: "none",
    orderColumn: "none",
  };

  const [filter, setFilter] = useState("En attente");
  const [sortedHeader, setSortedHeader] = useState(defaultSortedHeader);
  const [search, setSearch] = useState("");
  const [showStructureDetailsModal, setShowStructureDetailsModal] = useState(
    false
  );
  const [showNewStructureModal, setShowNewStructureModal] = useState(false);

  const [showSelectFirstRespoModal, setSelectFirstRespoModal] = useState(false);
  const [
    selectedStructureId,
    setSelectedStructureId,
  ] = useState<ObjectId | null>(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<ObjectId | null>(null);

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_STRUCTURES)
  );

  const handleChange = (e: any) => setSearch(e.target.value);

  const toggleShowNewStructureModal = () =>
    setShowNewStructureModal(!showNewStructureModal);

  const toggleStructureDetailsModal = () =>
    setShowStructureDetailsModal(!showStructureDetailsModal);

  const addNewStructure = () => {
    toggleShowNewStructureModal();
  };

  const setSelectedStructureIdAndToggleModal = (
    element: SimplifiedStructureForAdmin | null
  ) => {
    setSelectedStructureId(element ? element._id : null);
    toggleStructureDetailsModal();
  };

  const onFilterClick = (status: string) => {
    setFilter(status);
    setSortedHeader(defaultSortedHeader);
  };

  const structures = useSelector(allStructuresSelector);

  if (
    (isLoading || structures.length === 0) &&
    showStructureDetailsModal === false
  ) {
    return <LoadingAdminStructures />;
  }
  const reorder = (element: { name: string; order: string }) => {
    if (sortedHeader.name === element.name) {
      const sens = sortedHeader.sens === "up" ? "down" : "up";
      setSortedHeader({ name: element.name, sens, orderColumn: element.order });
    } else {
      setSortedHeader({
        name: element.name,
        sens: "up",
        orderColumn: element.order,
      });
    }
  };

  const toggleUserDetailsModal = () =>
    setShowUserDetailsModal(!showUserDetailsModal);

  const setSelectedUserIdAndToggleModal = (element: Responsable | null) => {
    setSelectedUserId(element ? element._id : null);
    toggleUserDetailsModal();
  };

  const filterAndSortStructures = (
    structures: SimplifiedStructureForAdmin[]
  ) => {
    const structuresFilteredBySearch = !!search
      ? structures.filter(
          (structure) =>
            structure.nom &&
            structure.nom
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .includes(search.toLowerCase())
        )
      : structures;

    const filteredStructures = structuresFilteredBySearch.filter(
      (structure) => structure.status === filter
    );
    if (sortedHeader.name === "none")
      return {
        structuresToDisplay: filteredStructures,
        structuresForCount: structuresFilteredBySearch,
      };

    const structuresToDisplay = filteredStructures.sort(
      (a: SimplifiedStructureForAdmin, b: SimplifiedStructureForAdmin) => {
        // @ts-ignore
        const orderColumn:
          | "nom"
          | "status"
          | "nbMembres"
          | "responsable"
          | "nbFiches"
          | "created_at" = sortedHeader.orderColumn;

        if (orderColumn === "nbMembres") {
          if (a[orderColumn] > b[orderColumn])
            return sortedHeader.sens === "up" ? 1 : -1;
          return sortedHeader.sens === "up" ? -1 : 1;
        }

        if (orderColumn === "nbFiches") {
          const nbFichesA = a.nbFiches;
          const nbFichesB = b.nbFiches;

          if (nbFichesA > nbFichesB) return sortedHeader.sens === "up" ? 1 : -1;
          return sortedHeader.sens === "up" ? -1 : 1;
        }

        if (orderColumn === "responsable") {
          const respoA =
            a.responsable && a.responsable.username
              ? a.responsable.username.toLowerCase()
              : "";
          const respoB =
            b.responsable && b.responsable.username
              ? b.responsable.username.toLowerCase()
              : "";

          if (respoA > respoB) return sortedHeader.sens === "up" ? 1 : -1;
          return sortedHeader.sens === "up" ? -1 : 1;
        }

        if (orderColumn === "created_at") {
          if (moment(a.created_at).diff(moment(b.created_at)) > 0)
            return sortedHeader.sens === "up" ? 1 : -1;
          return sortedHeader.sens === "up" ? -1 : 1;
        }

        const valueA = a[orderColumn] ? a[orderColumn].toLowerCase() : "";
        const valueAWithoutAccent = valueA
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const valueB = b[orderColumn] ? b[orderColumn].toLowerCase() : "";
        const valueBWithoutAccent = valueB
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        if (valueAWithoutAccent > valueBWithoutAccent)
          return sortedHeader.sens === "up" ? 1 : -1;

        return sortedHeader.sens === "up" ? -1 : 1;
      }
    );
    return {
      structuresToDisplay,
      structuresForCount: structuresFilteredBySearch,
    };
  };

  const getNbStructuresByStatus = (
    structures: SimplifiedStructureForAdmin[],
    status: string
  ) =>
    structures && structures.length > 0
      ? structures.filter((structure) => structure.status === status).length
      : 0;

  const { structuresToDisplay, structuresForCount } = filterAndSortStructures(
    structures
  );

  const nbNonDeletedStructures = structures.filter(
    (structure) => structure.status !== "Supprimé"
  ).length;
  return (
    <div className="admin-structures">
      <SearchBarContainer>
        <CustomSearchBar
          value={search}
          // @ts-ignore
          onChange={handleChange}
          placeholder="Rechercher une structure..."
        />
        <FButton
          type="dark"
          name="plus-circle-outline"
          onClick={addNewStructure}
        >
          Ajouter une structure
        </FButton>
      </SearchBarContainer>
      <StyledHeader>
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <StyledTitle>Structures</StyledTitle>
          <FigureContainer>{nbNonDeletedStructures}</FigureContainer>
        </div>
        <StyledSort marginTop="8px">
          {correspondingStatus.sort(compare).map((element) => {
            const status = element.status;
            const nbStructures = getNbStructuresByStatus(
              structuresForCount,
              status
            );
            return (
              <FilterButton
                key={status}
                onClick={() => onFilterClick(status)}
                text={`${status} (${nbStructures})`}
                isSelected={filter === status}
              />
            );
          })}
        </StyledSort>
      </StyledHeader>
      <Content>
        <Table responsive borderless>
          <thead>
            <tr>
              {headers.map((element, key) => (
                <th
                  key={key}
                  onClick={() => {
                    reorder(element);
                  }}
                >
                  <TabHeader
                    name={element.name}
                    order={element.order}
                    isSortedHeader={sortedHeader.name === element.name}
                    sens={
                      sortedHeader.name === element.name
                        ? sortedHeader.sens
                        : "down"
                    }
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {structuresToDisplay.map((element, key) => (
              <tr key={key}>
                <td
                  className="align-middle"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
                  <RowContainer>
                    {element.picture && element.picture.secure_url && (
                      <img
                        className="sponsor-img mr-8"
                        src={(element.picture || {}).secure_url}
                      />
                    )}
                    <StructureName>{element.nom}</StructureName>
                  </RowContainer>
                </td>
                <td
                  className="align-middle"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
                  <StyledStatus
                    text={element.status}
                    textToDisplay={element.status}
                  />
                </td>
                <td
                  className="align-middle cursor-pointer"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
                  {element.nbMembres}
                </td>

                <td
                  className={"align-middle "}
                  onClick={() =>
                    setSelectedUserIdAndToggleModal(element.responsable)
                  }
                >
                  <ResponsableComponent
                    responsable={element.responsable}
                    canModifyRespo={false}
                    onClick={() => {}}
                  />
                </td>
                <td
                  className="align-middle"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
                  {element.nbFiches}
                </td>
                <td
                  className="align-middle"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
                  {element.created_at
                    ? moment(element.created_at).format("LLL")
                    : "Non connue"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Content>

      <StructureDetailsModal
        show={showStructureDetailsModal}
        toggleModal={() => setSelectedStructureIdAndToggleModal(null)}
        selectedStructureId={selectedStructureId}
        toggleRespoModal={() => setSelectFirstRespoModal(true)}
      />
      <NewStructureModal
        show={showNewStructureModal}
        toggleModal={toggleShowNewStructureModal}
      />

      <SelectFirstResponsableModal
        show={showSelectFirstRespoModal}
        toggleModal={() => setSelectFirstRespoModal(false)}
        selectedStructureId={selectedStructureId}
      />
      {selectedUserId && (
        <UserDetailsModal
          show={showUserDetailsModal}
          toggleModal={() => setSelectedUserIdAndToggleModal(null)}
          selectedUserId={selectedUserId}
        />
      )}
    </div>
  );
};
