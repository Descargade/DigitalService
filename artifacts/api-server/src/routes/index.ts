import { Router, type IRouter } from "express";
import healthRouter from "./health";
import portalRouter from "./portal";
import adminRouter from "./admin";
import messagesRouter from "./messages";

const router: IRouter = Router();

router.use(healthRouter);
router.use(portalRouter);
router.use(adminRouter);
router.use(messagesRouter);

export default router;
