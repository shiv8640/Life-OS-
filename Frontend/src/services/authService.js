const USER_KEY = "lifeos-user";
export const authService = {
  current: () => JSON.parse(localStorage.getItem(USER_KEY) || "null"),
  login: (credentials) => {
    const derived = (credentials.email || "")
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (x) => x.toUpperCase());
    const previous = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        name: credentials.name || previous?.name || derived || "Friend",
        email: credentials.email || previous?.email || "",
      }),
    );
  },
  logout: () => localStorage.removeItem(USER_KEY),
};
