import {
  FolderTree,
  LayoutGrid,
  ShoppingBag,
  Home,
  Car,
  Utensils,
  PiggyBank,
  Heart,
  Briefcase,
  Laptop,
  Building,
  Gift,
  Wallet,
  Plane,
  Baby,
  Bike,
  Bus,
  Dumbbell,
  Gamepad2,
  FlaskConical,
  GraduationCap,
} from "lucide-react";

export const CATEGORY_ICONS = [
  { value: "folder", label: "Padrão", Icon: FolderTree },
  { value: "grid", label: "Organização", Icon: LayoutGrid },
  { value: "shopping", label: "Compras", Icon: ShoppingBag },
  { value: "home", label: "Casa", Icon: Home },
  { value: "car", label: "Transporte", Icon: Car },
  { value: "food", label: "Alimentação", Icon: Utensils },
  { value: "savings", label: "Poupança", Icon: PiggyBank },
  { value: "health", label: "Saúde", Icon: Heart },
  { value: "work", label: "Trabalho", Icon: Briefcase },
  { value: "tech", label: "Tecnologia", Icon: Laptop },
  { value: "office", label: "Escritório", Icon: Building },
  { value: "gifts", label: "Presentes", Icon: Gift },
  { value: "wallet", label: "Carteira", Icon: Wallet },
  { value: "travel", label: "Viagem", Icon: Plane },
  { value: "baby", label: "Infantil", Icon: Baby },
  { value: "bike", label: "Bike", Icon: Bike },
  { value: "bus", label: "Ônibus", Icon: Bus },
  { value: "gym", label: "Academia", Icon: Dumbbell },
  { value: "games", label: "Jogos", Icon: Gamepad2 },
  { value: "science", label: "Ciência", Icon: FlaskConical },
  { value: "study", label: "Estudos", Icon: GraduationCap },
];


export function getCategoryIcon(icon?: string | null) {
  return CATEGORY_ICONS.find(i => i.value === icon) ?? CATEGORY_ICONS[0];
}
