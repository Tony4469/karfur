import { sendDraftReminderMail } from "./sendDraftReminderMail";
import { checkCronAuthorization } from "../../../libs/checkAuthorizations";
import {
  getDraftDispositifs,
  updateDispositifInDB,
} from "../../../controllers/dispositif/dispositif.repository";
import { sendDraftReminderMailService } from "../../../modules/mail/mail.service";
import moment from "moment";
import mockdate from "mockdate";
import logger from "../../../logger";

mockdate.set("2019-11-10T10:00:00.00Z");

jest.mock("../../../logger");
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkCronAuthorization: jest.fn(),
}));

jest.mock("../../../controllers/dispositif/dispositif.repository", () => ({
  getDraftDispositifs: jest.fn(),
  updateDispositifInDB: jest.fn(),
}));

jest.mock("../../../modules/mail/mail.service", () => ({
  sendDraftReminderMailService: jest.fn(),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("sendDraftReminderMail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();
  //   const mockDate = new Date(1466424490000);
  //   jest.spyOn(global, "Date").mockImplementation(() => mockDate);

  it("should return 404 if not authorized", async () => {
    checkCronAuthorization.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    });
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendDraftReminderMail(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should get dispositifs sendDraftReminderMailService for dispo id1, not id2 (received), not id3(nb days too small), not id4 (no email)", async () => {
    getDraftDispositifs.mockResolvedValueOnce([
      {
        _id: "id1",
        titreInformatif: "titre",
        lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
        creatorId: { email: "email", username: "pseudo", _id: "userId" },
      },
      {
        _id: "id2",
        titreInformatif: "titre",
        lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
        creatorId: { email: "email", username: "pseudo", _id: "userId" },
        draftReminderMailSentDate: moment.utc("2019-02-01T13:00:00.232Z"),
      },
      {
        _id: "id3",
        titreInformatif: "titre",
        lastModificationDate: moment.utc("2019-11-09T13:00:00.232Z"),
        creatorId: { email: "email", username: "pseudo", _id: "userId" },
      },
      {
        _id: "id4",
        titreInformatif: "titre",
        lastModificationDate: moment.utc("2019-10-09T13:00:00.232Z"),
        creatorId: { username: "pseudo", _id: "userId" },
      },
    ]);
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendDraftReminderMail(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(getDraftDispositifs).toHaveBeenCalledWith();
    expect(sendDraftReminderMailService).toHaveBeenCalledWith(
      "email",
      "pseudo",
      "titre",
      "userId",
      "id1"
    );
    expect(sendDraftReminderMailService).not.toHaveBeenCalledWith(
      "email",
      "pseudo",
      "titre",
      "userId",
      "id2"
    );
    expect(sendDraftReminderMailService).not.toHaveBeenCalledWith(
      "email",
      "pseudo",
      "titre",
      "userId",
      "id3"
    );
    expect(sendDraftReminderMailService).not.toHaveBeenCalledWith(
      "email",
      "pseudo",
      "titre",
      "userId",
      "id4"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "[sendDraftReminderMail] dispositif with id id2 has already received reminder "
    );
    expect(logger.info).toHaveBeenCalledWith(
      "[sendDraftReminderMail] dispositif with id id3 has been updated 1 ago"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "[sendDraftReminderMail] dispositif with id id4, creator has no email related"
    );
    expect(updateDispositifInDB).toHaveBeenCalledWith("id1", {
      draftReminderMailSentDate: 1573380000000,
    });
    expect(updateDispositifInDB).not.toHaveBeenCalledWith("id2", {
      draftReminderMailSentDate: 1573380000000,
    });
    expect(updateDispositifInDB).not.toHaveBeenCalledWith("id3", {
      draftReminderMailSentDate: 1573380000000,
    });
    expect(updateDispositifInDB).not.toHaveBeenCalledWith("id4", {
      draftReminderMailSentDate: 1573380000000,
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should get dispositifs sendDraftReminderMailService for dispo id1 and continue with id2 4 even if it throws", async () => {
    getDraftDispositifs.mockResolvedValueOnce([
      {
        _id: "id1",
        titreInformatif: "titre",
        lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
        creatorId: { email: "email", username: "pseudo", _id: "userId" },
      },
      {
        _id: "id2",
        titreInformatif: "titre",
        lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
        creatorId: { email: "email", username: "pseudo", _id: "userId" },
        draftReminderMailSentDate: moment.utc("2019-02-01T13:00:00.232Z"),
      },
    ]);
    sendDraftReminderMailService.mockRejectedValueOnce(new Error("erreur"));
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendDraftReminderMail(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(getDraftDispositifs).toHaveBeenCalledWith();
    expect(sendDraftReminderMailService).toHaveBeenCalledWith(
      "email",
      "pseudo",
      "titre",
      "userId",
      "id1"
    );

    expect(logger.info).toHaveBeenCalledWith(
      "[sendDraftReminderMail] dispositif with id id2 has already received reminder "
    );

    expect(updateDispositifInDB).not.toHaveBeenCalledWith("id1", {
      draftReminderMailSentDate: 1573380000000,
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
