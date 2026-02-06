import { useLocation, NavLink } from "react-router-dom";
import { canPerformAction } from "../utils/permissions";
import { useAuth } from "../hooks/useAuth";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

const ErrorPage = () => {
  const { role } = useAuth();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const action = query.get("action") || "create";
  const url = query.get("url") || "/";

  const hasPermission = canPerformAction(role, action);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      {hasPermission ? (
        <div className="bg-white p-10 rounded-2xl shadow-soft border border-gray-100 max-w-md w-full animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <RotateCcw size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Permission accordée</h1>
          <p className="text-gray-500 mb-8">Vous avez maintenant les droits nécessaires pour accéder à cette page.</p>

          <NavLink
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-gray-900 font-medium rounded-xl hover:bg-primary-light transition-colors"
          >
            <Home size={18} />
            Revenir à la page d'accueil
          </NavLink>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-2xl shadow-soft border border-red-100 max-w-md w-full animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h1>
          <p className="text-gray-500 mb-2">
            Vous n'avez pas les permissions nécessaires pour effectuer l'action : <span className="font-mono text-red-500 bg-red-50 px-2 py-0.5 rounded text-sm">{action}</span>.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Veuillez vous connecter avec un compte disposant des droits suffisants.
          </p>
        </div>
      )}
    </div>
  );
};

export default ErrorPage;
