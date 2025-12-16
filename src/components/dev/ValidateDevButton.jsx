import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { canPerformAction } from "../../utils/permissions";

const ValidateDevButton = ({onClick}) => {
    const {role} = useAuth();
    const {theme} = useTheme();

    if (!canPerformAction(role, 'validate')) return null;

    return (
      <button 
        onClick={onClick}
        className={`
            px-4 py-2 rounded font-semibold transition
            ${theme === 'light' 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-blue-700 text-gray-100 hover:bg-blue-800'}
        `}
        >
        Valider
      </button>
    )
}

export default ValidateDevButton;
