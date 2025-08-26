import { BuildingStatus } from "src/entities/master/master_building.entity";
import { BusinessSourceStatus } from "src/entities/master/master_business_sources.entity";
import { AuthHelper } from "./auth-helper";

export const TestData = {
  // Dynamic auth token from hms-auth-service
  mockAuthToken: "",

  // Initialize auth token
  async initializeAuth() {
    this.mockAuthToken = await AuthHelper.getAuthToken();
  },

  // Buildings test data
  buildings: {
    valid: {
      sbu_id: 1,
      name: "Grand Plaza Hotel Main Building",
      description:
        "Main building housing reception, restaurant, and premium suites",
      status: BuildingStatus.Active,
    },
    validSecond: {
      sbu_id: 1,
      name: "Oceanview Resort Annex",
      description:
        "Secondary building with ocean-facing rooms and conference facilities",
      status: BuildingStatus.Active,
    },
    invalid: {
      sbu_id: "invalid", // Should be number
      name: "", // Empty name
      status: "INVALID_STATUS",
    },
    update: {
      name: "Updated Grand Plaza Hotel Main Building",
      description: "Updated description for main building",
      status: BuildingStatus.Active,
    },
  },

  // Business Sources test data
  businessSources: {
    valid: {
      sbu_id: 1,
      name: "Booking.com",
      code: "BDC",
      bin: "BIN001",
      address: "123 Travel Street, Amsterdam, Netherlands",
      color_tag: "#FF5722",
      status: BusinessSourceStatus.Active,
    },
    validSecond: {
      sbu_id: 1,
      name: "Expedia",
      code: "EXP",
      bin: "BIN002",
      address: "456 Reservation Ave, Seattle, WA, USA",
      color_tag: "#2196F3",
      status: BusinessSourceStatus.Active,
    },
    invalid: {
      sbu_id: "invalid", // Should be number
      name: "", // Empty name
      code: "TOOLONGCODE123456789", // Too long
      status: "INVALID_STATUS",
    },
    update: {
      name: "Booking.com Updated",
      code: "BDC_UPD",
      address: "Updated address for Booking.com",
      color_tag: "#FF9800",
    },
  },

  // Payment Modes test data
  paymentModes: {
    valid: {
      sbu_id: 1,
      name: "Credit Card",
      description: "Payment via credit card (Visa, MasterCard, Amex)",
      status: "Active",
    },
    validSecond: {
      sbu_id: 1,
      name: "Cash Payment",
      description: "Direct cash payment at reception",
      status: "Active",
    },
    invalid: {
      sbu_id: "invalid",
      name: "",
      status: "INVALID_STATUS",
    },
    update: {
      name: "Updated Credit Card",
      description: "Updated payment method for credit cards",
    },
  },

  // Currencies test data
  currencies: {
    valid: {
      sbu_id: 1,
      name: "US Dollar",
      code: "USD",
      symbol: "$",
      exchange_rate: 1.0,
      status: "Active",
    },
    validSecond: {
      sbu_id: 1,
      name: "Euro",
      code: "EUR",
      symbol: "€",
      exchange_rate: 0.85,
      status: "Active",
    },
    invalid: {
      sbu_id: "invalid",
      name: "",
      code: "TOOLONG",
      exchange_rate: "invalid",
    },
    update: {
      name: "Updated US Dollar",
      exchange_rate: 1.05,
    },
  },

  // Departments test data
  departments: {
    valid: {
      sbu_id: 1,
      name: "Front Office",
      description: "Reception and guest services department",
      status: "Active",
    },
    validSecond: {
      sbu_id: 1,
      name: "Housekeeping",
      description: "Room cleaning and maintenance department",
      status: "Active",
    },
    invalid: {
      sbu_id: "invalid",
      name: "",
      status: "INVALID_STATUS",
    },
    update: {
      name: "Updated Front Office",
      description: "Updated description for front office department",
    },
  },

  // Floors test data
  floors: {
    valid: {
      building_id: 1,
      name: "Ground Floor",
      description: "Main lobby, reception, restaurant, and conference rooms",
      floor_number: 0,
      status: "Active",
    },
    validSecond: {
      building_id: 1,
      name: "First Floor",
      description: "Premium guest rooms and suites",
      floor_number: 1,
      status: "Active",
    },
    invalid: {
      building_id: "invalid",
      name: "",
      floor_number: "invalid",
    },
    update: {
      name: "Updated Ground Floor",
      description: "Updated description for ground floor",
    },
  },

  // Room Types test data
  roomTypes: {
    valid: {
      sbu_id: 1,
      name: "Deluxe Suite",
      description: "Spacious suite with ocean view and premium amenities",
      max_occupancy: 4,
      base_rate: 299.99,
      status: "Active",
    },
    validSecond: {
      sbu_id: 1,
      name: "Standard Room",
      description: "Comfortable standard room with city view",
      max_occupancy: 2,
      base_rate: 149.99,
      status: "Active",
    },
    invalid: {
      sbu_id: "invalid",
      name: "",
      max_occupancy: "invalid",
      base_rate: "invalid",
    },
    update: {
      name: "Updated Deluxe Suite",
      description: "Updated luxury suite with enhanced amenities",
      base_rate: 349.99,
    },
  },

  // Taxes test data
  taxes: {
    valid: {
      sbu_id: 1,
      name: "VAT",
      description: "Value Added Tax",
      rate: 15.0,
      type: "Percentage",
      status: "Active",
    },
    validSecond: {
      sbu_id: 1,
      name: "Service Charge",
      description: "Service charge for hotel services",
      rate: 10.0,
      type: "Percentage",
      status: "Active",
    },
    invalid: {
      sbu_id: "invalid",
      name: "",
      rate: "invalid",
      type: "INVALID_TYPE",
    },
    update: {
      name: "Updated VAT",
      rate: 18.0,
    },
  },

  // Seasons test data
  seasons: {
    valid: {
      sbu_id: 1,
      name: "Peak Season",
      description: "High demand period with premium rates",
      start_date: "2024-06-01",
      end_date: "2024-08-31",
      rate_multiplier: 1.5,
      status: "Active",
    },
    validSecond: {
      sbu_id: 1,
      name: "Off Season",
      description: "Low demand period with discounted rates",
      start_date: "2024-01-01",
      end_date: "2024-03-31",
      rate_multiplier: 0.8,
      status: "Active",
    },
    invalid: {
      sbu_id: "invalid",
      name: "",
      start_date: "invalid-date",
      rate_multiplier: "invalid",
    },
    update: {
      name: "Updated Peak Season",
      rate_multiplier: 1.7,
    },
  },

  // Guests test data
  guests: {
    valid: {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@email.com",
      phone: "+1-555-0123",
      address: "123 Main Street, New York, NY 10001",
      nationality: "American",
      id_type: "Passport",
      id_number: "P123456789",
      date_of_birth: "1985-06-15",
      status: "Active",
    },
    validSecond: {
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@email.com",
      phone: "+1-555-0456",
      address: "456 Oak Avenue, Los Angeles, CA 90210",
      nationality: "Canadian",
      id_type: "Driver License",
      id_number: "DL987654321",
      date_of_birth: "1990-03-22",
      status: "Active",
    },
    invalid: {
      first_name: "",
      last_name: "",
      email: "invalid-email",
      phone: "invalid-phone",
      date_of_birth: "invalid-date",
    },
    update: {
      first_name: "Updated John",
      email: "john.doe.updated@email.com",
      phone: "+1-555-9999",
    },
  },

  // Roles test data
  roles: {
    valid: {
      sbu_id: 1,
      name: "Hotel Manager",
      description: "Manages overall hotel operations and staff",
      status: "Active",
    },
    validSecond: {
      sbu_id: 1,
      name: "Front Desk Agent",
      description: "Handles guest check-in/check-out and inquiries",
      status: "Active",
    },
    invalid: {
      sbu_id: "invalid",
      name: "",
      status: "INVALID_STATUS",
    },
    update: {
      name: "Updated Hotel Manager",
      description: "Updated role description for hotel manager",
    },
  },

  // SBU test data
  sbu: {
    valid: {
      name: "Grand Plaza Hotel Chain",
      description: "Luxury hotel chain with premium services",
      address: "789 Luxury Boulevard, Miami, FL 33101",
      phone: "+1-305-555-0100",
      email: "info@grandplaza.com",
      status: "Active",
    },
    validSecond: {
      name: "Oceanview Resort Group",
      description: "Beachfront resort with world-class amenities",
      address: "456 Ocean Drive, Malibu, CA 90265",
      phone: "+1-310-555-0200",
      email: "reservations@oceanview.com",
      status: "Active",
    },
    invalid: {
      name: "",
      email: "invalid-email",
      phone: "invalid-phone",
      status: "INVALID_STATUS",
    },
    update: {
      name: "Updated Grand Plaza Hotel Chain",
      description: "Updated luxury hotel chain description",
      phone: "+1-305-555-0199",
    },
  },

  // Discounts test data
  discounts: {
    valid: {
      sbu_id: 1,
      name: "Early Bird Discount",
      description: "Discount for bookings made 30 days in advance",
      type: "Percentage",
      value: 15.0,
      min_stay_nights: 2,
      max_discount_amount: 100.0,
      valid_from: "2024-01-01",
      valid_to: "2024-12-31",
      status: "Active",
    },
    validSecond: {
      sbu_id: 1,
      name: "Weekend Special",
      description: "Special discount for weekend stays",
      type: "Fixed",
      value: 50.0,
      min_stay_nights: 1,
      max_discount_amount: 50.0,
      valid_from: "2024-01-01",
      valid_to: "2024-12-31",
      status: "Active",
    },
    invalid: {
      sbu_id: "invalid",
      name: "",
      type: "INVALID_TYPE",
      value: "invalid",
      valid_from: "invalid-date",
    },
    update: {
      name: "Updated Early Bird Discount",
      value: 20.0,
      description: "Updated discount for early bookings",
    },
  },

  // Extra Charges test data
  extraCharges: {
    valid: {
      sbu_id: 1,
      name: "WiFi Premium",
      description: "High-speed internet access",
      amount: 15.0,
      type: "Fixed",
      status: "Active",
    },
    validSecond: {
      sbu_id: 1,
      name: "Parking Fee",
      description: "Valet parking service",
      amount: 25.0,
      type: "Fixed",
      status: "Active",
    },
    invalid: {
      sbu_id: "invalid",
      name: "",
      amount: "invalid",
      type: "INVALID_TYPE",
    },
    update: {
      name: "Updated WiFi Premium",
      amount: 20.0,
      description: "Updated premium internet service",
    },
  },

  // Rate Types test data
  rateTypes: {
    valid: {
      sbu_id: 1,
      name: "Standard Rate",
      description: "Regular room rate for standard bookings",
      status: "Active",
    },
    validSecond: {
      sbu_id: 1,
      name: "Corporate Rate",
      description: "Discounted rate for corporate clients",
      status: "Active",
    },
    invalid: {
      sbu_id: "invalid",
      name: "",
      status: "INVALID_STATUS",
    },
    update: {
      name: "Updated Standard Rate",
      description: "Updated standard room rate description",
    },
  },

  // Measurement Units test data
  measurementUnits: {
    valid: {
      sbu_id: 1,
      name: "Square Feet",
      symbol: "sq ft",
      description: "Area measurement in square feet",
      status: "Active",
    },
    validSecond: {
      sbu_id: 1,
      name: "Square Meters",
      symbol: "m²",
      description: "Area measurement in square meters",
      status: "Active",
    },
    invalid: {
      sbu_id: "invalid",
      name: "",
      symbol: "",
      status: "INVALID_STATUS",
    },
    update: {
      name: "Updated Square Feet",
      description: "Updated area measurement description",
    },
  },

  // Transportation Modes test data
  transportationModes: {
    valid: {
      sbu_id: 1,
      name: "Airport Shuttle",
      description: "Complimentary shuttle service to/from airport",
      status: "Active",
    },
    validSecond: {
      sbu_id: 1,
      name: "Taxi Service",
      description: "On-demand taxi service for guests",
      status: "Active",
    },
    invalid: {
      sbu_id: "invalid",
      name: "",
      status: "INVALID_STATUS",
    },
    update: {
      name: "Updated Airport Shuttle",
      description: "Updated shuttle service description",
    },
  },

  // Reservation Types test data
  reservationTypes: {
    valid: {
      sbu_id: 1,
      name: "Online Booking",
      description: "Reservation made through online platform",
      status: "Active",
    },
    validSecond: {
      sbu_id: 1,
      name: "Walk-in",
      description: "Direct reservation at hotel reception",
      status: "Active",
    },
    invalid: {
      sbu_id: "invalid",
      name: "",
      status: "INVALID_STATUS",
    },
    update: {
      name: "Updated Online Booking",
      description: "Updated online reservation description",
    },
  },
};
