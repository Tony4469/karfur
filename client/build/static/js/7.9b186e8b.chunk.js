(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{1458:function(e,t,a){e.exports={lightColor:"#F2F2F2",darkColor:"#212121",cardColor:"#828282",blanc:"#FBFBFB",rouge:"#E55039",vert:"#2CA12A",noir:"#212121",gris:"#F2F2F2",violet:"#583F93",focus:"#2D9CDB",grisFonce:"#828282",noirCD:"#CDCDCD",blancSimple:"#FFFFFF",jauneClair:"#FFF7AE",attention:"#F9EF99",validation:"#DEF6C2",validationHover:"#4CAF50",error:"#F44336",erreur:"#FFCECB",uiattention:"#FFEB3B",standby:"#FDD497",orange:"#FF9800"}},1462:function(e,t,a){"use strict";a.r(t);var n=a(16),s=a(11),r=a(15),o=a(13),i=a(12),l=a(14),c=a(0),p=a.n(c),d=a(23),u=a.n(d),m=a(1405),g=a(1414),w=a(1421),h=a(1406),f=a(21),v=a.n(f),b=a(225),F=a(31),E=a(20),C=a(24),y=a.n(C),k=a(159),N=a.n(k),_=a(8),L=a(229),O=a(9),x=a(125),D=a(61),P=a(37),j=(a(1458),a(4)),R=a.n(j),S=function(e){function t(){var e,a;Object(s.a)(this,t);for(var r=arguments.length,l=new Array(r),c=0;c<r;c++)l[c]=arguments[c];return(a=Object(o.a)(this,(e=Object(i.a)(t)).call.apply(e,[this].concat(l)))).state={newPassword:"",cpassword:"",isLoading:!0,isError:!1,user:null,reset_password_token:""},a.togglePasswordVisibility=function(){return a.setState(function(e){return{passwordVisible:!e.passwordVisible}})},a.send=function(e){if(e.preventDefault(),0===a.state.newPassword.length)return v.a.fire({title:"Oops...",text:"Aucun mot de passe n'est renseign\xe9 !",type:"error",timer:1500});if(a.state.newPassword!==a.state.cpassword)return v.a.fire({title:"Oops...",text:"Les mots de passes ne correspondent pas !",type:"error",timer:1500});if((N()(a.state.newPassword)||{}).score<1)return v.a.fire({title:"Oops...",text:"Le mot de passe est trop faible",type:"error",timer:1500});var t={newPassword:a.state.newPassword,cpassword:a.state.cpassword,reset_password_token:a.state.reset_password_token};_.a.set_new_password(t).then(function(e){v.a.fire({title:"Yay...",text:"Modification du mot de passe r\xe9ussie !",type:"success",timer:1500}).then(function(){a.props.history.push("/")}),localStorage.setItem("token",e.data.token),Object(L.a)(e.data.token),a.props.fetch_user()}).catch(function(e){return console.log(e.response)})},a.handleChange=function(e){return a.setState(Object(n.a)({},e.target.id,e.target.value))},a.upcoming=function(){return v.a.fire({title:"Oh non!",text:"Cette fonctionnalit\xe9 n'est pas encore disponible",type:"error",timer:1500})},a}return Object(l.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=y.a.get(this.props,"match.params.id");if(!t)return this.setState({isLoading:!1,isError:!0});_.a.get_users({query:{reset_password_token:t,reset_password_expires:{$gt:Date.now()}}}).then(function(a){var n=a.data.data;n&&1===n.length?e.setState({isLoading:!1,user:n[0],reset_password_token:t}):e.setState({isLoading:!1,isError:!0})}).catch(function(t){console.log(t),e.setState({isLoading:!1,isError:!0})})}},{key:"render",value:function(){var e=this.state,t=e.passwordVisible,a=e.newPassword,n=e.cpassword,s=e.isLoading,r=e.isError,o=this.props.t;if(s)return p.a.createElement("div",{className:"loading-access"},p.a.createElement("h3",null,o("Login.Chargement des donn\xe9es utilisateur","Chargement des donn\xe9es utilisateur"),"..."));if(r)return p.a.createElement("div",{className:"loading-access"},p.a.createElement("h5",null,o("Login.Probl\xe8me mdp","Un probl\xe8me est survenu au moment de r\xe9initialiser le mot de passe. Merci d'essayer \xe0 nouveau"),"..."),p.a.createElement(O.a,{tag:b.a,to:"/login",fill:R.a.noir,name:"arrow-back-outline"},o("Login.Revenir \xe0 la page de connexion","Revenir \xe0 la page de connexion")));var i=a&&N()(a);return p.a.createElement("div",{className:"app flex-row align-items-center reset"},p.a.createElement("div",{className:"login-wrapper"},p.a.createElement(m.a,{className:"card-login main-card"},p.a.createElement(g.a,null,p.a.createElement(w.a,{onSubmit:this.send},p.a.createElement("h5",null,o("Login.R\xe9initialisez votre mot de passe","R\xe9initialisez votre mot de passe")),p.a.createElement("div",{className:"texte-small mb-12"},o("Login.Renseignez ici le nouveau mot de passe souhait\xe9","Renseignez ici le nouveau mot de passe souhait\xe9")),p.a.createElement(x.a,{prepend:!0,append:!0,autoFocus:!0,prependName:"lock-outline",appendName:t?"eye-off-2-outline":"eye-outline",type:t?"text":"password",inputClassName:"password-input",onAppendClick:this.togglePasswordVisibility,id:"newPassword",placeholder:o("Login.Nouveau mot de passe","Nouveau mot de passe"),autoComplete:"new-password",value:a,onChange:this.handleChange}),a&&i&&p.a.createElement("div",{className:"score-wrapper mb-10"},p.a.createElement("span",{className:"mr-10"},o("Login.Force","Force")," :"),p.a.createElement(h.a,{color:Object(P.a)(i.score/4),value:100*(.1+i.score/4)/1.1})),p.a.createElement(x.a,{prepend:!0,append:!0,prependName:"lock-outline",appendName:t?"eye-off-2-outline":"eye-outline",inputClassName:"password-input",type:t?"text":"password",onAppendClick:this.togglePasswordVisibility,id:"cpassword",placeholder:o("Login.Confirmez le nouveau mot de passe","Confirmez le nouveau mot de passe"),autoComplete:"cpassword",value:n,onChange:this.handleChange}),p.a.createElement("div",{className:"footer-buttons"},p.a.createElement(O.a,{type:"dark",name:"log-in",color:"dark",className:"connect-btn",disabled:!a},o("Valider","Valider")))))),p.a.createElement(b.a,{to:"/"},p.a.createElement(O.a,{type:"outline",name:"corner-up-left-outline",className:"retour-btn"},o("Login.Retour \xe0 l'accueil","Retour \xe0 l'accueil")))))}}]),t}(c.Component),A={fetch_user:D.fetch_user};t.default=u()({page:"Reset"},{dispatchOnMount:!0})(Object(F.b)(null,A)(Object(E.b)()(S)))}}]);
//# sourceMappingURL=7.9b186e8b.chunk.js.map