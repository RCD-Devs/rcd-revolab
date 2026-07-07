import Header from "@/components/header";
import Footer from "@/components/footer";

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
