const STORAGE_KEY = "wp-plugins-explorer-ui-v1";
const SORT_VALUES = new Set(["installation", "star", "updated", "new", "old"]);
const TYPE_VALUES = new Set(["author", "plugin", "tag"]);
const MAX_PAGE = 999;

export function loadPersistedUi() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    const page = Number.parseInt(p.currentPage, 10);
    return {
      searchType: TYPE_VALUES.has(p.searchType) ? p.searchType : "author",
      searchInput: typeof p.searchInput === "string" ? p.searchInput : "",
      author: typeof p.author === "string" ? p.author : "",
      pluginName: typeof p.pluginName === "string" ? p.pluginName : "",
      tagName: typeof p.tagName === "string" ? p.tagName : "",
      sortOption: SORT_VALUES.has(p.sortOption) ? p.sortOption : "installation",
      currentPage: Number.isFinite(page) ? Math.min(MAX_PAGE, Math.max(1, page)) : 1,
    };
  } catch {
    return null;
  }
}

export function savePersistedUi(snapshot) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* quota / private mode */
  }
}
