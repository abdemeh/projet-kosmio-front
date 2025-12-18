import { useLocation, NavLink } from "react-router-dom";
import { canPerformAction } from "../utils/permissions";
import { useAuth } from "../hooks/useAuth";

const ErrorPage = () => {
  const { role } = useAuth();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const action = query.get("action") || "create";
  const url = query.get("url") || "/";

  return (
    <div className="p-4 text-center">
      {canPerformAction(role, action) ? (
        <NavLink
          to={url}
          className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Revenir à la page précédente
        </NavLink>
      ) : (
        <h1 className="text-red-600">
          Vous n'avez pas la permission nécessaire. Veuillez changer d'utilisateur
        </h1>
      )}
    </div>
  );
};

export default ErrorPage;
