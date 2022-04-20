const MAX_TEXT_SEARCH_LENGTH = 256;

const includes = (text: string, pattern: string): boolean => {
  return text.toLowerCase().includes(pattern.toLowerCase());
};

export const filter = (rows: any[], pattern: string): any[] => {
  return rows.filter(
    (row) =>
      !!Object.values(row).find(
        (value) =>
          String(value).length <= MAX_TEXT_SEARCH_LENGTH &&
          includes(String(value), pattern),
      ),
  );
};
