import { RequestFromClient, Res } from "../../types/interface";
import User from "../../schema/schemaUser";
import logger from "../../logger";

export const getFiguresOnUsers = async (
  req: RequestFromClient | {},
  res: Res
) => {
  try {
    const users = await User.find({ status: "Actif" }, { roles: 1 }).populate(
      "roles"
    );
    const nbContributors = users.filter((x: any) =>
      (x.roles || []).some((y: any) => y && y.nom === "Contrib")
    ).length;
    const nbTraductors = users.filter((x: any) =>
      (x.roles || []).some(
        (y: any) => y.nom === "Trad" || y.nom === "ExpertTrad"
      )
    ).length;
    const nbExperts = users.filter((x: any) =>
      (x.roles || []).some((y: any) => y.nom === "ExpertTrad")
    ).length;

    res.status(200).json({
      data: {
        nbContributors,
        nbTraductors,
        nbExperts,
      },
    });
  } catch (error) {
    logger.error("[getFiguresOnUsers] error while getting users", { error });
    res.status(200).json({
      data: {
        nbContributors: 0,
        nbTraductors: 0,
        nbExperts: 0,
      },
    });
  }
};
