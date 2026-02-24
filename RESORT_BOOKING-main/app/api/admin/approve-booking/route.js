import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/app/utils/configue/db";
import bookingModel from "@/app/utils/models/bookingModel";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || session.user.role !== "admin") {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookingId, status } = await req.json();

    // Validate status
    if (!["approved", "rejected"].includes(status)) {
      return Response.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Update booking status
    const booking = await bookingModel.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) {
      return Response.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}