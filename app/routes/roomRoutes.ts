import express from "express";
import { checkID } from "../utils/checkID";
import { validateRoom } from "../utils/validateRoom";
import {
  createRoom,
  deleteRoom,
  getRoom,
  updateRoom,
  getRoomsCount,
} from "../controllers/roomController";
import { authenticateUser } from "../utils/authenticateUser";
import { checkRoomsLength } from "../utils/checkRoomsLength";

const router = express.Router();

router.use(authenticateUser);
router.param("id", checkID);
router.param("id", validateRoom);

router.route("/").get(getRoomsCount).post(checkRoomsLength, createRoom);
router.route("/:id").get(getRoom).patch(updateRoom).delete(deleteRoom);

export default router;
