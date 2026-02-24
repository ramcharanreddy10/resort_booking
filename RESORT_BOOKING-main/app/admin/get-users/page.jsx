import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/app/utils/configue/db";
import userModel from "@/app/utils/models/userModel";
import bookingModel from "@/app/utils/models/bookingModel"; // ✅ Import to register schema
import productModel from "@/app/utils/models/productModel"; // ✅ Import to register Product schema
import UsersClient from "./UsersClient";

const GetUsers = async () => {
  // 1️⃣ Get session
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-700 text-lg">Unauthorized - Please log in</p>
        </div>
      </div>
    );
  }

  // 2️⃣ Only admin can access
  if (session.user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-700 text-lg">Access Denied - Admin only</p>
        </div>
      </div>
    );
  }

  // 3️⃣ Connect DB
  await connectToDatabase();

  // 4️⃣ Fetch users + FULL booking details
  const users = await userModel
    .find({ role: "user" })
    .select("-password")
    .populate({
      path: "bookings",
      model: "booking", // ✅ Match your model name
      populate: {
        path: "resortRoom",
        model: "Product"
      }
    })
    .lean();

  // 5️⃣ Serialize data for client (convert MongoDB objects to plain objects)
  const serializedUsers = JSON.parse(JSON.stringify(users));

  return <UsersClient users={serializedUsers} />;
};

export default GetUsers;

