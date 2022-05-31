const USERS_API = "https://615485ee2473940017efaed3.mockapi.io/assessment";

export const getUserData = async () => {
    const response = await fetch(USERS_API);
    const data = await response.json();
    return data;
}