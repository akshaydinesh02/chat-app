export const rooms = new Map<string, number>();

export const checkIfRoomExist = (roomId: string) => rooms.has(roomId);
