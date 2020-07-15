import { createStore, applyMiddleware, compose } from "redux";
import { appReducer } from "./rootReducer";
import { sagaMiddleware, middlewares } from "./middlewares";
import { rootSaga } from "./sagas";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";

export const history = createBrowserHistory();
const reactRouterMiddleware = routerMiddleware(history);

// @ts-ignore
middlewares.push(reactRouterMiddleware);

export const store = createStore(
  appReducer(history),
  compose(
    applyMiddleware(...middlewares),
    // @ts-ignore : TO DO type window
    (window.__REDUX_DEVTOOLS_EXTENSION__ &&
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__()) ||
      compose
  )
);

sagaMiddleware.run(rootSaga);