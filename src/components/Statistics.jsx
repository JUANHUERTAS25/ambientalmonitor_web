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
  contaminacion: '#ef4444',
  erosion: '#eab308',
  agua: '#3b82f6',
  vegetacion: '#22c55e',
}

const categoryLabelMap = {
  contaminacion: 'Contaminación',
  erosion: 'Erosión',
  agua: 'Agua',
  vegetacion: 'Vegetación',
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
      acc[reg.categoria] = (acc[reg.categoria] || 0) + 1
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
     { name: 'Registros', value: registros.length },
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
         <h3 className="text-lg font-semibold mb-4">Total de Registros</h3>
         {registros.length > 0 ? (
           <div className="space-y-4">
             <div>
               <div className="flex justify-between mb-1">
                 <span className="text-sm text-gray-700">Total</span>
                 <span className="text-sm font-semibold text-gray-900">
                   {registros.length}
                 </span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2">
                 <div
                   className="bg-blue-600 h-2 rounded-full"
                   style={{
                     width: '100%',
                   }}
                 ></div>
               </div>
             </div>
           </div>
         ) : (
           <p className="text-gray-600">No hay datos disponibles</p>
         )}
       </div>
    </div>
  )
}
