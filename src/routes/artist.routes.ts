import { Router } from "express";
import { authenticateUser, authorizeRole } from "../middleware/auth";
import { ArtistController } from "../controllers/artist.controller";

const router = Router();
const artistController = new ArtistController();

/**
 * @swagger
 * /api/artists:
 *   get:
 *     tags: [Artists]
 *     summary: Get all artist profiles
 *     responses:
 *       200:
 *         description: List of artist profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ArtistProfile'
 */
router.get("/", artistController.getAllProfiles);

/**
 * @swagger
 * /api/artists:
 *   post:
 *     tags: [Artists]
 *     summary: Create artist profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArtistProfile'
 *     responses:
 *       201:
 *         description: Artist profile created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArtistProfile'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not an artist
 */
router.post(
  "/",
  authenticateUser,
  authorizeRole("artist"),
  artistController.createProfile
);

/**
 * @swagger
 * /api/artists/{id}:
 *   get:
 *     tags: [Artists]
 *     summary: Get artist profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Artist profile details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArtistProfile'
 *       404:
 *         description: Artist profile not found
 */
router.get("/:id",  artistController.getProfile);

/**
 * @swagger
 * /api/artists/{id}:
 *   put:
 *     tags: [Artists]
 *     summary: Update artist profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stageName:
 *                 type: string
 *                 minLength: 2
 *               bio:
 *                 type: string
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               availability:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Artist profile updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the profile owner
 *       404:
 *         description: Artist profile not found
 */
router.put(
  "/:id",
  authenticateUser,
  authorizeRole("artist"),
  artistController.updateProfile
);

/**
 * @swagger
 * /api/artists/user/{userId}:
 *   get:
 *     tags: [Artists]
 *     summary: Get artist profile by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Artist profile details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArtistProfile'
 *       404:
 *         description: Artist profile not found
 */
router.get("/user/:userId", artistController.getProfileByUserId);

export default router;
