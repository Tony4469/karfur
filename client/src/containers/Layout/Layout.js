import React, { Component, Suspense } from "react";
import i18n from "../../i18n";
import { withTranslation } from "react-i18next";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import DirectionProvider, {
  DIRECTIONS,
} from "react-with-direction/dist/DirectionProvider";
// import { AppAside, AppFooter } from '@coreui/react';
import { connect } from "react-redux";
import Cookies from "js-cookie";

import Toolbar from "../Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import { fetchDispositifsActionCreator } from "../../services/Dispositif/dispositif.actions";
import {
  fetchLanguesActionCreator,
  toggleLangueModalActionCreator,
  toggleLangueActionCreator,
} from "../../services/Langue/langue.actions";
import { fetchStructuresActionCreator } from "../../services/Structure/structure.actions";
import { fetchUserActionCreator } from "../../services/User/user.actions";
import LanguageModal from "../../components/Modals/LanguageModal/LanguageModal";
import { readAudio } from "./functions";
import routes from "../../routes";
import Footer from "../Footer/Footer";
import { toggleSpinner } from "../../services/Tts/tts.actions";

import "./Layout.scss";
import { LoadingStatusKey } from "../../services/LoadingStatus/loadingStatus.actions";

export class Layout extends Component {
  constructor(props) {
    super(props);
    this.readAudio = readAudio.bind(this);
  }

  state = {
    showSideDrawer: { left: false, right: false },
    traducteur: false,
  };
  audio = new Audio();

  componentDidMount() {
    this.props.fetchUser();
    this.props.fetchStructures();
    this.props.fetchDispositifs();
    this.props.fetchLangues();
    let languei18nCode = Cookies.get("languei18nCode");
    if (languei18nCode && languei18nCode !== "fr") {
      this.changeLanguage(languei18nCode);
    } else if (!languei18nCode) {
      this.props.toggleLangueModal();
    }

    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.ttsActive !== this.props.ttsActive && !this.props.ttsActive) {
      this.forceStopAudio();
    }
    if (this.props.location.pathname !== prevProps.location.pathname) {
      routes.map((item) => {
        if (item.path === this.props.location.pathname) {
          document.title = item.name;
        }
      });
    }
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (nextProps.ttsActive !== this.props.ttsActive && !nextProps.ttsActive) {
      this.forceStopAudio();
    }
  }

  forceStopAudio = () => {
    this.audio.pause();
    this.audio.currentTime = 0;
  };
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  sideDrawerClosedHandler = (dir) => {
    this.setState({
      showSideDrawer: { ...this.state.showSideDrawer, [dir]: false },
    });
  };

  sideDrawerToggleHandler = (dir) => {
    this.setState((prevState) => {
      return {
        showSideDrawer: {
          ...this.state.showSideDrawer,
          [dir]: !prevState.showSideDrawer[dir],
        },
      };
    });
  };

  changeLanguage = (lng) => {
    this.props.toggleLangue(lng);
    if (this.props.i18n.getResourceBundle(lng, "translation")) {
      this.props.i18n.changeLanguage(lng);
    } else {
      // eslint-disable-next-line no-console
      console.log("Resource not found in i18next.");
    }
    if (this.props.showLangModal) {
      this.props.toggleLangueModal();
    }
  };

  toggleHover = (e) => {
    if (this.props.ttsActive) {
      if (e.target && e.target.firstChild && e.target.firstChild.nodeValue) {
        this.readAudio(e.target.firstChild.nodeValue, i18n.language);
      } else {
        this.forceStopAudio();
      }
    }
  };

  render() {
    const isRTL = ["ar", "ps", "fa"].includes(i18n.language);

    return (
      <DirectionProvider direction={isRTL ? DIRECTIONS.RTL : DIRECTIONS.LTR}>
        <div onMouseOver={this.toggleHover}>
          <Suspense fallback={this.loading()}>
            <Toolbar
              {...this.props}
              drawerToggleClicked={this.sideDrawerToggleHandler}
            />
          </Suspense>
          <div className={"app-body"}>
            <SideDrawer
              side="left"
              open={this.state.showSideDrawer.left}
              closed={() => this.sideDrawerClosedHandler("left")}
            />

            <main
              className={
                "Content" +
                (this.props.location &&
                this.props.location.pathname.includes("/advanced-search")
                  ? " advanced-search"
                  : "")
              }
            >
              {this.props.children}
              <>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={(props) => (
                          <route.component
                            socket={this.props.socket}
                            socketFn={this.props.socketFn}
                            {...props}
                          />
                        )}
                      />
                    ) : null;
                  })}
                  <Redirect from="/" to="/homepage" />
                </Switch>
              </>
            </main>
          </div>

          <Footer />

          <LanguageModal
            show={this.props.showLangModal}
            current_language={i18n.language}
            toggle={this.props.toggleLangueModal}
            changeLanguage={this.changeLanguage}
            langues={this.props.langues}
            isLanguagesLoading={this.props.isLanguagesLoading}
          />
        </div>
      </DirectionProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ttsActive: state.tts.ttsActive,
    languei18nCode: state.langue.languei18nCode,
    showLangModal: state.langue.showLangModal,
    langues: state.langue.langues,
    dispositifs: state.dispositif.dispositifs,
    isLanguagesLoading:
      state.loadingStatus[LoadingStatusKey.FETCH_LANGUES] &&
      state.loadingStatus[LoadingStatusKey.FETCH_LANGUES].isLoading,
  };
};

const mapDispatchToProps = {
  fetchStructures: fetchStructuresActionCreator,
  fetchLangues: fetchLanguesActionCreator,
  fetchDispositifs: fetchDispositifsActionCreator,
  fetchUser: fetchUserActionCreator,
  toggleLangueModal: toggleLangueModalActionCreator,
  toggleLangue: toggleLangueActionCreator,
  toggleSpinner,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(Layout)));
