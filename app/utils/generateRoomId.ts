import { v4 as uuidv4 } from "uuid";

export const generateRoomId = () => {
  const uuid = uuidv4(); // Generate a UUID
  const parts = uuid.split("-"); // Split the UUID into parts

  // Combine parts to create the custom ID
  const customId = `${parts[0].substring(0, 3)}-${parts[1].substring(
    0,
    3
  )}-${parts[2].substring(0, 3)}`;

  return customId;
};
