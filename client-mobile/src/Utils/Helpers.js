import NavigationService from "./NavigationServices";
//goToLogin Function on different js :
export function goToLogin() {
  NavigationService.navigate("Login");
}

export function goToError() {
  NavigationService.navigate("Error");
}
