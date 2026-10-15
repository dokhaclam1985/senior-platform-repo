import { Router } from "express";

const router = Router();

/*
 * Receive Grafana alert notifications.
 */
router.post("/webhook", (req, res) => {
  console.log(
    JSON.stringify({
      event: "grafana_alert_webhook",
      receivedAt: new Date().toISOString(),
      payload: req.body,
    })
  );

  res.status(200).json({
    message: "Alert webhook received",
  });
});

export default router;