import { action, ActionType } from "typesafe-actions";

export enum LoadingStatusKey {
  FETCH_SELECTED_DISPOSITIF = "FETCH_SELECTED_DISPOSITIF",
  FETCH_USER_STRUCTURE = "FETCH_USER_STRUCTURE",
  FETCH_USER = "FETCH_USER",
  FETCH_LANGUES = "FETCH_LANGUES",
  FETCH_STRUCTURES = "FETCH_STRUCTURES",
  FETCH_SELECTED_STRUCTURE = "FETCH_SELECTED_STRUCTURE",
  FETCH_ACTIVE_DISPOSITIFS = "FETCH_ACTIVE_DISPOSITIFS",
  FETCH_ALL_DISPOSITIFS = "FETCH_ALL_DISPOSITIFS",
  FETCH_ALL_STRUCTURES = "FETCH_ALL_STRUCTURES",
  FETCH_ALL_USERS = "FETCH_ALL_USERS",
}

export const startLoading = (key: LoadingStatusKey) =>
  action("LOADING_START", { key });
export const finishLoading = (key: LoadingStatusKey) =>
  action("LOADING_END", { key });
export const setError = (key: LoadingStatusKey, error: string) =>
  action("LOADING_ERROR", { key, error });

const actions = {
  startLoading,
  finishLoading,
  setError,
};

export type LoadingStatusActions = ActionType<typeof actions>;
