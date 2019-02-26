import React, { Component } from 'react';
import i18n from '../../i18n';
import { withNamespaces } from 'react-i18next';
////////A enlever si pas utilisé/////////////:
import {NotificationContainer, NotificationManager} from 'react-notifications';

import LanguageModal from '../../components/UI/LanguageModal/LanguageModal'
import './HomePage.css';


const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
}

class HomePage extends Component {
    state = {
        showModal: true
    }
    changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        this.setState({showModal:false})
    }
    createNotification = (type) => {
        return () => {
          switch (type) {
            case 'info':
              NotificationManager.info('Info message');
              break;
            case 'success':
              NotificationManager.success('Success message', 'Title here');
              break;
            case 'warning':
              NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
              break;
            case 'error':
              NotificationManager.error('Error message', 'Click me!', 5000, () => {
                alert('callback');
              });
              break;
            default:
              break;
          }
        };
    };

    render(){
        const {t} = this.props;
        const languages=[
            {
                name: 'Français',
                key: 'fr'
            },
            {
                name: 'English',
                key: 'en'
            },
            {
                name: 'العربية',
                key: 'ar'
            }
        ]
        return(
            <>
                {false && <LanguageModal show={this.state.showModal} changeFn={this.changeLanguage} languages={languages}/>}
                <section id="hero">
                    <div className="hero-container">
                    <h1>Bienvenue dans le projet Karfu'R</h1>
                    <h2>Vous pouvez naviguer sur le site ou créer un parcours personnalisé d'intégration</h2>
                    
                    <div className="input-group md-form form-sm form-2 pl-0">
                        <input className="form-control my-0 py-1 amber-border" type="text" placeholder="Chercher" aria-label="Chercher" />
                        <div className="input-group-append">
                            <span className="input-group-text amber lighten-3" id="basic-text1">
                            <i className="fa fa-search text-grey"
                                aria-hidden="true"></i></span>
                        </div>
                    </div>

                    <hr />
                    <p>ou</p>
                    <hr />

                    <a href="/base/welcome_parcours" className="btn-get-started">Créer un parcours personnalisé</a>
                    </div>
                </section>



                <div>
                    <button onClick={() => changeLanguage('fr')}>fr</button>
                    <button onClick={() => changeLanguage('en')}>en</button>
                    <button onClick={() => changeLanguage('ar')}>ar</button>
                    <h1>{this.props.t('Bienvenue')}</h1>
                </div>
                <div>Toolbar, SideDrawer and Backdrop</div>
                
                <div className="page-transition-animation">
                    <button className='btn btn-info'
                    onClick={this.createNotification('info')}>Info
                    </button>
                    <hr/>
                    <button className='btn btn-success'
                    onClick={this.createNotification('success')}>Success
                    </button>
                    <hr/>
                    <button className='btn btn-warning'
                    onClick={this.createNotification('warning')}>Warning
                    </button>
                    <hr/>
                    <button className='btn btn-danger'
                    onClick={this.createNotification('error')}>Error
                    </button>
            
                    <NotificationContainer/>
                </div>

                <div>{t('Elément principal')}</div>
                <div>{t('Elément secondaire')}</div>
                <div>{t('Troisième élément')}</div>
                <div>{t('Quatrième élément')}</div>
            </>
        );
    }
}

export default withNamespaces()(HomePage);