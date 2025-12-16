import { useAuth } from "../../hooks/useAuth"

const AuthDevSwitcher = () => {
    const { loginAs, logout, role } = useAuth();

    return (
        <div className="fixed bottom-4 right-4 bg-white shadow p-3 rounded space-y-2 text-sm">
            <div className="font-bold">DEV AUTH</div>
            <div>Role actuel: {role || 'NONE'}</div>

            <button onClick={()=> loginAs('admin')}>Admin</button>
            <button onClick={()=> loginAs('super_admin')}>Super Admin</button>
            <button onClick={()=> loginAs('expert_co2')}>Expert CO2</button>
            <button onClick={()=> loginAs('utilisateur')}>Utilisateur</button>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default AuthDevSwitcher;