import {
  FETCH_SELECTED_DISPOSITIF,
  SET_SELECTED_DISPOSITIF,
  UPDATE_UI_ARRAY,
  UPDATE_SELECTED_DISPOSITIF,
  DELETE_TAG,
  ADD_TAG,
} from "./selectedDispositif.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { Dispositif } from "../../types/interface";

export const fetchSelectedDispositifActionCreator = (value: {
  selectedDispositifId: string;
  locale: string;
}) => action(FETCH_SELECTED_DISPOSITIF, value);

export const setSelectedDispositifActionCreator = (value: Dispositif) =>
  action(SET_SELECTED_DISPOSITIF, value);

export const updateUiArrayActionCreator = (value: {
  subkey: number;
  key: number;
  node: string;
  value: boolean;
  updateOthers: boolean;
}) => action(UPDATE_UI_ARRAY, value);

export const updateSelectedDispositifActionCreator = (
  value: Partial<Dispositif>
) => action(UPDATE_SELECTED_DISPOSITIF, value);

export const deleteTagActionCreator = (value: number) =>
  action(DELETE_TAG, value);

export const addTagActionCreator = () => action(ADD_TAG);

const actions = {
  fetchSelectedDispositifActionCreator,
  setSelectedDispositifActionCreator,
  updateUiArrayActionCreator,
  updateSelectedDispositifActionCreator,
  deleteTagActionCreator,
};

export type SelectedDispositifActions = ActionType<typeof actions>;
