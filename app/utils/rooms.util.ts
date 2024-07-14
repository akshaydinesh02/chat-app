import { rooms } from "../helpers/rooms.helper";

interface INewRoomData {
  id: string;
  createdBy: string;
  pin: number;
}

export const getRoomsLength = () => {
  return rooms.size;
};

export const addNewRoom = (roomData: INewRoomData) => {
  const { id, createdBy, pin } = roomData;
  rooms.set(id, pin);
};
