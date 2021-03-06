import { IDispositif } from "../../types/interface";
import { ObjectId } from "mongoose";
import { departmentRegionCorrespondency } from "./data";
import _ from "lodash";

export const removeUselessContent = (dispositifArray: IDispositif[]) =>
  dispositifArray.map((dispositif) => {
    const selectZoneAction = dispositif.contenu[1].children.map(
      (child: any) => {
        if (child.title === "Zone d'action") {
          return child;
        }
        return {};
      }
    );

    const simplifiedContent = [{}, { children: selectZoneAction }];
    return { ...dispositif, contenu: simplifiedContent };
  });

export const adaptDispositifMainSponsorAndCreatorId = (
  dispositifs: IDispositif[]
) =>
  dispositifs.map((dispositif) => {
    const jsonDispositif = dispositif.toJSON();

    return {
      ...jsonDispositif,
      mainSponsor: jsonDispositif.mainSponsor
        ? {
            _id: jsonDispositif.mainSponsor._id,
            nom: jsonDispositif.mainSponsor.nom,
            status: jsonDispositif.mainSponsor.status,
            picture: jsonDispositif.mainSponsor.picture,
          }
        : "",
      creatorId: jsonDispositif.creatorId
        ? {
            username: jsonDispositif.creatorId.username,
            picture: jsonDispositif.creatorId.picture,
            _id: jsonDispositif.creatorId._id,
          }
        : null,
    };
  });

interface Result {
  _id: ObjectId;
  department: string;
  region: string;
}
interface CorrespondingData {
  department: string;
  region: string;
}
const getRegion = (
  correspondingData: CorrespondingData[],
  department: string
) => {
  if (department === "All") return "France";
  return correspondingData.length > 0
    ? correspondingData[0].region
    : "No geoloc";
};

export const adaptDispositifDepartement = (dispositifs: IDispositif[]) => {
  const result: Result[] = [];

  dispositifs.map((dispositif) => {
    const selectZoneAction = dispositif.contenu[1].children.filter(
      (child: any) => child.title === "Zone d'action"
    );
    const departments =
      selectZoneAction.length > 0 && selectZoneAction[0].departments.length > 0
        ? selectZoneAction[0].departments
        : ["No geoloc"];

    departments.map((department: string) => {
      const correspondingData = departmentRegionCorrespondency.filter(
        (data) => data.department === department
      );

      const region = getRegion(correspondingData, department);

      return result.push({
        _id: dispositif._id,
        department,
        region,
      });
    });

    return;
  });

  return result;
};

export const getRegionFigures = (dispositifs: Result[]) => {
  const groupedDataByRegion = _.groupBy(dispositifs, "region");
  const groupedDataByDepartment = _.groupBy(dispositifs, "department");

  const regionArray = Object.keys(
    _.groupBy(departmentRegionCorrespondency, "region")
  );
  const regionArrayFull = regionArray.concat(["No geoloc", "France"]);
  return regionArrayFull.map((region) => {
    const correspondingData = departmentRegionCorrespondency.filter(
      (data) => data.region === region
    );
    let nbDepartmentsWithDispo = 0;
    correspondingData.map((data) => {
      if (Object.keys(groupedDataByDepartment).includes(data.department)) {
        nbDepartmentsWithDispo++;
      }
      return;
    });
    return {
      region,
      nbDispositifs: groupedDataByRegion[region]
        ? groupedDataByRegion[region].length
        : 0,
      nbDepartments: correspondingData.length,
      nbDepartmentsWithDispo,
    };
  });
};
