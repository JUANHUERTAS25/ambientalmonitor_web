import { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

const CATEGORIES = [
  { value: 'degradacion', label: 'Degradación', color: 'red' },
  { value: 'flora', label: 'Flora', color: 'green' },
  { value: 'fauna', label: 'Fauna', color: 'yellow' },
  { value: 'recurso_hidrico', label: 'Recurso Hídrico', color: 'blue' },
  { value: 'incendio', label: 'Incendio', color: 'orange' },
  { value: 'otro', label: 'Otro', color: 'gray' },
]

export default function DataTable({ registros, loading, onFilter }) {
  const [filters, setFilters] = useState({
    categoria: '',
    busqueda: '',
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const getCategoryInfo = (tipo) => {
    return CATEGORIES.find((c) => c.value === tipo)
  }

  const getCategoryColor = (tipo) => {
    const cat = getCategoryInfo(tipo)
    const colorMap = {
      red: 'bg-red-100 text-red-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      orange: 'bg-orange-100 text-orange-800',
      gray: 'bg-gray-100 text-gray-800',
    }
    return colorMap[cat?.color] || 'bg-gray-100 text-gray-800'
  }

  const filteredRegistros = registros.filter((reg) => {
    if (filters.categoria && reg.tipo_observacion !== filters.categoria) {
      return false
    }
    if (filters.busqueda) {
      const search = filters.busqueda.toLowerCase()
      return (
        reg.descripcion.toLowerCase().includes(search) ||
        reg.tipo_observacion.toLowerCase().includes(search)
      )
    }
    return true
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={filters.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todas las categorías</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar en descripción..."
                value={filters.busqueda}
                onChange={(e) => handleFilterChange('busqueda', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">Cargando registros...</div>
        ) : filteredRegistros.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No se encontraron registros</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRegistros.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(reg.tipo_observacion)}`}>
                        {getCategoryInfo(reg.tipo_observacion)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <p className="line-clamp-2">{reg.descripcion}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p>{reg.latitud.toFixed(4)}</p>
                      <p>{reg.longitud.toFixed(4)}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(reg.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${reg.sincronizado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {reg.sincronizado ? 'Sincronizado' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        {!loading && filteredRegistros.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-600">
            Mostrando {filteredRegistros.length} de {registros.length} registros
          </div>
        )}
      </div>
    </div>
  )
}
