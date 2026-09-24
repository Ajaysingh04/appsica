export interface ITechItem {
  name: string;
  icon: string;
}

export interface ITechCategory {
  _id?: string;
  category: string;
  items: ITechItem[];
  order?: number;
  published?: boolean;
}
