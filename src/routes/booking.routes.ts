import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authenticateUser, authorizeRole } from "../middleware/auth";

const router = Router();
const bookingController = new BookingController();

// Create a booking (Organizer only)
router.post(
    "/",
    authenticateUser,
    authorizeRole("organizer"),
    bookingController.createBooking
);

// Get all bookings (filtered by user role)
router.get(
    "/",
    authenticateUser,
    bookingController.getBookings
);

// Get specific booking
router.get(
    "/:id",
    authenticateUser,
    bookingController.getBooking
);

// Update booking status (Artist only)
router.put(
    "/:id/status",
    authenticateUser,
    authorizeRole("artist"),
    bookingController.updateBookingStatus
);

// Delete booking (Both artist and organizer)
router.delete(
    "/:id",
    authenticateUser,
    bookingController.deleteBooking
);

export default router;