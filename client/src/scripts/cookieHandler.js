// Function to set a cookie with an object as its value
export function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
  
    // Convert the object to a string using JSON.stringify
    const stringValue = btoa(JSON.stringify(value));
  
    document.cookie = name + "=" + encodeURIComponent(stringValue) + ";" + expires + ";path=/";
  }
  
  // Function to get the value of a cookie and parse it as an object
export function getCookie(name) {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        const cookieValue = cookie.substring(name.length + 1);
        // Decode and parse the stringified object using JSON.parse
        return JSON.parse(atob(decodeURIComponent(cookieValue)));
      }
    }
    
    return null;
}

export const deleteCookie = (name) => {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};
