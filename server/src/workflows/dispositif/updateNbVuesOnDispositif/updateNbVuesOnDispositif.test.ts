// @ts-nocheck
import { updateNbVuesOnDispositif } from "./updateNbVuesOnDispositif";
import { updateDispositifInDB } from "../../../controllers/dispositif/dispositif.repository";

jest.mock("../../../controllers/dispositif/dispositif.repository", () => ({
  updateDispositifInDB: jest.fn(),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("updateNbVuesOnDispositif", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return 500 if not from site", async () => {
    const res = mockResponse();

    await updateNbVuesOnDispositif(
      {
        body: { query: { id: "id", nbVues: 2 } },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return 200 and callupdateDispositifInDB ", async () => {
    const res = mockResponse();

    await updateNbVuesOnDispositif(
      {
        body: { query: { id: "id", nbVues: 2 } },
        fromSite: true,
      },
      res
    );
    expect(updateDispositifInDB).toHaveBeenCalledWith("id", { nbVues: 2 });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
