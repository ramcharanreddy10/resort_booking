

import connectToDatabase from "../../../../utils/configue/db";
import productModel from "../../../../utils/models/productModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectToDatabase();
    const { ids } = await request.json();

    const result = await productModel.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    }, { status: 200 });
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
