import React, { Component } from 'react';
import track from 'react-tracking';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import AnchorLink from 'react-anchor-link-smooth-scroll';

import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';
import FButton from '../../components/FigmaUI/FButton/FButton';
import {equipe, diair, DGEF} from '../../assets/figma/index';
import {membres} from './data'

import './QuiSommesNous.scss';
import variables from 'scss/colors.scss';

class QuiSommesNous extends Component {
  state={
    sideVisible:false,
    membre: {}
  }

  componentDidMount(){
    window.scrollTo(0, 0);
  }
  
  _onSelectMembre = membre => this.setState({sideVisible: true, membre: membre})
  _closeSide = () => this.setState({sideVisible: false})

  render() {
    const {membre, sideVisible} = this.state;
    const {t} = this.props;
    return (
      <div className="animated fadeIn qui-sommes-nous texte-small">
        <section id="hero">
          <div className="hero-container">
            <h1>{t("QuiSommesNous.Qui sommes-nous", "Qui sommes-nous ?")}</h1>
            <h4>{t("QuiSommesNous.subheader", "Réfugiés.info est une plateforme numérique dédiée à faciliter les parcours d’intégration des réfugiés en France")}.</h4>
          </div>
          <AnchorLink href="#missions" className="arrowhead-icon header-anchor d-inline-flex justify-content-center align-items-center">
            <EVAIcon className="slide-bottom" name="arrowhead-down-outline" size="xlarge" fill={variables.noir} />
          </AnchorLink>
        </section>

        <section id="missions">
          <div className="section-container">
            <h2>{t("QuiSommesNous.Missions", "Missions")}</h2>

            <Row className="card-row">
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>{t("QuiSommesNous.Mission_1_header", "Créer des parcours personnalisés d’intégration")}</CardHeader>
                  <CardBody>
                    <span>{t("QuiSommesNous.Mission_1_subheader", "Obtenir l’asile, c’est surtout reconstruire. Un chez soi, un réseau, une vocation. Le déracinement a souvent brouillé les repères, les ambitions, les objectifs. Agi’r propose un outil structurant l’action et permettant aux réfugiés d’atteindre plus vite et plus sereinement ses objectifs de vie")}.</span>
                  </CardBody>
                  <CardFooter>
                    <span>{t("Bientôt disponible", "Bientôt disponible")}</span>
                    {/*<FButton type="outline-black">
                      Créer mon parcours
                    </FButton>*/}
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>{t("QuiSommesNous.Mission_2_header", "Vulgariser et traduire les démarches administratives")}</CardHeader>
                  <CardBody>
                    <span>{t("QuiSommesNous.Mission_2_subheader", "Dès la protection obtenue, les personnes réfugiées entre dans le droit commun et bénéficie des mêmes droits sociaux que tous les français. Cette situation engendre de nombreuses démarches administratives. Agi’r produit des fiches pratiques pour vulgariser ces démarches et les propose dans plus de 10 langues")}.</span>
                  </CardBody>
                  <CardFooter>
                    {/*<FButton type="outline-black">
                      Chercher une démarche
                  </FButton>*/}
                    <span>{t("Bientôt disponible", "Bientôt disponible")}</span>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>{t("QuiSommesNous.Mission_3_header", "Recenser les initiatives sur tout le territoire")}</CardHeader>
                  <CardBody>
                    <span>{t("QuiSommesNous.Mission_3_subheader", "Des milliers de personnes s’engagent au quotidien en France pour accueillir et accompagner les personnes réfugiées. Leurs actions, humbles et ambitieuses, souffrent parfois d’un manque de visibilité et ne profitent pas au plus grand nombre. Agi’r souhaite recenser et rendre accessible ces milliers d’initative")}.</span>
                  </CardBody>
                  <CardFooter>
                    <FButton tag={NavLink} to="/advanced-search" type="outline-black">
                      {t("Chercher un dispositif", "Chercher un dispositif")}
                    </FButton>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        <section id="equipe">
          <div className="section-container">
            <h2>{t("QuiSommesNous.Équipe", "Équipe")}</h2>
            <Row className="membres-row">
              {membres.map((membre, key) => (
                <Col className="cursor-pointer" key={key} onClick={()=>this._onSelectMembre(membre)}>
                  {membre.firstName}
                </Col>
              ))}
            </Row>
          </div>  
          <div className="team-wrapper">  
            <img className="team-picture" src={equipe} onClick={this._closeSide} alt="équipe" />
            {sideVisible && 
              <div className="description">
                <div className="team-header">
                  <h3>{membre.name}</h3>
                  <span>{membre.statut && t("QuiSommesNous." + membre.statut, membre.statut)}</span>
                </div>
                <div className="team-body">
                  <h5>{t("QuiSommesNous.Mon engagement", "Mon engagement")}</h5>
                  <span>{membre.engagement && t("QuiSommesNous." + membre.engagement, membre.engagement)}</span>
                  <h5>{t("QuiSommesNous.Mon rôle", "Mon rôle")}</h5>
                  <span>{membre.role && t("QuiSommesNous." + membre.role, membre.role)}</span>
                  <h5>{t("QuiSommesNous.Mes outils", "Mes outils")}</h5>
                  <span>{membre.outils && t("QuiSommesNous." + membre.outils, membre.outils)}</span>
                </div>
                <div className="team-footer">
                  <a href={membre.linkedin} className="no-decoration">
                    <FButton type="outline" name="link-2-outline">
                      Linkedin
                    </FButton>
                  </a>
                </div>
                <EVAIcon onClick={this._closeSide} name="close-outline" className="close-btn" />
              </div> }
          </div>
        </section>

        <section id="problematique">
          <div className="section-container">
            <h2>{t("QuiSommesNous.Problématique", "Problématique")}</h2>

            <Row className="card-row">
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>{t("QuiSommesNous.problem_1_header", "Migrant, réfugié, demandeur d’asile, clandestins")}</CardHeader>
                  <CardBody>
                    <span>{t("QuiSommesNous.problem_1_subheader", "Mieux comprendre c'est déjà mieux accueillir. Migrant, demandeur d'asile ou réfugié ne désignent pas les mêmes réalités. Agi'r s'adresse plus particulièrement aux réfugiés, c'est-à-dire aux personnes à qui la France accorde une protection internationale car leur vie est menacée")}.</span>
                  </CardBody>
                  {/* <CardFooter>
                    <FButton type="outline-black">
                      En savoir plus
                    </FButton>
                  </CardFooter> */}
                </Card>
              </Col>
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>{t("QuiSommesNous.problem_2_header", "Une information cryptée, dispersée et périssable")}</CardHeader>
                  <CardBody>
                    <span>{t("QuiSommesNous.problem_2_subheader", "L’évolution rapide de la législation, le foisonnement de l’offre associative et la complexité de certaines démarches administrative rendent difficile la compréhension des droits et devoirs. Agi’r centralise une information fiable, à jour et vulgarisée")}.</span>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>{t("QuiSommesNous.problem_3_header", "Un accompagnement en pointillé qui morcèle la confiance")}</CardHeader>
                  <CardBody>
                    <span>{t("QuiSommesNous.problem_3_subheader", "Les personnes réfugiées sont parfois confrontées à la discontinuité de leur accompagnement. À chaque nouvel interlocuteurs, il est nécessaire de reprendre de zéro. Pièces administratives, récits de migration, objectifs de vie... autant d’élements qu’Agi’r souhaite à terme dématérialiser afin de réduire l’impact de la mobilité")}.</span>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        <section id="approche">
          <div className="section-container">
            <h2>{t("QuiSommesNous.Approche contributive", "Approche contributive")}</h2>

            <Row className="card-row">
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>{t("QuiSommesNous.contributive_1_header", "Vers un État plus ouvert")}</CardHeader>
                  <CardBody>
                    <span>{t("QuiSommesNous.contributive_1_subheader", "Les valeurs d’ouverture et de transparence sont au coeur du projet Agi’r : le code source du site est entièrement disponible. Un réseau ouvert participe à la conception et conseille l’équipe du projet sur les besoins et les fonctionnalités à développer")}.</span>
                  </CardBody>
                  <CardFooter>
                    <a href="https://github.com/Tony4469/karfur" className="no-decoration" target="_blank">
                      <FButton type="outline-black">
                        {t("QuiSommesNous.Voir le code source", "Voir le code source")}
                      </FButton>
                    </a>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>{t("QuiSommesNous.contributive_2_header", "Le terrain aux commandes")}</CardHeader>
                  <CardBody>
                    <span>{t("QuiSommesNous.contributive_2_subheader", "Seuls les écosystèmes d’acteurs locaux sont capables de recenser efficacement les actions et de nourrir une base de connaissance. Ainsi Agi’r permet à chaque territoire de recenser et de valoriser ses initiatives. Agi’r donne un cadre technique et ergonomique pour favoriser la rencontre et l’échange de bonnes pratiques au niveau local")}.</span>
                  </CardBody>
                  <CardFooter>
                    <FButton tag={"a"} href="https://agi-r.mn.co" target="_blank" type="outline-black">
                      {t("Rejoindre le réseau", "Rejoindre le réseau")}
                    </FButton>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>{t("QuiSommesNous.contributive_3_header", "Favoriser le micro-engagement")}</CardHeader>
                  <CardBody>
                    <span>{t("QuiSommesNous.contributive_3_subheader", "En donnant à chacun la possibilité d’être facilement acteur et contributeur de la plateforme, à l’instar de Wikipédia, Agi’r favorise de nouvelles formes de micro-engagement permettant à de nouveaux publics de s’engager pour une cause de solidarité, en faveur des réfugiés")}.</span>
                  </CardBody>
                  <CardFooter>
                    <FButton tag={NavLink} to="/backend/user-profile" type="outline-black">
                      {t("Contribuer", "Contribuer")}
                    </FButton>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </div>
        </section>


        {/*<section id="partenaires">
          <div className="section-container">
            <h2>Partenaires</h2>

            <h3>Institutionnels</h3>
            <Row className="partner-row">
              <Col lg="2"/>
              <Col lg="3" className="partner-col d-flex justify-content-center">
                <img className="partner-img" src={diair} alt="logo DIAIR" />
              </Col>
              <Col lg="1"/>
              <Col lg="4" className="partner-col">
                La Diair est à l’origine de la création du projet et héberge actuellement l’équipe projet. 
              </Col>
            </Row>
            {/* <Row className="partner-row">
              <Col lg="2"/>
              <Col lg="3" className="partner-col d-flex justify-content-center">
                <img className="partner-img" src={DGEF} alt="logo DGEF" />
              </Col>
              <Col lg="1"/>
              <Col lg="4" className="partner-col">
                La Diair est à l’origine de la création du projet et héberge actuellement l’équipe projet. 
              </Col>
            </Row>
            <h3>Associatifs</h3>
          </div>
        </section>*/}
      </div>
    );
  }
}

export default track({
  page: 'QuiSommesNous',
})(withTranslation()(QuiSommesNous));