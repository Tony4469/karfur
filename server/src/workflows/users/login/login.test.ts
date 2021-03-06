// @ts-nocheck
import { login } from "./login";
import { getUserByUsernameFromDB } from "../../../modules/users/users.repository";
import { getRoleByName } from "../../../controllers/role/role.repository";
import { register } from "../../../modules/users/register";
import { adminLogin } from "../../../modules/users/adminLogin";
import { proceedWithLogin } from "../../../modules/users/users.service";

jest.mock("../../../modules/users/users.repository", () => ({
  getUserByUsernameFromDB: jest.fn(),
}));

jest.mock("../../../controllers/role/role.repository", () => ({
  getRoleByName: jest.fn(),
}));
jest.mock("../../../modules/users/register", () => ({
  register: jest.fn(),
}));
jest.mock("../../../modules/users/adminLogin", () => ({
  adminLogin: jest.fn(),
}));
jest.mock("../../../modules/users/users.service", () => ({
  proceedWithLogin: jest.fn(),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const userRole = { nom: "User", _id: "id" };

describe("login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();

  it("should throw if no password", async () => {
    const req = { body: { username: "test" } };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should throw if no username", async () => {
    const req = { body: { password: "test" } };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should throw if not from site", async () => {
    const req = { body: { password: "test", username: "test" } };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      text: "Création d'utilisateur ou login impossible par API",
    });
  });

  const req = {
    body: { password: "password", username: "test" },
    fromSite: true,
  };

  it("should call getUserByUsernameFromDB, and register if no user", async () => {
    getUserByUsernameFromDB.mockResolvedValueOnce(null);
    getRoleByName.mockResolvedValueOnce(userRole);
    register.mockResolvedValueOnce({ user: "user", token: "token" });
    await login(req, res);
    expect(getUserByUsernameFromDB).toHaveBeenCalledWith("test");
    expect(getRoleByName).toHaveBeenCalledWith("User");
    expect(register).toHaveBeenCalledWith(
      { password: "password", username: "test" },
      userRole
    );
    expect(adminLogin).not.toHaveBeenCalled();
    expect(proceedWithLogin).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      token: "token",
      data: "user",
    });
  });

  it("should return a 500 if register throws", async () => {
    getUserByUsernameFromDB.mockResolvedValueOnce(null);
    getRoleByName.mockResolvedValueOnce(userRole);
    register.mockRejectedValueOnce(new Error("INTERNAL"));
    await login(req, res);
    expect(getUserByUsernameFromDB).toHaveBeenCalledWith("test");
    expect(getRoleByName).toHaveBeenCalledWith("User");
    expect(register).toHaveBeenCalledWith(
      { password: "password", username: "test" },
      userRole
    );
    expect(adminLogin).not.toHaveBeenCalled();
    expect(proceedWithLogin).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  it("should throw invalid password if not authenticate", async () => {
    getUserByUsernameFromDB.mockResolvedValueOnce({
      authenticate: () => false,
    });

    await login(req, res);
    expect(getUserByUsernameFromDB).toHaveBeenCalledWith("test");
    expect(getRoleByName).not.toHaveBeenCalled();
    expect(register).not.toHaveBeenCalled();
    expect(adminLogin).not.toHaveBeenCalled();
    expect(proceedWithLogin).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      text: "Mot de passe incorrect",
      data: "no-alert",
    });
  });

  it("should call adminLogin if user is admin", async () => {
    const authenticate = () => true;
    getUserByUsernameFromDB.mockResolvedValueOnce({
      authenticate,
      roles: ["id_admin"],
    });

    await login({ ...req, roles: [{ nom: "Admin", _id: "id_admin" }] }, res);

    expect(getUserByUsernameFromDB).toHaveBeenCalledWith("test");
    expect(getRoleByName).not.toHaveBeenCalled();
    expect(register).not.toHaveBeenCalled();
    expect(adminLogin).toHaveBeenCalledWith(
      { password: "password", username: "test" },
      {
        authenticate,
        roles: ["id_admin"],
      },
      res
    );
    expect(proceedWithLogin).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should call proceedWithLogin if user is not admin", async () => {
    const authenticate = () => true;
    const user = {
      authenticate,
      roles: ["id_user"],
      getToken: () => "token",
    };
    getUserByUsernameFromDB.mockResolvedValueOnce(user);

    await login({ ...req, roles: [{ nom: "Admin", _id: "id_admin" }] }, res);

    expect(getUserByUsernameFromDB).toHaveBeenCalledWith("test");
    expect(getRoleByName).not.toHaveBeenCalled();
    expect(register).not.toHaveBeenCalled();
    expect(adminLogin).not.toHaveBeenCalled();
    expect(proceedWithLogin).toHaveBeenCalledWith(user);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: "token",
      text: "Authentification réussi",
    });
  });
});
