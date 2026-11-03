import { type RecordData } from "@/types";
import { today } from "@/lib/format";
const names = [
  "Ayesha Khan",
  "Sara Ahmed",
  "Fatima Ali",
  "Hira Malik",
  "Zainab Shah",
  "Maryam Raza",
  "Noor Hassan",
  "Sana Iqbal",
  "Mahnoor Sheikh",
  "Alina Butt",
  "Ahmed Raza",
  "Hassan Ali",
  "Usman Khan",
  "Bilal Ahmed",
  "Hamza Malik",
  "Dua Tariq",
  "Iqra Saeed",
  "Amna Javed",
  "Laiba Asif",
  "Maham Akhtar",
];
export function seed() {
  const branches: RecordData[] = [
    "Gulberg Lahore",
    "DHA Karachi",
    "F-7 Islamabad",
  ].map((name, i) => ({
    id: "b" + i,
    name,
    branch: "b" + i,
    address: [
      "MM Alam Road, Lahore",
      "Khayaban-e-Shahbaz, Karachi",
      "College Road, Islamabad",
    ][i],
    phone: "0300-123456" + i,
    email: `branch${i}@salondemo.com`,
    hours: "09:00–20:00",
    manager: names[i],
    status: "Active",
  }));
  const categories = [
    "Hair Services",
    "Facial Treatments",
    "Skincare",
    "Makeup",
    "Manicure",
    "Pedicure",
    "Nail Art",
    "Massage",
    "Body Treatments",
    "Spa Packages",
    "Hair Coloring",
    "Hair Treatments",
    "Bridal Services",
  ];
  const services: RecordData[] = Array.from({ length: 52 }, (_, i) => ({
    id: "s" + i,
    name:
      [
        "Haircut",
        "Hair Coloring",
        "Facial Treatment",
        "Manicure",
        "Pedicure",
        "Full Body Massage",
        "Bridal Makeup",
      ][i] ||
      `${["Signature", "Luxury", "Express", "Restorative"][Math.floor(i / 13) % 4]} ${categories[i % 13]}`,
    branch: "all",
    category: categories[i < 7 ? [0, 10, 1, 4, 5, 7, 12][i] : i % 13],
    duration: [30, 120, 60, 45, 60, 90, 180][i % 7],
    price: [1500, 5000, 3000, 1800, 2000, 6000, 15000][i % 7],
    discount: 0,
    description:
      "A personalized treatment with premium products and expert care.",
    resources: "Treatment room, professional kit",
    status: "Active",
  }));
  const staff: RecordData[] = Array.from({ length: 24 }, (_, i) => ({
    id: "t" + i,
    name: names[i % 20] + (i >= 20 ? " Jr." : ""),
    branch: "b" + (i % 3),
    email: i === 0 ? "staff@salondemo.com" : `team${i}@salondemo.com`,
    phone: "0301-" + String(2345600 + i),
    designation: [
      "Hair Stylist",
      "Beautician",
      "Massage Therapist",
      "Nail Technician",
    ][i % 4],
    services: "all",
    commission: 20,
    salary: 45000,
    joined: "2024-01-01",
    start: 9,
    end: 20,
    breakStart: 13,
    breakEnd: 14,
    off: 0,
    status: "Active",
  }));
  const customers: RecordData[] = Array.from({ length: 210 }, (_, i) => ({
    id: "c" + i,
    name: names[i % 20] + (i >= 20 ? " " + (Math.floor(i / 20) + 1) : ""),
    branch: "b" + (i % 3),
    email: i === 0 ? "customer@salondemo.com" : `client${i}@example.com`,
    phone: "0300-" + String(7654300 + i),
    gender: i % 2 ? "Male" : "Female",
    dob: "1995-05-15",
    address: "Pakistan",
    registered: today(),
    tag: [
      "New Customer",
      "Regular Customer",
      "VIP Customer",
      "Inactive Customer",
    ][i % 4],
    notes: "Prefers gentle products",
    allergies: "None reported",
    points: 120,
  }));
  const appointments: RecordData[] = Array.from({ length: 126 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + Math.floor(i / 24) - 2);
    return {
      id: "a" + i,
      name: "BK-" + String(1000 + i),
      branch: "b" + (i % 3),
      customer: "c" + (i % 30),
      service: "s" + (i % 7),
      staff: "t" + (i % 24),
      date: d.toLocaleDateString("en-CA"),
      time: "10:00",
      status: [
        "Confirmed",
        "Completed",
        "Pending",
        "Checked In",
        "Cancelled",
        "No Show",
      ][(Math.floor(i / 24) + i) % 6],
      payment: (Math.floor(i / 24) + i) % 6 === 1 ? "Paid" : "Unpaid",
      notes: "",
    };
  });
  const products: RecordData[] = Array.from({ length: 54 }, (_, i) => ({
    id: "p" + i,
    name:
      [
        "Argan Shampoo",
        "Hydrating Serum",
        "Massage Oil",
        "Nail Polish",
        "Repair Conditioner",
        "Facial Cleanser",
      ][i % 6] +
      " " +
      (Math.floor(i / 6) + 1),
    branch: "b" + (i % 3),
    category: [
      "Hair Care",
      "Skincare",
      "Massage Oils",
      "Nail Products",
      "Cosmetics",
      "Beauty Accessories",
    ][i % 6],
    sku: "SKU-" + (1000 + i),
    barcode: "8901000" + i,
    purchase: 700,
    price: 1200,
    quantity: i % 9 === 0 ? 3 : 20 + i,
    minimum: 5,
    supplier: "v" + (i % 5),
  }));
  const memberships: RecordData[] = Array.from({ length: 20 }, (_, i) => ({
    id: "m" + i,
    name:
      ["Basic", "Silver", "Gold", "Platinum", "VIP"][i % 5] +
      " " +
      ["Membership", "Beauty Package", "Wellness Plan", "Spa Ritual"][
        Math.floor(i / 5)
      ],
    branch: "all",
    price: [3000, 6000, 12000, 20000, 30000][i % 5],
    validity: 90,
    discount: 15,
    sessions: 7,
    benefits: "3 facials • 2 hair treatments • 2 manicures",
    status: "Active",
  }));
  const completed = appointments.filter((a) => a.status === "Completed");
  const payments: RecordData[] = Array.from({ length: 105 }, (_, i) => {
    const a = completed[i];
    const item = a
      ? services.find((s) => s.id === a.service)!
      : products[i % products.length];
    const amount = Number(item.price);
    return {
      id: "pay" + i,
      name: "INV-" + (1000 + i),
      branch: a?.branch || item.branch,
      customer: a?.customer || "c" + (i % 30),
      appointment: a?.id || "",
      amount,
      total: amount,
      method: [
        "Cash",
        "Card",
        "JazzCash",
        "Easypaisa",
        "Bank Transfer",
        "Wallet",
      ][i % 6],
      date: today(),
      status: "Paid",
      transaction: "DEMO-" + (10000 + i),
      items: JSON.stringify([
        {
          id: item.id,
          name: item.name,
          type: a ? "service" : "product",
          price: amount,
          quantity: 1,
        },
      ]),
    };
  });
  const expenses: RecordData[] = Array.from({ length: 36 }, (_, i) => ({
    id: "e" + i,
    name: [
      "Rent",
      "Salaries",
      "Utilities",
      "Product Purchases",
      "Equipment",
      "Marketing",
      "Maintenance",
      "Other Expenses",
    ][i % 8],
    category: [
      "Rent",
      "Salaries",
      "Utilities",
      "Product Purchases",
      "Equipment",
      "Marketing",
      "Maintenance",
      "Other Expenses",
    ][i % 8],
    branch: "b" + (i % 3),
    amount: 2000 + i * 400,
    date: today(),
    description: "Monthly business expense",
  }));
  const suppliers: RecordData[] = Array.from({ length: 5 }, (_, i) => ({
    id: "v" + i,
    name: [
      "Beauty Pro Pakistan",
      "Salon Essentials",
      "Glow Supplies",
      "Wellness Traders",
      "Nail House",
    ][i],
    branch: "all",
    email: `supplier${i}@example.com`,
    phone: "042-3456789",
    address: "Lahore, Pakistan",
    outstanding: i * 2000,
  }));
  return {
    branches,
    services,
    staff,
    customers,
    appointments,
    products,
    memberships,
    payments,
    expenses,
    suppliers,
    enrollments: [] as RecordData[],
    reviews: [] as RecordData[],
    loyalty: [] as RecordData[],
    leaves: [] as RecordData[],
    stock: [] as RecordData[],
    notifications: [
      {
        id: "n0",
        name: "Welcome to Maison",
        branch: "all",
        description: "Your salon, beautifully connected.",
        date: today(),
        read: "no",
      },
    ] as RecordData[],
  };
}
