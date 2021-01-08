import { ObjectId } from "mongoose";
import { Moment } from "moment";
import { UserDoc } from "../schema/schemaUser";

export interface RequestFromClient<Query> {
  body?: {
    query: Query;
    sort: Record<string, any>;
    populate?: string;
    locale?: string;
  };
  fromSite: boolean;
  query?: Query;
  userId?: ObjectId;
  user?: UserDoc;
}

export interface Res {
  status: Function;
}
export interface Picture {
  imgId: string | null;
  public_id: string | null;
  secure_url: string | null;
}
export interface DetailedOpeningHours {
  day: string;
  from0?: string;
  to0?: string;
  from1?: string;
  to1?: string;
}
export interface OpeningHours {
  details: DetailedOpeningHours[];
  noPublic: boolean;
  precisions?: string;
}

export type IDispositif = any;

export interface Membre {
  userId: ObjectId;
  roles: string[];
}
export interface IStructure {
  _id: ObjectId;
  membres: Membre[];
  acronyme: string;
  administrateur: ObjectId;
  adresse: string;
  authorBelongs: boolean;
  contact: string;
  created_at: Moment;
  createur: ObjectId;
  dispositifsAssocies: ObjectId[];
  link: string;
  mail_contact: string;
  mail_generique: string;
  nom: string;
  phone_contact: string;
  siren: string;
  siret: string;
  status: string;
  updatedAt: Moment;
  picture: Picture;
  structureTypes: string[];
  websites: string[];
  facebook: string;
  linkedin: string;
  twitter: string;
  activities: string[];
  departments: string[];
  phonesPublic: string[];
  adressPublic: string;
  openingHours: OpeningHours;
  description: string;
  hasResponsibleSeenNotification?: boolean;
  toJSON?: () => IStructure;
}
