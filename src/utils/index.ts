export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  date.setHours(date.getHours() - 3);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const generateRandomColor = () => {
  return "#" + Math.random().toString(16).substr(-6);
};

export const formatPlate = (plate: string) => {
  if (!plate) return "";
  let newPlate = plate.replace(/[^A-Za-z0-9]/, "").toUpperCase();
  const matchs = Array.from(
    newPlate.matchAll(/([A-z]{3})(\d)([A-j0-9])(\d{2})/g),
  );
  const partials = [];
  if (matchs.length > 0) {
    partials.push(matchs[0][1]);
    if (!isNaN(Number.parseInt(matchs[0][3]))) {
      partials.push("-");
    }
    partials.push(matchs[0][2]);
    partials.push(matchs[0][3]);
    partials.push(matchs[0][4]);
    newPlate = partials.join("").toUpperCase();
  }

  return newPlate;
};

export const formatCellphone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d{1})/, "($1) $2")
    .replace(/(\d{1})(\d{4})(\d{1,4})/, "$1 $2-$3")
    .slice(0, 16);
};
export const formatCep = (value: string) => {
  if (!value) return "";
  const rawValue = value.replace(/\D/g, "");
  return rawValue.replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
};

export const getOperationValue = (value: string | null): boolean | null => {
  switch (value) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return null;
  }
};

export const colorHex = (colorRGB: string) =>
  ((colorRGB as unknown as number) >>> 0).toString(16).padStart(6, "0");
