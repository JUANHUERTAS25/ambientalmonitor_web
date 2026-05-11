import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUsers } from '../hooks/useUsers'
import { useRegistros } from '../hooks/useRegistros'
import { LogOut, Shield } from 'lucide-react'

export default function AdminPanel() {
  const { profile, logout, isAdmin } = useAuth()
  const { users, loading: usersLoading, updateUserRole } = useUsers()
  const { registros } = useRegistros()
  const navigate = useNavigate()

  // Redirect if not admin
  if (!isAdmin) {
    navigate('/dashboard')
    return null
  }

  const handleLogout = async () => {
    const { error } = await logout()
    if (!error) {
      navigate('/login')
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    const { error } = await updateUserRole(userId, newRole)
    if (error) {
      alert(`Error al actualizar rol: ${error}`)
    } else {
      alert('Rol actualizado exitosamente')
    }
  }

  // Calculate statistics
  const totalRegistros = registros.length
  const pendingRegistros = registros.filter((r) => !r.sincronizado).length
  const categoryCounts = registros.reduce((acc, reg) => {
    acc[reg.observacion] = (acc[reg.observacion] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield size={32} className="text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Panel de Administrador
              </h1>
              <p className="text-purple-100">Gestión de aplicación</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total de Usuarios</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{users.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total de Registros</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{totalRegistros}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Registros Pendientes</p>
            <p className="text-4xl font-bold text-yellow-600 mt-2">{pendingRegistros}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Administradores</p>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              {users.filter((u) => u.rol === 'admin').length}
            </p>
          </div>
        </div>

        {/* Users Management */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
          </div>
          {usersLoading ? (
            <div className="p-6 text-center text-gray-600">Cargando usuarios...</div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-gray-600">No hay usuarios registrados</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Registros
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => {
                    const userRegistros = registros.filter((r) => r.user_id === user.id)
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {user.rol === 'admin' ? 'Administrador' : 'Usuario Normal'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {userRegistros.length}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <select
                            value={user.rol}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="usuario">Usuario Normal</option>
                            <option value="admin">Administrador</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Registros por Categoría</h3>
            {Object.keys(categoryCounts).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">
                      {category.replace(/_/g, ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(count / totalRegistros) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No hay datos disponibles</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Estado de Sincronización</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">Sincronizados</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {registros.filter((r) => r.sincronizado).length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${totalRegistros > 0 ? (registros.filter((r) => r.sincronizado).length / totalRegistros) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">Pendientes</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {pendingRegistros}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{
                      width: `${totalRegistros > 0 ? (pendingRegistros / totalRegistros) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
