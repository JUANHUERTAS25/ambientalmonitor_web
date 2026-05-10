import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = {
  degradacion: '#ef4444',
  flora: '#22c55e',
  fauna: '#eab308',
  recurso_hidrico: '#3b82f6',
  incendio: '#f97316',
  otro: '#6b7280',
}

const categoryLabelMap = {
  degradacion: 'Degradación',
  flora: 'Flora',
  fauna: 'Fauna',
  recurso_hidrico: 'Recurso Hídrico',
  incendio: 'Incendio',
  otro: 'Otro',
}

export default function Statistics({ registros, loading }) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  // Prepare data for category pie chart
  const categoryData = Object.entries(
    registros.reduce((acc, reg) => {
      acc[reg.tipo_observacion] = (acc[reg.tipo_observacion] || 0) + 1
      return acc
    }, {})
  ).map(([tipo, count]) => ({
    name: categoryLabelMap[tipo],
    value: count,
    tipo,
  }))

  // Prepare data for timeline chart (registros by date)
  const dateData = registros.reduce((acc, reg) => {
    const date = new Date(reg.created_at).toLocaleDateString('es-ES')
    const existing = acc.find((item) => item.date === date)
    if (existing) {
      existing.count += 1
    } else {
      acc.push({ date, count: 1 })
    }
    return acc
  }, [])

  // Prepare data for sync status
  const syncData = [
    { name: 'Sincronizado', value: registros.filter((r) => r.sincronizado).length },
    { name: 'Pendiente', value: registros.filter((r) => !r.sincronizado).length },
  ]

  return (
    <div className="space-y-6">
      {/* Distribution by Category */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Distribución por Categoría</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry) => (
                  <Cell key={`cell-${entry.tipo}`} fill={COLORS[entry.tipo]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-600">No hay datos disponibles</p>
        )}
      </div>

      {/* Timeline Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Registros por Fecha</h3>
        {dateData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                name="Cantidad de Registros"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-600">No hay datos disponibles</p>
        )}
      </div>

      {/* Sync Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Estado de Sincronización</h3>
        {syncData[0].value > 0 || syncData[1].value > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={syncData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#22c55e" />
                <Cell fill="#eab308" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-600">No hay datos disponibles</p>
        )}
      </div>
    </div>
  )
}
