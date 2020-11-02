import React, { useState } from "react";
// @ts-ignore
import styled from "styled-components";
// @ts-ignore
import Icon from "react-eva-icons";
import { filtres } from "../../../containers/Dispositif/data";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import { CustomDropDown } from "../../../containers/Annuaire/AnnuaireCreate/CustomDropdown/CustomDropdown";
import { CustomCheckBox } from "../../../containers/Annuaire/AnnuaireCreate/components/CustomCheckBox/CustomCheckBox";
import FInput from "../../../components/FigmaUI/FInput/FInput";

import "./GeolocModal.css";
import Modal from "../Modal";

const IconContainer = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  right: 20px;
  top: 20px;
  cursor: pointer;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  margin-bottom: 16px;
  margin-top: 8px;
`;

const HelpContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: #2d9cdb;
  border-radius: 12px;
  //width: 800px;
  padding: 16px;
  margin-bottom: 24px;
  position: relative;
`;

const HelpDescription = styled.div`
  line-height: 28px;
  color: #fbfbfb;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
`;

const DepartmentContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const CheckboxContainer = styled.div`
  background: ${(props) => (props.checked ? "#DEF7C2" : "#f2f2f2")};
  border-radius: 12px;
  width: fit-content;
  padding: 14px;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  color: #828282;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
`;

const SelectedContainer = styled.div`
  background: #8bc34a;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;
  color: #ffffff;
  padding: 15px;
  width: fit-content;
  heigth: 50px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
  margin-right: 8px;
`;

const ButtonText = styled.p`
  font-size: 16px;
  line-height: 20px;
  margin: 0;
`;

const StyledButtonGroupContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  width: 90%;
  bottom: 40px;
  //margin-top: 20px;
`;

const StyledRightButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

const GeolocModal = (props) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState(
    props.departments || []
  );
  const [departmentInput, setDepartmentInput] = useState("");

  const onDepartmentChange = (e) => {
    setDepartmentInput(e.target.value);
    if (e.target.value === "") {
      return setDepartments([]);
    }
    const departmentsDataFiltered = filtres.departmentsData.filter(
      (department) =>
        selectedDepartments ? !selectedDepartments.includes(department) : false
    );

    const filteredDepartments = departmentsDataFiltered.filter((department) =>
      department.toLowerCase().includes(e.target.value.toLowerCase())
    );

    // @ts-ignore
    setDepartments(filteredDepartments);
  };

  const removeDropdowElement = (element) => {
    const departments = selectedDepartments
      ? selectedDepartments.filter((department) => department !== element)
      : [];
    setSelectedDepartments(departments);
  };

  const handleCheckboxChange = () => {
    if (selectedDepartments && selectedDepartments[0] === "All") {
      setSelectedDepartments([]);
    } else {
      setSelectedDepartments(["All"]);
    }
  };

  const onDropdownElementClick = (element) => {
    const departments = selectedDepartments
      ? !selectedDepartments
        ? [element]
        : selectedDepartments.concat([element])
      : [];
    setSelectedDepartments(departments);
    setDepartments([]);
    setDepartmentInput("");
  };

  const onValidate = () => {
    props.validateDepartments(selectedDepartments);
    props.hideModal();
  };

  const isFranceSelected =
    !!selectedDepartments && selectedDepartments[0] === "All";

  return (
    <Modal show={props.show} classe="success-modal text-center">
      <IconContainer onClick={props.hideModal}>
        <Icon name="close-outline" fill="#3D3D3D" size="large" />
      </IconContainer>
      <div id="svgContainer" />

      <h1>Zone d'action</h1>
      <p>
        Sélectionnez les départements sur lesquels votre dispositif est actif :
      </p>

      {!isFranceSelected && (
        <DepartmentContainer>
          {selectedDepartments &&
            selectedDepartments.length > 0 &&
            selectedDepartments.map((department) => (
              <SelectedContainer key={department}>
                {department}
                <div style={{ cursor: "pointer" }}>
                  <EVAIcon
                    name="close"
                    fill={"#ffffff"}
                    className="ml-10"
                    onClick={() => removeDropdowElement(department)}
                  />
                </div>
              </SelectedContainer>
            ))}
        </DepartmentContainer>
      )}
      {selectedDepartments && selectedDepartments.length < 8 && (
        <div style={{ width: "280px", marginRight: "8px" }}>
          <FInput
            value={departmentInput}
            onChange={onDepartmentChange}
            newSize={true}
            placeholder="Entrez un numéro de département"
            type="number"
            prepend
            prependName="hash"
            autoFocus={false}
          />
          <CustomDropDown
            elementList={departments}
            onDropdownElementClick={onDropdownElementClick}
          />
        </div>
      )}
      {selectedDepartments && selectedDepartments.length === 8 && (
        <HelpContainer>
          <HelpDescription>
            Nombre maximum de département renseignés. Préférez l’option{" "}
            <b>France entière</b> si votre dispositif est présent sur de
            nombreux territoires.
          </HelpDescription>
        </HelpContainer>
      )}
      <Title>OU</Title>
      <p>
        Votre dispositif est accessible sur tout le territoire, cochez l’option
        ci-dessous :{" "}
      </p>
      <CheckboxContainer
        onClick={handleCheckboxChange}
        checked={isFranceSelected}
      >
        <CustomCheckBox checked={isFranceSelected} />
        France entière
      </CheckboxContainer>

      <StyledButtonGroupContainer>
        <FButton type="tuto" name={"play-circle-outline"}>
          Tutoriel
        </FButton>
        <StyledRightButtonGroup>
          <FButton
            type="validate"
            name="checkmark"
            onClick={onValidate}
            disabled={selectedDepartments.length === 0}
          >
            <ButtonText>Valider</ButtonText>
          </FButton>
        </StyledRightButtonGroup>
      </StyledButtonGroupContainer>
    </Modal>
  );
};

export default GeolocModal;