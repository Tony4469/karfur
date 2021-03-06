import { Dispositif } from "../../types/interface";
import { createReducer } from "typesafe-actions";
import { ActiveDispositifsActions } from "./activeDispositifs.actions";

export type ActiveDispositifsState = Dispositif[];

const initialActiveDispositifsState: ActiveDispositifsState = [];

export const activeDispositifsReducer = createReducer<
  ActiveDispositifsState,
  ActiveDispositifsActions
>(initialActiveDispositifsState, {
  SET_ACTIVE_DISPOSITIFS: (_, action) => action.payload,
});
