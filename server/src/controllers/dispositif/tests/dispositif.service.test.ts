// @ts-nocheck
import { getDispositifs, getAllDispositifs } from "../dispositif.service";
import {
  getDispositifArray,
  getDispositifsFromDB,
} from "../dispositif.repository";
import {
  fakeContenuWithoutZoneDAction,
  fakeContenuWithZoneDAction,
} from "../../../__fixtures__/dispositifs";
import {
  turnToLocalized,
  turnJSONtoHTML,
  turnToLocalizedTitles,
} from "../functions";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../dispositif.repository", () => ({
  getDispositifArray: jest.fn(),
  getDispositifsFromDB: jest.fn(),
}));

jest.mock("../functions", () => ({
  turnToLocalized: jest.fn(),
  turnJSONtoHTML: jest.fn(),
  turnToLocalizedTitles: jest.fn(),
}));

describe("getDispositifs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return 400 if no body", async () => {
    const res = mockResponse();
    const req = {};
    await getDispositifs(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no query in body", async () => {
    const res = mockResponse();
    const req = { body: {} };
    await getDispositifs(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should call getDispositifsArray and return correct result if one content has a zone d'action and an other not", async () => {
    getDispositifArray.mockResolvedValue([
      {
        id: "id1",
        contenu: fakeContenuWithZoneDAction,
      },
      {
        id: "id2",
        contenu: fakeContenuWithoutZoneDAction,
      },
    ]);
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query } };
    await getDispositifs(req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query);
    const contenu1 = [
      {},
      {
        children: [
          {
            type: "card",
            isFakeContent: false,
            title: "Zone d'action",
            titleIcon: "pin-outline",
            typeIcon: "eva",
            departments: ["All"],
            free: true,
            contentTitle: "Sélectionner",
            editable: false,
          },
          {},
          {},
          {},
          {},
        ],
      },
    ];
    const contenu2 = [
      {},
      {
        children: [{}, {}, {}, {}],
      },
    ];
    const adaptedDispositif1 = {
      id: "id1",
      contenu: contenu1,
    };
    const adaptedDispositif2 = {
      id: "id2",
      contenu: contenu2,
    };
    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif1, "fr");
    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif2, "fr");

    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu1);
    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu2);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: [adaptedDispositif1, adaptedDispositif2],
    });
  });
  const contenu1 = [
    {},
    {
      children: [
        {
          type: "card",
          isFakeContent: false,
          title: "Zone d'action",
          titleIcon: "pin-outline",
          typeIcon: "eva",
          departments: ["All"],
          free: true,
          contentTitle: "Sélectionner",
          editable: false,
        },
        {},
        {},
        {},
        {},
      ],
    },
  ];
  const contenu2 = [
    {},
    {
      children: [{}, {}, {}, {}],
    },
  ];
  const adaptedDispositif1 = {
    id: "id1",
    contenu: contenu1,
  };
  const adaptedDispositif2 = {
    id: "id2",
    contenu: contenu2,
  };

  const dispositifs = [
    {
      id: "id1",
      contenu: fakeContenuWithZoneDAction,
    },
    {
      id: "id2",
      contenu: fakeContenuWithoutZoneDAction,
    },
  ];

  it("should call getDispositifsArray and return correct result if one content has a zone d'action and an other not", async () => {
    getDispositifArray.mockResolvedValue(dispositifs);
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query } };
    await getDispositifs(req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query);

    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif1, "fr");
    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif2, "fr");

    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu1);
    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu2);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: [adaptedDispositif1, adaptedDispositif2],
    });
  });
  it("should call getDispositifsArray and return correct result if one content has a zone d'action and an other not and locale in query", async () => {
    getDispositifArray.mockResolvedValue(dispositifs);
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query, locale: "en" } };
    await getDispositifs(req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query);

    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif1, "en");
    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif2, "en");

    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu1);
    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu2);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: [adaptedDispositif1, adaptedDispositif2],
    });
  });

  it("should return a 500 if getDispositifArray throws", async () => {
    getDispositifArray.mockRejectedValueOnce(new Error("error"));
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query, locale: "en" } };
    await getDispositifs(req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query);

    expect(turnToLocalized).not.toHaveBeenCalled();
    expect(turnToLocalized).not.toHaveBeenCalled();

    expect(turnJSONtoHTML).not.toHaveBeenCalled();
    expect(turnJSONtoHTML).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  it("should return a 500 if turnToLocalized throws", async () => {
    getDispositifArray.mockResolvedValue(dispositifs);
    turnToLocalized.mockImplementationOnce(() => {
      throw new Error("TEST");
    });
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query, locale: "en" } };
    await getDispositifs(req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query);

    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif1, "en");

    expect(turnJSONtoHTML).not.toHaveBeenCalled();
    expect(turnJSONtoHTML).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  it("should return a 500 if turnJSONToHTML throws", async () => {
    getDispositifArray.mockResolvedValue(dispositifs);
    turnJSONtoHTML.mockImplementationOnce(() => {
      throw new Error("TEST");
    });
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query, locale: "en" } };
    await getDispositifs(req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query);

    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif1, "en");

    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu1);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});

describe("getAllispositifs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    updatedAt: 1,
    status: 1,
    typeContenu: 1,
  };

  const dispositifsToJson = [
    {
      toJSON: () => ({
        id: "id1",
        mainSponsor: {
          _id: "id",
          nom: "nom",
          status: "Actif",
          email: "email",
        },
      }),
    },
    { toJSON: () => ({ id: "id2" }) },
  ];

  const adaptedDispositif1 = {
    id: "id1",
    mainSponsor: {
      _id: "id",
      nom: "nom",
      status: "Actif",
    },
  };
  const adaptedDispositif2 = {
    id: "id2",
    mainSponsor: "",
  };
  it("should call getDispositifsFromDB", async () => {
    getDispositifsFromDB.mockResolvedValue(dispositifsToJson);
    const res = mockResponse();
    await getAllDispositifs({}, res);
    expect(getDispositifsFromDB).toHaveBeenCalledWith(neededFields);
    expect(turnToLocalizedTitles).toHaveBeenCalledWith(
      adaptedDispositif1,
      "fr"
    );
    expect(turnToLocalizedTitles).toHaveBeenCalledWith(
      adaptedDispositif2,
      "fr"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: [adaptedDispositif1, adaptedDispositif2],
    });
  });

  it("should call getDispositifsFromDB and return a 500 if getDispositifsFromDB throws", async () => {
    getDispositifsFromDB.mockRejectedValue(new Error("error"));
    const res = mockResponse();
    await getAllDispositifs({}, res);
    expect(getDispositifsFromDB).toHaveBeenCalledWith(neededFields);
    expect(turnToLocalizedTitles).not.toHaveBeenCalled();
    expect(turnToLocalizedTitles).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  it("should call getDispositifsFromDB and return a 500 if dispositif has no json", async () => {
    getDispositifsFromDB.mockResolvedValue([{ id: "id1" }, { id: "id2" }]);
    const res = mockResponse();
    await getAllDispositifs({}, res);
    expect(getDispositifsFromDB).toHaveBeenCalledWith(neededFields);
    expect(turnToLocalizedTitles).not.toHaveBeenCalled();
    expect(turnToLocalizedTitles).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  it("should call getDispositifsFromDB and return a 500 if dispositif has no json", async () => {
    getDispositifsFromDB.mockResolvedValue(dispositifsToJson);
    turnToLocalizedTitles.mockImplementationOnce(() => {
      throw new Error("TEST");
    });
    const res = mockResponse();
    await getAllDispositifs({}, res);
    expect(getDispositifsFromDB).toHaveBeenCalledWith(neededFields);
    expect(turnToLocalizedTitles).toHaveBeenCalledWith(
      adaptedDispositif1,
      "fr"
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});