import React, { Component, Suspense }  from 'react';
import i18n from '../../i18n';
import { withTranslation } from 'react-i18next';
import { Redirect, Route, Switch } from 'react-router-dom';
import DirectionProvider, { DIRECTIONS } from 'react-with-direction/dist/DirectionProvider';
import track from 'react-tracking';
import { AppAside, AppFooter } from '@coreui/react';
import { connect } from 'react-redux';

import API from '../../utils/API';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import Footer from '../../components/Navigation/Footer/Footer';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import OnBoardingTraducteurModal from '../../components/Modals/OnBoardingTradModal/OnBoardingTraducteurModal'
import RightSideDrawer from '../../components/Navigation/SideDrawer/RightSideDrawer/RightSideDrawer'

import './Layout.scss';
import routes from '../../routes';

let audio = new Audio();
class Layout extends Component {
  state = {
    showSideDrawer: {left:false,right:false},
    traducteur:false,
    showOnBoardingTraducteurModal:false,
  }
  
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  sideDrawerClosedHandler = (dir) => {
    this.setState( { showSideDrawer: {...this.state.showSideDrawer, [dir]:false} } );
  }

  sideDrawerToggleHandler = (dir) => {
    this.setState( ( prevState ) => {
      return { showSideDrawer: {...this.state.showSideDrawer, [dir]:!prevState.showSideDrawer[dir]} };
    } );
  }

  devenirTraducteur = () => {
    this.setState({showOnBoardingTraducteurModal:true})
  }

  closeOnBoardingTraducteurModal = () => {
    this.setState({showOnBoardingTraducteurModal:false})
  }
  
  readAudio = (text, locale='fr-fr') => {
    API.get_audio({text:text, locale:locale}).then(data_res => {

      audio.pause();
      
      try{
        var len = data_res.data.length;
        var buf = new ArrayBuffer(len);
        var view = new Uint8Array(buf);
        for (var i = 0; i < len+10; i++) {
          view[i] = data_res.data.charCodeAt(i) & 0xff;
        }
        var blob = new Blob([view], {type: "audio/wav"});
        var url = window.URL.createObjectURL(blob)
        audio.src = url;
        audio.load();
        audio.play();
      }catch(e){
        console.log(e)
        console.log(data_res.data)
        console.log(url)
      }

      // try{
      //   var wave = new Audio('data:audio/wav;base64,' + btoa(unescape(data_res.data)));
      //   wave.controls = true;
      //   wave.play()
      // }catch(e){
      //   console.log(e)
      //   console.log(data_res.data)
      //   console.log(text)
      // }
    },function(error){console.log(error);return;})
  }

  toggleHover = (e) => {
    if(this.props.ttsActive){
      if(e.target && e.target.firstChild && e.target.firstChild.nodeValue){
        console.log(e.target.firstChild.nodeValue)
        this.readAudio(e.target.firstChild.nodeValue)
      }
    }
  }

  render() {
    return (
      <DirectionProvider 
        direction={i18n.language==="ar" ? DIRECTIONS.RTL : DIRECTIONS.LTR}>
        <div onMouseOver={this.toggleHover}>
          <Suspense  fallback={this.loading()}>
            <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
          </Suspense>
          <div className="app-body">
            <SideDrawer
              side='left'
              open={this.state.showSideDrawer.left}
              closed={()=>this.sideDrawerClosedHandler('left')} />

            <main className="Content">
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
                        render={props => (
                        <route.component 
                          socket = { this.props.socket } 
                          socketFn = { this.props.socketFn }
                          {...props} />
                        )} />
                      ) : (null);
                    })}
                    <Redirect from="/" to="/homepage" />
                  </Switch>
                </>
            </main>

            <AppAside fixed>
              <Suspense fallback={this.loading()}>
                <RightSideDrawer />
              </Suspense>
            </AppAside>
          </div>
          <AppFooter>
            <Suspense fallback={this.loading()}>
              <Footer devenirTraducteur={this.devenirTraducteur} />
            </Suspense>
          </AppFooter>
          <OnBoardingTraducteurModal 
            show={this.state.showOnBoardingTraducteurModal}
            closeOnBoardingTraducteurModal={this.closeOnBoardingTraducteurModal} />
        </div>
      </DirectionProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ttsActive: state.tts.ttsActive
  }
}

export default track({
        layout: 'Layout',
    }, { dispatchOnMount: true })(
      connect(mapStateToProps)(
        withTranslation()(Layout)
      )
    );