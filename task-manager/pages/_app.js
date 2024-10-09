import "../styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import 'styles/tailwind.css'

function MyApp({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId="350480669789-ihtcgbfgtj619sgc5vna4nrt33ptq3ta.apps.googleusercontent.com">
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}

export default MyApp;
