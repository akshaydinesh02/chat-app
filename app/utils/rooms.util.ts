import { roomsMetaData } from "../helpers/rooms.helper";
import { v4 as uuidv4 } from "uuid";

interface INewRoomData {
  id: string;
  createdBy: string;
  pin: number;
}

export const getRoomsLength = () => {
  return roomsMetaData.size;
};

export const addNewRoom = (roomData: INewRoomData) => {
  const { id, createdBy, pin } = roomData;
  roomsMetaData.set(id, pin);
};

export const generateUniqueId = () => {
  const uuid = uuidv4(); // Generate a UUID
  const parts = uuid.split("-"); // Split the UUID into parts

  // Combine parts to create the custom ID
  const customId = `${parts[0].substring(0, 3)}-${parts[1].substring(
    0,
    3
  )}-${parts[2].substring(0, 3)}`;

  return customId;
};

export const getCurrentDate = () => {
  const current = new Date(Date.now());
  const day = current.getDay();
  const month = current.getMonth();
  const year = current.getFullYear();
  return `${day}-${month}-${year}`;
};
