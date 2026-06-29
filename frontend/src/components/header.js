import Link from "next/link";

export default function Header() {
  return (
    <header>
        <div className="container">
            <nav>
                <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/login">Login</Link>
                </li>
                </ul>
            </nav>
        </div>
    </header>
  );
}