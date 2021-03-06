import Swal from "sweetalert2";
import API from "../../../utils/API";

const selectItem = function (suggestion) {
  this.setState({ selected: suggestion });
};

const editMember = function (member) {
  this.setState({ selected: member });
  this.toggleModal("editMember");
};

const addMember = function () {
  if (!this.state.selected || !this.state.structure) {
    Swal.fire({
      title: "Oh non!",
      text: "Certaines informations sont manquantes",
      type: "error",
      timer: 1500,
    });
    return;
  }
  const structure = {
    membreId: this.state.selected._id,
    structureId: this.state.structure._id,
    action: "create",
    role: "membre",
  };

  API.modifyUserRoleInStructure({ query: structure }).then(() => {
    this.initializeStructure();
    Swal.fire({
      title: "Yay...",
      text: "Votre nouveau membre a bien été ajouté, merci",
      type: "success",
      timer: 1500,
    });
    this.toggleModal("addMember");
  });
};

export { selectItem, editMember, addMember };
