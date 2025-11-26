export interface Filters {
  search: string;
  dateStart: string;
  dateEnd: string;

  sortField: string;
  sortDirection: "asc" | "desc";
}
