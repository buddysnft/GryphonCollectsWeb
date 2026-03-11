import { NextRequest, NextResponse } from "next/server";

// Dynamic import for Shippo SDK
const Shippo = require("shippo");

const shippo = new Shippo(process.env.SHIPPO_API_TOKEN!);

// Gryphon Collects return address (from Tyler)
const FROM_ADDRESS = {
  name: "Gryphon Collects",
  street1: "4460 Corporation Lane Ste 100",
  city: "Virginia Beach",
  state: "VA",
  zip: "23462",
  country: "US",
  phone: "", // Add if available
  email: "gryphoncollecting@gmail.com",
};

// Default package specs (from Tyler)
const DEFAULT_PARCEL = {
  length: "6",
  width: "4",
  height: "1",
  distance_unit: "in" as const,
  weight: "9",
  mass_unit: "oz" as const,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, shippingAddress, orderTotal } = body;

    if (!orderId || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required fields: orderId, shippingAddress" },
        { status: 400 }
      );
    }

    // Create address to object
    const toAddress = {
      name: shippingAddress.name || "Customer",
      street1: shippingAddress.street1,
      street2: shippingAddress.street2 || "",
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip: shippingAddress.zip,
      country: shippingAddress.country || "US",
      email: shippingAddress.email || "",
      phone: shippingAddress.phone || "",
    };

    // Create shipment
    const shipment = await shippo.shipments.create({
      addressFrom: FROM_ADDRESS,
      addressTo: toAddress,
      parcels: [DEFAULT_PARCEL],
      async: false, // Wait for rates
    });

    // Find USPS Ground Advantage rate
    const rates = shipment.rates || [];
    let selectedRate = rates.find(
      (rate: any) =>
        rate.provider === "USPS" &&
        rate.servicelevel.name.includes("Ground Advantage")
    );

    // Fallback to cheapest USPS rate if Ground Advantage not available
    if (!selectedRate) {
      const uspsRates = rates.filter((rate: any) => rate.provider === "USPS");
      if (uspsRates.length > 0) {
        selectedRate = uspsRates.sort(
          (a: any, b: any) => parseFloat(a.amount) - parseFloat(b.amount)
        )[0];
      }
    }

    if (!selectedRate) {
      return NextResponse.json(
        { error: "No USPS rates available for this shipment" },
        { status: 400 }
      );
    }

    // Create transaction (purchase label)
    // Add signature confirmation if order > $1,000
    const transactionOptions: any = {
      rate: selectedRate.object_id,
      labelFileType: "PDF",
      async: false,
    };

    // Add signature confirmation for orders over $1,000
    if (orderTotal && parseFloat(orderTotal) > 1000) {
      transactionOptions.extra = {
        signature_confirmation: "ADULT",
      };
    }

    const transaction = await shippo.transactions.create(transactionOptions);

    if (transaction.status === "SUCCESS") {
      return NextResponse.json({
        success: true,
        labelUrl: transaction.label_url,
        trackingNumber: transaction.tracking_number,
        trackingUrl: transaction.tracking_url_provider,
        carrier: "USPS",
        service: selectedRate.servicelevel.name,
        cost: selectedRate.amount,
        transactionId: transaction.object_id,
      });
    } else {
      return NextResponse.json(
        {
          error: "Failed to create shipping label",
          details: transaction.messages || "Unknown error",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Shippo API error:", error);
    return NextResponse.json(
      {
        error: "Failed to create shipping label",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
