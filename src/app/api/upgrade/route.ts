// app/api/upgrade/route.ts
import { lemonsqueezyPayInstance } from "@/lib/axios";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const data = await req.json();
  const email = data.email;
  const storeId = process.env.STORE_ID;
  const productId = process.env.PRODUCT_ID;

  if (!storeId || !productId || !email) {
    console.error("Missing required environment variables");
    return Response.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const checkoutData = {
      data: {
        attributes: {
          checkout_data: {
            custom: {
              email: email,
            },
          },
        },
        type: "checkouts",
        relationships: {
          store: {
            data: {
              type: "stores",
              id: storeId,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: productId,
            },
          },
        },
      },
    };

    const response = await lemonsqueezyPayInstance.post(
      "/v1/checkouts",
      checkoutData
    );

    // Return the checkout URL from the response
    return Response.json({
      message: "success",
      url: response.data.data.attributes.url,
    });
  } catch (error: any) {
    console.error("Checkout creation failed:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });

    // Return appropriate error response
    return Response.json(
      {
        message: "Failed to create checkout",
        error: error?.response?.data?.errors?.[0]?.detail || error?.message,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
