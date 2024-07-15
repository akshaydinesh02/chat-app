import { Request, Response, NextFunction } from "express";
import { decrypt } from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import { generateUniqueId } from "../utils/rooms.util";

const decryptNumber = (cipherText: string, secretKey: string) => {
  const bytes = decrypt(cipherText, secretKey);
  const originalNumber = bytes.toString(Utf8);
  return originalNumber;
};

const secretKey = "sME7a1A6pw";
export const checkUserAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const encryptedPin = req.header("pin");
  const name = req.header("name");
  if (!encryptedPin || !name) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized! User name or pin code missing!",
    });
  }
  const decryptedPin = decryptNumber(encryptedPin, secretKey);
  const uniqueId = generateUniqueId();
  const newRoomData = {
    createdBy: name,
    pin: decryptedPin,
    id: uniqueId,
  };
  res.locals.newRoomData = newRoomData;
  next();
};
