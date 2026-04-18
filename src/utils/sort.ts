import { SortOrder } from 'src/types';

export function getSortCb<T>({
  order,
  sortBy,
}: {
  order: SortOrder;
  sortBy: keyof T;
}) {
  return (a: T, b: T) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    if (valA < valB) return order === SortOrder.ASC ? -1 : 1;

    if (valA > valB) return order === SortOrder.ASC ? 1 : -1;

    return 0;
  };
}
