// @ts-nocheck
import { createStructure } from "./createStructure";
import { createStructureInDB } from "../structure.repository";
import { updateRoleOfResponsable } from "../../../controllers/account/users.service";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../structure.repository", () => ({
  createStructureInDB: jest.fn().mockResolvedValue({ _id: "id" }),
}));

jest.mock("../../../controllers/account/users.service", () => ({
  updateRoleOfResponsable: jest.fn(),
}));

describe("createStructure", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();
  it("should return 405 if not from site", async () => {
    const req = { test: "a", fromSite: false };
    await createStructure(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête bloquée par API" });
  });
  it("should return 400 if no body", async () => {
    const req = { fromSite: true };
    await createStructure(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no body query", async () => {
    const req = { fromSite: true, body: { test: "s" } };
    await createStructure(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  const req = {
    userId: "userId",
    fromSite: true,
    body: {
      query: {
        nom: "structure",
        membres: [],
      },
    },
  };

  it("should return 200 when no membres", async () => {
    await createStructure(req, res);
    expect(createStructureInDB).toHaveBeenCalledWith({
      nom: "structure",
      membres: [],
      status: "En attente",
      createur: "userId",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "Succès" });
  });

  it("should return 500 when createStructureInDB throws", async () => {
    createStructureInDB.mockRejectedValueOnce(new Error("error"));

    await createStructure(req, res);
    expect(createStructureInDB).toHaveBeenCalledWith({
      nom: "structure",
      membres: [],
      status: "En attente",
      createur: "userId",
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  const reqWithMembres = {
    userId: "userId",
    fromSite: true,
    body: {
      query: {
        nom: "structure",
        membres: [{ userId: "userId2", roles: ["admin"] }],
      },
    },
  };

  it("should return 200 and call updateRoleOfResponsable when membres", async () => {
    await createStructure(reqWithMembres, res);
    expect(createStructureInDB).toHaveBeenCalledWith({
      nom: "structure",
      membres: [{ userId: "userId2", roles: ["admin"] }],
      status: "En attente",
      createur: "userId",
    });
    expect(updateRoleOfResponsable).toHaveBeenCalledWith("userId2");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "Succès" });
  });

  it("should return 500 if updateRoleOfResponsable throws", async () => {
    updateRoleOfResponsable.mockRejectedValueOnce(new Error("erreur"));
    await createStructure(reqWithMembres, res);
    expect(createStructureInDB).toHaveBeenCalledWith({
      nom: "structure",
      membres: [{ userId: "userId2", roles: ["admin"] }],
      status: "En attente",
      createur: "userId",
    });
    expect(updateRoleOfResponsable).toHaveBeenCalledWith("userId2");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });
});
