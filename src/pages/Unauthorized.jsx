import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🚫 دسترسی غیرمجاز</h1>
      <p>شما اجازه دسترسی به این بخش را ندارید.</p>

      <Link to={"/dashboard"}>بازگشت به صفحه اصلی</Link>
    </div>
  );
}
