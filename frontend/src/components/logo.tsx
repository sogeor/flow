
import { Link } from "react-router-dom";

export function Logo({ size = "default" }: { size?: "default" | "large" }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className={`flex items-center gap-1.5 font-bold ${size === "large" ? "text-3xl" : "text-xl"}`}>
        <div className="flex items-center justify-center">
          <div className="bg-sogeor-800 text-white p-1 rounded-md">
            <span>S</span>
          </div>
        </div>
        <span>Sogeor <span className="text-sogeor-500">Flow</span></span>
      </div>
    </Link>
  );
}
