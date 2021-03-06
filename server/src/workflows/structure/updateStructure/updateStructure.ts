import { Res, RequestFromClient } from "../../../types/interface";
import { StructureDoc } from "../../../schema/schemaStructure";
import logger from "../../../logger";
import { updateStructureInDB } from "../../../modules/structure/structure.repository";
import { checkIfUserIsAuthorizedToModifyStructure } from "../../../modules/structure/structure.service";

// route called when modify structure but not its members (use another route for this)
export const updateStructure = async (
  req: RequestFromClient<StructureDoc>,
  res: Res
) => {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body || !req.body.query) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    try {
      const structure = req.body.query;

      logger.info("[updateStructure] try to modify structure with id", {
        id: structure._id,
      });

      await checkIfUserIsAuthorizedToModifyStructure(
        structure._id,
        req.userId,
        // @ts-ignore : populate roles
        req.user.roles
      );

      logger.info("[modifyStructure] updating stucture", {
        structureId: structure._id,
      });
      const updatedStructure = await updateStructureInDB(
        structure._id,
        structure
      );

      logger.info("[modifyStructure] successfully modified structure with id", {
        id: structure._id,
      });
      return res.status(200).json({
        text: "Succès",
        data: updatedStructure,
      });
    } catch (error) {
      logger.error("[modifyStructure] error", {
        error,
      });
      switch (error.message) {
        case "NO_STRUCTURE_WITH_THIS_ID":
          return res.status(402).json({ text: "Id non valide" });
        case "USER_NOT_AUTHORIZED":
          res.status(401).json({ text: "Token invalide" });
          return;
        default:
          return res.status(400).json({ text: "Erreur interne" });
      }
    }
  }
};
