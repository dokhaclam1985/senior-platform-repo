import { Router } from "express";

import {
  getUsers,
  getUser,
  createNewUser,
  updateExistingUser,
  deleteExistingUser,
} from "../controllers/usersController";

import { validateUser } from "../middleware/validateUser";
import { jwtAuth } from "../middleware/jwtAuth";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.use(jwtAuth);
router.use(requireRole("admin"));

router.get("/", getUsers);

router.get("/:id", getUser);

router.post(
  "/",
  validateUser,
  createNewUser
);

router.put(
  "/:id",
  validateUser,
  updateExistingUser
);

router.delete(
  "/:id",
  deleteExistingUser
);

export default router;