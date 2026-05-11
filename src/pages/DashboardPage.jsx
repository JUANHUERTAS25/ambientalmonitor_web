import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useRegistros } from '../hooks/useRegistros'
import DataTable from '../components/DataTable'
import MapComponent from '../components/MapComponent'
import Statistics from '../components/Statistics'
import ExportButtons from '../components/ExportButtons'
import { LogOut, BarChart3, CheckCircle, Clock, Shield } from 'lucide-react'

export default function DashboardPage() {
  const { user, profile, isAdmin, logout } = useAuth()
  const { registros, loading, fetchRegistros } = useRegistros()
  const [filters, setFilters] = useState({})
  const navigate = useNavigate()

  const handleLogout = async () => {
    const { error } = await logout()
    if (!error) {
      navigate('/login')
    }
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    // Apply filters when needed
    fetchRegistros(newFilters)
  }

  // Calculate statistics
  const totalRegistros = registros.length
  const sincronizados = registros.length // Todos están sincronizados
  const pendientes = 0 // No hay campo sincronizado en la tabla actual

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Ambiental Monitor
            </h1>
            <p className="text-gray-600">
              {isAdmin ? 'Panel de Administrador' : 'Panel de Usuario'}
            </p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Shield size={20} />
                Panel Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Información de Usuario</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Rol:</strong> <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
              {profile?.rol === 'admin' ? 'Administrador' : 'Usuario Normal'}
            </span></p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total de Registros</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{totalRegistros}</p>
              </div>
              <BarChart3 size={32} className="text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Sincronizados</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{sincronizados}</p>
              </div>
              <CheckCircle size={32} className="text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pendientes</p>
                <p className="text-4xl font-bold text-yellow-600 mt-2">{pendientes}</p>
              </div>
              <Clock size={32} className="text-yellow-600" />
            </div>
          </div>
        </div>

        {/* DataTable */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Registros de Observaciones</h2>
          <DataTable
            registros={registros}
            loading={loading}
            onFilter={handleFilter}
          />
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Mapa de Observaciones</h2>
          <MapComponent registros={registros} loading={loading} />
        </div>

        {/* Statistics Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Estadísticas Detalladas</h2>
            <ExportButtons registros={registros} />
          </div>
          <Statistics registros={registros} loading={loading} />
        </div>
      </main>
    </div>
  )
}
