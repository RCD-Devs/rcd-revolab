export default function Login() {
  return (
    <section className="">
      <div className="container">
        <h1>Login</h1>
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </section>
  );
}
