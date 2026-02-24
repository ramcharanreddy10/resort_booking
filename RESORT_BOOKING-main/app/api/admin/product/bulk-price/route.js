
import connectToDatabase from "../../../../utils/configue/db";
import productModel from "../../../../utils/models/productModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectToDatabase();
    const { ids, percentage } = await request.json();

    const products = await productModel.find({ _id: { $in: ids } });

    for (const product of products) {
      const newPrice = product.price * (1 + percentage / 100);
      await productModel.findByIdAndUpdate(product._id, { 
        price: Math.round(newPrice) 
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Bulk Price Update Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}