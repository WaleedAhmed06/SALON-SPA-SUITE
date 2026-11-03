export type Line = {
  id: string;
  name: string;
  type: "service" | "product";
  price: number;
  quantity: number;
};

export type SaleLine = Line;
