import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Global, ThemeTypes } from "@cheapreats/react-ui"


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Global theme={ThemeTypes.MAIN}>
      <Component {...pageProps} />
    </Global>
  );
}

export default MyApp
