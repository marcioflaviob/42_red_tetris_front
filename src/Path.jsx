import HomePage from "./base/HomePage";
import ErrorPage from "./pages/ErrorPage";

export const PATHS = [
	{path: '', component: <HomePage/>},
	{path: '*', component: <ErrorPage /> }
];