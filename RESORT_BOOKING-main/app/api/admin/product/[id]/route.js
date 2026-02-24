
import connectToDatabase from "../../../../utils/configue/db";
import productModel from "../../../../utils/models/productModel";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;
    const product = await productModel.findById(id);

    if (!product) {
      return NextResponse.json({ message: "Product Not Found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product fetched successfully", product }, { status: 200 });
  } catch (error) {
    console.error("Product Fetch Error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

// UPDATE RESORT
export async function PUT(request, context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;
    const body = await request.json();

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE RESORT
export async function DELETE(request, context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// TOGGLE AVAILABILITY
export async function PATCH(request, context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;
    const { available } = await request.json();

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { available },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Toggle Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}






























// import connectToDatabase from "../../../../utils/configue/db";
// import productModel from "../../../../utils/models/productModel";
// import { NextResponse } from "next/server";

// export async function GET(request, context) {
//   try {
//     await connectToDatabase();

//     const { id } = await context.params;
//     console.log("Dynamic Id:", id);

//     const product = await productModel.findById(id);

//     if (!product) {
//       return NextResponse.json(
//         { message: "Product Not Found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Product fetched successfully", product },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Product Fetch Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error", error: error.message },
//       { status: 500 }
//     );
//   }
// }