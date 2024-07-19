import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  updateRoom,
  getRoomsCount,
  checkID,
  validateRoom,
} from "../controllers/roomController";

const router = express.Router();

router.param("id", checkID);
router.param("id", validateRoom);

router.route("/").get(getRoomsCount).post(createRoom);
router.route("/:id").get(getRoom).patch(updateRoom).delete(deleteRoom);

export default router;
