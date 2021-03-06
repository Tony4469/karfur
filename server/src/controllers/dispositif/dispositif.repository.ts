import { IDispositif, AudienceAge } from "../../types/interface";
import {
  Dispositif,
  DispositifPopulatedDoc,
} from "../../schema/schemaDispositif";
import { ObjectId } from "mongoose";

export const getDispositifsFromDB = async (
  needFields: Object
): Promise<IDispositif[]> =>
  await Dispositif.find({}, needFields).populate("mainSponsor creatorId");

export const getDispositifArray = async (query: any) => {
  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    abstract: 1,
    contenu: 1,
    tags: 1,
    created_at: 1,
    publishedAt: 1,
    typeContenu: 1,
    avancement: 1,
    status: 1,
    nbMots: 1,
    nbVues: 1,
  };

  return await Dispositif.find(query, neededFields).lean();
};

export const updateDispositifInDB = async (
  dispositifId: ObjectId,
  modifiedDispositif:
    | { mainSponsor: ObjectId; status: string }
    | { status: string; publishedAt: number }
    | { status: string }
    | {
        adminComments: string;
        adminProgressionStatus: string;
        adminPercentageProgressionStatus: string;
      }
    | { audienceAge: AudienceAge[] }
    | { audienceAge: AudienceAge[]; contenu: any }
    | { nbVues: number }
    | { draftReminderMailSentDate: number }
) =>
  await Dispositif.findOneAndUpdate({ _id: dispositifId }, modifiedDispositif);

export const getActiveDispositifsFromDBWithoutPopulate = async (
  needFields: Object
): Promise<IDispositif[]> =>
  await Dispositif.find(
    { status: "Actif", typeContenu: "dispositif" },
    needFields
  );

export const getAllContentsFromDB = async () =>
  await Dispositif.find(
    {},
    { audienceAge: 1, contenu: 1, typeContenu: 1, status: 1 }
  );

export const getAllDemarchesFromDB = async () =>
  await Dispositif.find({ typeContenu: "demarche" }, { _id: 1 });

export const removeAudienceAgeInDB = async (dispositifId: ObjectId) =>
  await Dispositif.update(
    { _id: dispositifId },
    { $unset: { audienceAge: "" } }
  );

export const removeVariantesInDB = async (dispositifId: ObjectId) =>
  await Dispositif.update({ _id: dispositifId }, { $unset: { variantes: "" } });

export const getDraftDispositifs = async (): Promise<
  DispositifPopulatedDoc[]
> =>
  // @ts-ignore populate creatorId
  await Dispositif.find(
    { status: "Brouillon" },
    {
      draftReminderMailSentDate: 1,
      creatorId: 1,
      updatedAt: 1,
      lastModificationDate: 1,
      titreInformatif: 1,
    }
  ).populate("creatorId");
