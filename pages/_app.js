import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <div className="app-background"></div>
      <Component {...pageProps} />
    </>
  );
}