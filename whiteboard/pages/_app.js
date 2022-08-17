import "../styles/globals.css";
import { Provider, useSelector } from "react-redux";
import { store } from "../store";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
