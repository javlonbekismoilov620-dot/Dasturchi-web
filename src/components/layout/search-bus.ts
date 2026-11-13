export const SEARCH_EVENT = "dch:open-search";

export function openSearch() {
  window.dispatchEvent(new Event(SEARCH_EVENT));
}
