const includes = (text: string, pattern: string): boolean => {
  return text.toLowerCase().includes(pattern.toLowerCase());
};

export const filter = (rows: any[], pattern: string): any[] => {
  return rows.filter(
    (row) =>
      !!Object.values(row).find((value) => includes(String(value), pattern)),
  );
};
