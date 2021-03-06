import { SagaIterator } from "redux-saga";
import { takeLatest, call, put, select } from "redux-saga/effects";
import API from "../../utils/API";
import { logger } from "../../logger";
import {
  fetchSelectedDispositifActionCreator,
  setSelectedDispositifActionCreator,
} from "./selectedDispositif.actions";
import { FETCH_SELECTED_DISPOSITIF } from "./selectedDispositif.actionTypes";
import { push } from "connected-react-router";
import { userSelector } from "../User/user.selectors";
import _ from "lodash";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";

export function* fetchSelectedDispositif(
  action: ReturnType<typeof fetchSelectedDispositifActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_SELECTED_DISPOSITIF));
    const { selectedDispositifId, locale } = action.payload;
    logger.info(
      "[fetchSelectedDispositif] start fetching selected dispositif",
      { id: selectedDispositifId }
    );
    if (selectedDispositifId) {
      const data = yield call(API.get_dispositif, {
        query: { _id: selectedDispositifId },
        sort: {},
        populate: "creatorId mainSponsor participants",
        locale,
      });

      const dispositif = data.data.data[0];
      yield put(setSelectedDispositifActionCreator(dispositif));
      if (!dispositif || !dispositif._id) {
        yield put(push("/"));
      }

      const user = yield select(userSelector);

      if (
        dispositif.status !== "Actif" &&
        !user.admin &&
        !user.user.contributions.includes(dispositif._id) &&
        !user.user.structures.includes(dispositif.mainSponsor._id)
      ) {
        if (_.isEmpty(user)) {
          yield put(push("/login"));
        }
        yield put(push("/"));
      }
    }

    yield put(finishLoading(LoadingStatusKey.FETCH_SELECTED_DISPOSITIF));
  } catch (error) {
    logger.error("Error while fetching selected dispositif", {
      dispositifId: action.payload.selectedDispositifId,
      locale: action.payload.locale,
      error,
    });
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_SELECTED_DISPOSITIF, fetchSelectedDispositif);
}

export default latestActionsSaga;
