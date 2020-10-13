import React, { useState } from "react";
import styled from "styled-components";
import {
  Structure,
  DetailedOpeningHours,
} from "../../../../../@types/interface";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";
import FInput from "../../../../../components/FigmaUI/FInput/FInput";
import { days, departmentsData } from "./data";
import { HoursDetails } from "./HoursDetails";
import { CustomDropDown } from "../../CustomDropdown/CustomDropdown";
import { CustomCheckBox } from "../CustomCheckBox/CustomCheckBox";
import { AddButton } from "../Step2/Step2";

interface Props {
  structure: Structure | null;
  setStructure: (arg: any) => void;
}

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  margin-bottom: 16px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 24px;
  margin-bottom: 48px;
`;

const HelpContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: #2d9cdb;
  border-radius: 12px;
  width: 800px;
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

const IconContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
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

const Subtitle = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 12px;
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
const DeleteIconContainer = styled.div`
  background: #212121;
  height: 50px;
  width: 50px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
export const Step4 = (props: Props) => {
  const [showHelp, setShowHelp] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [departmentInput, setDepartmentInput] = useState("");

  const [show1PhoneInput, setshow1PhoneInput] = useState(false);
  const [show2PhoneInput, setshow2PhoneInput] = useState(false);

  const toggle1PhoneInput = () => setshow1PhoneInput((prevState) => !prevState);

  const toggle2PhoneInput = () => setshow2PhoneInput((prevState) => !prevState);

  const onDepartmentChange = (e: any) => {
    setDepartmentInput(e.target.value);
    if (e.target.value === "") {
      return setDepartments([]);
    }
    const departmentsDataFiltered = departmentsData.filter((department) =>
      props.structure
        ? !props.structure.departments.includes(department)
        : false
    );

    const filteredDepartments = departmentsDataFiltered.filter((department) =>
      department.toLowerCase().includes(e.target.value.toLowerCase())
    );

    // @ts-ignore
    setDepartments(filteredDepartments);
  };

  const onChange = (e: any) =>
    props.setStructure({ ...props.structure, [e.target.id]: e.target.value });

  const removeDropdowElement = (element: string) => {
    const departments = props.structure
      ? props.structure.departments.filter(
          (department) => department !== element
        )
      : [];
    props.setStructure({ ...props.structure, departments });
  };

  const handleCheckboxChange = () => {
    if (
      props.structure &&
      props.structure.departments &&
      props.structure.departments[0] === "All"
    ) {
      return props.setStructure({
        ...props.structure,
        departments: [],
      });
    }
    return props.setStructure({
      ...props.structure,
      departments: ["All"],
    });
  };

  const handlePublicCheckboxChange = () => {
    if (props.structure && props.structure.openingHours.noPublic) {
      return props.setStructure({
        ...props.structure,
        openingHours: { details: [], noPublic: false },
      });
    }
    return props.setStructure({
      ...props.structure,
      openingHours: { details: [], noPublic: true },
    });
  };

  const onDropdownElementClick = (element: string) => {
    const departments = props.structure
      ? !props.structure.departments
        ? [element]
        : props.structure.departments.concat([element])
      : [];
    props.setStructure({ ...props.structure, departments });
    setDepartments([]);
    setDepartmentInput("");
  };

  const getPhones = (previousPhones: string[], id: string, value: string) => {
    if (id === "phone0") {
      if (
        !previousPhones ||
        previousPhones.length === 0 ||
        !previousPhones[1]
      ) {
        return [value];
      }
      return [value, previousPhones[1]];
    }
    return [previousPhones[0], value];
  };
  const onPhoneChange = (e: any) => {
    const phones = props.structure
      ? getPhones(props.structure.phonesPublic, e.target.id, e.target.value)
      : [];
    props.setStructure({ ...props.structure, phonesPublic: phones });
  };

  const onPrecisionsChange = (e: any) =>
    props.setStructure({
      ...props.structure,
      openingHours: {
        ...props.structure?.openingHours,
        precisions: e.target.value,
      },
    });

  const getUpdatedPhones = (phones: string[], index: number) =>
    phones.filter((phone) => phone !== phones[index]);

  const removePhone = (index: number) => {
    const updatedPhones =
      props.structure && props.structure.phonesPublic
        ? getUpdatedPhones(props.structure.phonesPublic, index)
        : [];
    props.setStructure({ ...props.structure, phonesPublic: updatedPhones });
    setshow1PhoneInput(false);
    setshow2PhoneInput(false);
  };

  const isFranceSelected =
    !!props.structure && props.structure.departments[0] === "All";

  const phones =
    props.structure && props.structure.phonesPublic
      ? props.structure.phonesPublic
      : [];

  const noPublicChecked =
    !!props.structure &&
    !!props.structure.openingHours &&
    props.structure.openingHours.noPublic;

  const getNewDetailedOpeningHours = (day: string) => {
    if (!props.structure) return [];
    if (!props.structure.openingHours) return [{ day }];

    if (props.structure.openingHours.noPublic) return [];

    if (!props.structure.openingHours.details) return [{ day }];

    const isDayInOpeningHours =
      props.structure.openingHours.details.filter(
        (element: DetailedOpeningHours) => element.day === day
      ).length > 0;

    if (isDayInOpeningHours)
      return props.structure.openingHours.details.filter(
        (element: DetailedOpeningHours) => element.day !== day
      );

    return props.structure.openingHours.details.concat([{ day }]);
  };
  const onDayClick = (day: string) => {
    const newDetailedOpeningHours = getNewDetailedOpeningHours(day);
    const newOpeningHours = props.structure
      ? { ...props.structure.openingHours, details: newDetailedOpeningHours }
      : { noPublic: false, details: [] };
    props.setStructure({ ...props.structure, openingHours: newOpeningHours });
  };

  const onHoursChange = (value: any, index: string, day: string) => {
    if (!props.structure) return;
    if (props.structure && props.structure.openingHours.noPublic) return;

    const dayRegistered = props.structure.openingHours.details
      ? props.structure.openingHours.details.filter(
          (element) => element.day === day
        )
      : [];

    if (dayRegistered) {
      const updatedDay = {
        ...dayRegistered[0],
        [index]: value.format("HH:mm"),
      };
      const openingHoursWithoutDayRegistered = props.structure.openingHours
        .details
        ? props.structure.openingHours.details.filter(
            (element) => element.day !== day
          )
        : [];
      const openingHours = props.structure.openingHours
        ? {
            ...props.structure.openingHours,
            details: openingHoursWithoutDayRegistered.concat([updatedDay]),
          }
        : { noPublic: false, details: [] };
      props.setStructure({
        ...props.structure,
        openingHours,
      });
    }
  };

  return (
    <MainContainer>
      <Title>Départements d'action</Title>
      {showHelp && (
        <HelpContainer>
          <IconContainer onClick={() => setShowHelp(false)}>
            <EVAIcon name="close" />
          </IconContainer>
          <HelpDescription>
            Si votre structure est présente sur beaucoup de départements, cochez
            le choix “France entière” puis créez une structure pour chacune de
            vos antennes territoriales.
          </HelpDescription>
        </HelpContainer>
      )}
      {!isFranceSelected && (
        <DepartmentContainer>
          {props.structure &&
            props.structure.departments &&
            props.structure.departments.length > 0 &&
            props.structure.departments.map((department) => (
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
          {props.structure && props.structure.departments.length < 8 && (
            <div style={{ width: "180px", marginRight: "8px" }}>
              <FInput
                value={departmentInput}
                onChange={onDepartmentChange}
                newSize={true}
                placeholder="Entrez un numéro"
                type="number"
                prepend
                prependName="hash"
              />
              <CustomDropDown
                elementList={departments}
                onDropdownElementClick={onDropdownElementClick}
              />
            </div>
          )}
        </DepartmentContainer>
      )}
      <CheckboxContainer
        onClick={handleCheckboxChange}
        checked={isFranceSelected}
      >
        <CustomCheckBox checked={isFranceSelected} />
        France entière
      </CheckboxContainer>
      <Title>Numéro de télephone</Title>
      <div style={{ marginBottom: "16px" }}>
        {(phones.length > 0 || show1PhoneInput) && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  width: "200px",
                  marginRight: "4px",
                }}
              >
                <FInput
                  id="phone0"
                  value={phones && phones[0]}
                  onChange={onPhoneChange}
                  newSize={true}
                  placeholder="Votre numéro de téléphone"
                  type="number"
                />
              </div>
              <DeleteIconContainer onClick={() => removePhone(0)}>
                <EVAIcon size="medium" name="close-outline" fill={"#ffffff"} />
              </DeleteIconContainer>
            </div>
            {phones.length < 2 && !show2PhoneInput && (
              <AddButton
                type="second numéro"
                onClick={toggle2PhoneInput}
                disabled={!phones[0]}
              />
            )}
          </>
        )}
        {(phones.length === 2 || show2PhoneInput) && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div style={{ width: "300px", marginRight: "4px" }}>
              <FInput
                type="number"
                id="phone1"
                value={phones && phones[1]}
                onChange={onPhoneChange}
                newSize={true}
                placeholder="Votre numéro de téléphone"
              />
            </div>
            <DeleteIconContainer onClick={() => removePhone(1)}>
              <EVAIcon size="medium" name="close-outline" fill={"#ffffff"} />
            </DeleteIconContainer>
          </div>
        )}
        {phones.length === 0 && !show1PhoneInput && (
          <AddButton type="numéro" onClick={toggle1PhoneInput} />
        )}
      </div>
      <Title>Adresse postale</Title>
      <div
        style={{
          marginBottom: "16px",
          width: "640px",
        }}
      >
        <FInput
          id="adressPublic"
          value={props.structure && props.structure.adressPublic}
          onChange={onChange}
          newSize={true}
          placeholder="Entrez votre adresse"
          prepend
          prependName="pin-outline"
        />
      </div>
      <Title>Horaires d'accueil du public</Title>
      <CheckboxContainer
        onClick={handlePublicCheckboxChange}
        checked={noPublicChecked}
      >
        <CustomCheckBox checked={noPublicChecked} />
        Notre structure n'accueille pas de public.
      </CheckboxContainer>
      {!noPublicChecked && (
        <>
          <Subtitle>Cochez ou décochez les jours d'ouverture :</Subtitle>
          {days.map((day) => (
            <HoursDetails
              key={day}
              day={day}
              onClick={onDayClick}
              // @ts-ignore : it is not a string since noPublicChecked is false
              openingHours={props.structure ? props.structure.openingHours : []}
              onChange={onHoursChange}
            />
          ))}
        </>
      )}
      <div
        style={{
          marginTop: "16px",
          width: "640px",
          marginBottom: "32px",
        }}
      >
        <FInput
          value={
            props.structure &&
            props.structure.openingHours &&
            props.structure.openingHours.precisions
          }
          onChange={onPrecisionsChange}
          newSize={true}
          placeholder="Ajoutez ici des précisions si besoin (jours fériés, sur rendez-vous, etc.)"
          prepend
          prependName="info-outline"
        />
      </div>
    </MainContainer>
  );
};