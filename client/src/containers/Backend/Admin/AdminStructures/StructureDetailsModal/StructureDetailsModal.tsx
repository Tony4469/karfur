import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SimplifiedStructureForAdmin, Event } from "types/interface";
import { Modal, Input, Spinner } from "reactstrap";
import "./StructureDetailsModal.scss";
import FInput from "components/FigmaUI/FInput/FInput";
import moment from "moment/min/moment-with-locales";
import FButton from "components/FigmaUI/FButton/FButton";
import API from "utils/API";
import noStructure from "assets/noStructure.png";
import { ObjectId } from "mongodb";
import {
  ResponsableComponent,
  RowContainer,
} from "../components/AdminStructureComponents";
import { correspondingStatus } from "../data";
import { compare } from "../../AdminContenu/AdminContenu";
import { StyledStatus } from "../../sharedComponents/SubComponents";
import Swal from "sweetalert2";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { structureSelector } from "services/AllStructures/allStructures.selector";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { fetchAllStructuresActionsCreator } from "../../../../../services/AllStructures/allStructures.actions";
import { fetchAllDispositifsActionsCreator } from "../../../../../services/AllDispositifs/allDispositifs.actions";
import { fetchAllUsersActionsCreator } from "../../../../../services/AllUsers/allUsers.actions";
moment.locale("fr");

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin: 0px 0px 8px 0px;
`;

const InputContainer = styled.div`
  margin-bottom: 8px;
  width: 440px;
`;
const BottomRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const LogoWrapper = styled.div`
  width: 160px;
  max-height: 200px;
`;
const RightLogoContainer = styled.div`
  margin-left: 32px;
  margin-bottom: 24px;
`;
interface Props extends RouteComponentProps {
  show: boolean;
  toggleModal: () => void;
  toggleRespoModal: () => void;
  selectedStructureId: ObjectId | null;
}

const StructureDetailsModalComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
  const [
    structure,
    setStructure,
  ] = useState<SimplifiedStructureForAdmin | null>(null);
  const [uploading, setUploading] = useState(false);

  const structureFromStore = useSelector(
    structureSelector(props.selectedStructureId)
  );

  useEffect(() => {
    setStructure(structureFromStore);
  }, [structureFromStore]);

  const dispatch = useDispatch();
  const updateData = () => {
    dispatch(fetchAllStructuresActionsCreator());
    dispatch(fetchAllDispositifsActionsCreator());
    dispatch(fetchAllUsersActionsCreator());
  };
  const onSave = async () => {
    try {
      await API.updateStructure({ query: structure });
      Swal.fire({
        title: "Yay...",
        text: "Structure modifiée",
        type: "success",
        timer: 1500,
      });
      updateData();
      props.toggleModal();
    } catch (error) {
      Swal.fire({
        title: "Oh non",
        text: "Erreur lors de la modification",
        type: "error",
        timer: 1500,
      });
      updateData();
      props.toggleModal();
    }
  };

  const handleFileInputChange = (event: any) => {
    if (!structure) return;
    setUploading(true);
    const formData = new FormData();
    // @ts-ignore
    formData.append(0, event.target.files[0]);

    API.set_image(formData).then(
      (data_res: {
        data: {
          data: { secure_url: string; public_id: string; imgId: ObjectId };
        };
      }) => {
        const imgData = data_res.data.data;
        setStructure({
          ...structure,
          picture: {
            secure_url: imgData.secure_url,
            public_id: imgData.public_id,
            imgId: imgData.imgId,
          },
        });
        setUploading(false);
        return;
      }
    );
  };

  const modifyStatus = (status: string) => {
    if (!structure) return;
    const updatedStructure = { ...structure, status };
    return setStructure(updatedStructure);
  };

  const onChange = (e: Event) => {
    if (!structure) return;
    setStructure({ ...structure, [e.target.id]: e.target.value });
  };
  const secureUrl =
    structure && structure.picture && structure.picture.secure_url;

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_STRUCTURES)
  );

  if (isLoading) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        className="structure-details-modal"
      >
        <Spinner />
      </Modal>
    );
  }

  if (!structure)
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        className="structure-details-modal"
      >
        Erreur
      </Modal>
    );
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      className="structure-details-modal"
    >
      <InputContainer>
        <FInput
          id="nom"
          value={structure.nom}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
        />
      </InputContainer>
      <LogoContainer>
        <LogoWrapper>
          <img className="sponsor-img" src={secureUrl || noStructure} />
        </LogoWrapper>
        <RightLogoContainer>
          <FButton className="upload-btn" type="theme" name="upload-outline">
            <Input
              className="file-input"
              type="file"
              id="picture"
              name="structure"
              accept="image/*"
              onChange={handleFileInputChange}
            />
            {secureUrl ? (
              <span>Choisir une autre image</span>
            ) : (
              <span>Ajouter un logo</span>
            )}

            {uploading && <Spinner color="success" className="ml-10" />}
          </FButton>
        </RightLogoContainer>
      </LogoContainer>
      <Title>Premier responsable</Title>
      {!isLoading && (
        <div style={{ marginBottom: "8px" }}>
          <ResponsableComponent
            responsable={structure.responsable}
            canModifyRespo={true}
            onClick={props.toggleRespoModal}
          />
        </div>
      )}

      {isLoading && (
        <div style={{ marginBottom: "8px" }}>
          <Spinner />
        </div>
      )}

      <Title>Coordonnées du contact unique</Title>
      <InputContainer>
        <FInput
          id="contact"
          value={structure.contact}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          placeholder="Coordonnées"
        />
      </InputContainer>
      <InputContainer>
        <FInput
          id="mail_contact"
          value={structure.mail_contact}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          placeholder="Adresse email"
        />
      </InputContainer>
      <InputContainer>
        <FInput
          id="phone_contact"
          value={structure.phone_contact}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          placeholder="Numéro de téléphone"
        />
      </InputContainer>
      <Title>Statut</Title>
      <RowContainer>
        {correspondingStatus.sort(compare).map((element) => {
          return (
            <div
              key={element.status}
              style={{
                marginRight: "8px",
                marginBottom: "8px",
              }}
              onClick={() => modifyStatus(element.status)}
            >
              <StyledStatus
                text={element.status}
                overrideColor={structure.status !== element.status}
                textToDisplay={element.status}
                // color={element.color}
                disabled={false}
              />
            </div>
          );
        })}
      </RowContainer>
      <Title>Date de création</Title>
      {structure.created_at
        ? moment(structure.created_at).format("LLL")
        : "Non connue"}
      <BottomRowContainer>
        <div>
          <FButton
            className="mr-8"
            type="dark"
            name="external-link"
            onClick={() => {
              props.history.push({
                pathname: "/backend/user-dash-structure-selected",
                state: {
                  admin: true,
                  structure: structure._id,
                },
              });
            }}
          >
            Page
          </FButton>
          {structure && structure.status === "Actif" && (
            <FButton
              className="mr-8"
              type="dark"
              name="paper-plane"
              tag={"a"}
              href={`/annuaire/${structure._id}`}
              target="_blank"
            >
              Annuaire
            </FButton>
          )}
        </div>
        <div>
          <FButton
            className="mr-8"
            type="white"
            name="close-outline"
            onClick={props.toggleModal}
          >
            Annuler
          </FButton>
          <FButton
            className="mr-8"
            type="validate"
            name="checkmark-outline"
            onClick={onSave}
          >
            Enregistrer
          </FButton>
        </div>
      </BottomRowContainer>
    </Modal>
  );
};

export const StructureDetailsModal = withRouter(StructureDetailsModalComponent);
