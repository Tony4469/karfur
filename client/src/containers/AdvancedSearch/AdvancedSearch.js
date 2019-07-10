import React, { Component, Suspense } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, CardBody, CardFooter, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import querySearch from "stringquery";
import Cookies from 'js-cookie';

import SearchItem from './SearchItem/SearchItem';
import API from '../../utils/API';
import {initial_data} from "./data"
import CustomCard from '../../components/UI/CustomCard/CustomCard';
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';

import './AdvancedSearch.scss';

import variables from 'scss/colors.scss';

const tris = [{name: "Alphabétique"}, {name:"Derniers ajouts"}, {name: "Les plus visités"}, {name: "À traduire"}];
const filtres = [{name: "Démarches"}, {name:"Dispositifs"}, {name: "Articles"}, {name: "Lexique"}, {name: "Annuaire"}];

let user={_id:null, cookies:{}};
class AdvancedSearch extends Component {
  state = {
    showSpinner: false,
    recherche: initial_data.map( x => ({...x, active: false})),
    dispositifs: [],
    pinned: [],
    activeFiltre: "Dispositifs",
    activeTri: "Alphabétique",
    data: [] //inutilisé, à remplacer par recherche quand les cookies sont stabilisés
  }

  componentDidMount (){
    this.retrieveCookies();
    let tag=querySearch(this.props.location.search).tag;
    if(tag) { this.selectTag(decodeURIComponent(tag)) } else { this.queryDispositifs() }
    window.scrollTo(0, 0);
  }

  queryDispositifs = (query=null) => {
    this.setState({ showSpinner: true })
    query = this.state.recherche.filter(x => x.active).map(x => ({[x.queryName]: x.query})).reduce((acc, curr) => ({...acc, ...curr}),{});
    // query={'tags.short':"Bénévolat"}
    console.log(query)
    API.get_dispositif({...query, status:'Actif'}).then(data_res => {
      let dispositifs=data_res.data.data
      this.setState({ dispositifs:dispositifs, showSpinner: false })
    }).catch(()=>this.setState({ showSpinner: false }))
  }
  
  selectTag = tag => {
    this.setState({tags: this.state.tags.map(x => (x.name===tag ? {...x, active: true} : {...x, active: false})), color: tag.color})
    this.queryDispositifs({tags: tag})
    this.props.history.replace("/dispositifs?tag="+tag)
  }
  
  retrieveCookies = () => {
    // Cookies.set('data', 'ici un test');
    let dataC=Cookies.getJSON('data');
    // if(dataC){ this.setState({data:data.map((x,key)=> {return {...x, value:dataC[key] || x.value}})})}
    let pinnedC=Cookies.getJSON('pinnedC');
    // if(pinnedC){ this.setState({pinned:pinnedC})}
    //data à changer en recherche après
    if(API.isAuth()){
      API.get_user_info().then(data_res => {
        let u=data_res.data.data;
        user={_id:u._id, cookies:u.cookies || {}}
        this.setState({
          pinned:user.cookies.parkourPinned || [],
          dispositifs:[...this.state.dispositifs].filter(x => !((user.cookies.parkourPinned || []).find( y=> y._id === x._id))),
          ...(user.cookies.parkourData && user.cookies.parkourData.length>0 && 
            {data:this.state.data.map((x,key)=> {return {...x, value: (user.cookies.parkourData[key] || x.value), query: (x.children.find(y=> y.name === (user.cookies.parkourData[key] || x.value)) || {}).query }})})
        })
      })
    }
  }

  pin = (e,dispositif) => {
    e.preventDefault();
    e.stopPropagation();
    dispositif.pinned=!dispositif.pinned;
    let prevState=[...this.state.dispositifs];
    console.log(this.state.dispositifs, this.state.pinned)
    console.log(dispositif.pinned)
    this.setState({
      dispositifs: dispositif.pinned ? prevState.filter(x => x._id !== dispositif._id) : [...prevState,dispositif],
      pinned: dispositif.pinned ? 
        [...this.state.pinned,dispositif] :
        this.state.pinned.filter(x=> x._id !== dispositif._id)
    },()=>{
      console.log(this.state.dispositifs, this.state.pinned)
      user.cookies.parkourPinned=this.state.pinned;
      API.set_user_info(user);
    })
  }

  goToDispositif = (dispositif={}, fromAutoSuggest=false) => {
    this.props.tracking.trackEvent({ action: 'click', label: 'goToDispositif' + (fromAutoSuggest ? ' - fromAutoSuggest' : ''), value : dispositif._id });
    this.props.history.push('/dispositif' + (dispositif._id ? ('/' + dispositif._id) : ''))
  }

  upcoming = () => Swal.fire( 'Oh non!', 'Cette fonctionnalité n\'est pas encore activée', 'error')

  selectParam = (key, subitem) => {
    let recherche = [...this.state.recherche];
    recherche[key]={
      ...recherche[key],
      value: subitem.name,
      query: subitem.query || subitem.name,
      active: true
    }
    this.setState({recherche: recherche}, ()=> this.queryDispositifs());
  }

  desactiver = key => this.setState({recherche: this.state.recherche.map((x, i) => i===key ? initial_data[i] : x)}, ()=> this.queryDispositifs());

  render() {
    const {recherche, dispositifs, pinned, showSpinner, activeFiltre, activeTri} = this.state;
    return (
      <div className="animated fadeIn advanced-search">
        <Row className="search-wrapper">
          <Col lg="2" className="mt-250 side-col">
            <EVAIcon name="options-2-outline" fill={variables.noir} className="mr-12" />
            <div className="right-side">
              <b>Trier par :</b> 
              <div className="mt-10 side-options">
                {tris.map((tri, idx) => (
                  <div 
                    key={idx} 
                    className={"side-option" + (tri.name === activeTri ? " active" : "")}
                    onClick={this.upcoming}
                  >
                    {tri.name}
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col lg="8" className="mt-250 central-col">
            <div className="search-bar">
              {recherche.map((d,i) => (
                <SearchItem 
                  key={i}
                  item={d}
                  keyValue={i}
                  selectParam = {this.selectParam}
                  desactiver={this.desactiver}
                />
              ))}
            </div>
            <div className="results-wrapper">
              <Row>
                {[...pinned,...dispositifs].slice(0,100).map((dispositif) => {
                  if(!dispositif.hidden){
                    return (
                      <Col xs="12" sm="6" md="3" className="card-col puff-in-center" key={dispositif._id}>
                        <CustomCard onClick={() => this.goToDispositif(dispositif)}>
                          <CardBody>
                            <EVAIcon 
                              name="bookmark" 
                              size="xlarge" 
                              onClick={(e)=>this.pin(e,dispositif)} 
                              fill={(dispositif.pinned ? variables.noir : variables.noirCD)} 
                              className={"bookmark-icon" + (dispositif.pinned ? " pinned":"")} 
                            />
                            <h5>{dispositif.titreInformatif}</h5>
                            <p>{dispositif.abstract}</p>
                          </CardBody>
                          <CardFooter className={"align-right bg-violet"}>{dispositif.titreMarque}</CardFooter>
                        </CustomCard>
                      </Col>
                    )
                  }else{
                    return false
                  }}
                )}
                <Col xs="12" sm="6" md="3">
                  <CustomCard addcard="true" onClick={this.goToDispositif}>
                    <CardBody>
                      {showSpinner ?
                        <Spinner color="success" /> : 
                        <span className="add-sign">+</span> }
                    </CardBody>
                    <CardFooter className="align-right bg-secondary text-white">
                      {showSpinner ? "Chargement..." : "Créer un nouveau dispositif"}
                    </CardFooter>
                  </CustomCard>
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg="2" className="mt-250 side-col">
            <EVAIcon name="funnel-outline" fill={variables.noir} className="mr-12" />
            <div className="right-side">
              <b>Filtrer par :</b> 
              <div className="mt-10 side-options">
                {filtres.map((filtre, idx) => (
                  <div 
                    key={idx} 
                    className={"side-option" + (filtre.name === activeFiltre ? " active" : "")}
                    onClick={this.upcoming}
                  >
                    {filtre.name}
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default track({
    page: 'AdvancedSearch',
  })(
    withTranslation()(AdvancedSearch)
  );

