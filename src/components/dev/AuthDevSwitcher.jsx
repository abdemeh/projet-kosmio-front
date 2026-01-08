import { useAuth } from "../../hooks/useAuth"

const AuthDevSwitcher = () => {
    const { loginAs, logout, role } = useAuth();

    return (
        <div className="fixed bottom-4 right-4 bg-white text-black shadow-lg p-4 rounded space-y-3 text-sm z-50 w-auto">
            <div className="font-bold mb-2">DEV AUTH</div>
            <div className="mb-3">Role actuel: {role || 'NONE'}</div>

            <div className="flex justify-around flex-wrap gap-2">
                <button
                    className="text-black border border-gray-400 px-3 py-1 rounded hover:bg-gray-100"
                    onClick={() => loginAs('admin')}
                >
                    Admin
                </button>
                <button
                    className="text-black border border-gray-400 px-3 py-1 rounded hover:bg-gray-100"
                    onClick={() => loginAs('super_admin')}
                >
                    Super Admin
                </button>
                <button
                    className="text-black border border-gray-400 px-3 py-1 rounded hover:bg-gray-100"
                    onClick={() => loginAs('expert_co2')}
                >
                    Expert CO2
                </button>
                <button
                    className="text-black border border-gray-400 px-3 py-1 rounded hover:bg-gray-100"
                    onClick={() => loginAs('utilisateur')}
                >
                    Utilisateur
                </button>
                <button
                    className="text-black border border-gray-400 px-3 py-1 rounded hover:bg-gray-100"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default AuthDevSwitcher;