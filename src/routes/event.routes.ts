import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { authenticateUser, authorizeRole } from "../middleware/auth";

const router = Router();
const eventController = new EventController();

/**
 * @swagger
 * /api/events:
 *   post:
 *     tags: [Events]
 *     summary: Create a new event
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not an organizer
 */
router.post(
    "/",
    authenticateUser,
    (req, res, next) => {
        console.log('User role:', req.user.role);
        next();
    },
    authorizeRole("organizer"),
    eventController.createEvent
);

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: Get all events
 *     responses:
 *       200:
 *         description: List of events
 */
router.get("/", eventController.getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Get event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
router.get("/:id", eventController.getEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     tags: [Events]
 *     summary: Update event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the event owner
 *       404:
 *         description: Event not found
 */
router.put(
    "/:id",
    authenticateUser,
    (req, res, next) => {
        console.log('User role:', req.user.role);
        next();
    },
    authorizeRole("organizer"),
    eventController.updateEvent
);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     tags: [Events]
 *     summary: Delete event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the event owner
 *       404:
 *         description: Event not found
 */
router.delete(
    "/:id",
    authenticateUser,
    (req, res, next) => {
        console.log('User role:', req.user.role);
        next();
    },
    authorizeRole("organizer"),
    eventController.deleteEvent
);

export default router;
