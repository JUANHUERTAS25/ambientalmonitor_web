import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Define custom icons for each category
const createIcon = (color) => {
  return L.divIcon({
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full bg-${color}-500 border-2 border-white shadow-lg">
        <div class="w-4 h-4 bg-${color}-600 rounded-full"></div>
      </div>
    `,
    iconSize: [32, 32],
    className: 'custom-marker',
  })
}

// Color mapping for categories
const categoryColorMap = {
  contaminacion: 'bg-red-500',
  erosion: 'bg-yellow-500',
  agua: 'bg-blue-500',
  vegetacion: 'bg-green-500',
  fauna: 'bg-purple-500',
}

const categoryLabelMap = {
  contaminacion: 'Contaminación',
  erosion: 'Erosión',
  agua: 'Agua',
  vegetacion: 'Vegetación',
  fauna: 'Fauna',
}

// Create proper Leaflet icons
const createCustomIcon = (color) => {
  const colorValue = color.replace('bg-', '').replace('-500', '')
  const colorMap = {
    red: '#ef4444',
    green: '#22c55e',
    yellow: '#eab308',
    blue: '#3b82f6',
    purple: '#a855f7',
  }
  
  return L.icon({
    iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 41'%3E%3Cpath fill='${encodeURIComponent(colorMap[colorValue])}' d='M12.5 0C5.6 0 0 5.6 0 12.5 0 20.3 12.5 41 12.5 41s12.5-20.7 12.5-28.5C25 5.6 19.4 0 12.5 0z'/%3E%3C/svg%3E`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  })
}

export default function MapComponent({ registros, loading }) {
  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    )
  }

  if (registros.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">No hay registros para mostrar en el mapa</p>
      </div>
    )
  }

  // Calculate center of map from registros
  const centerLat = registros.reduce((sum, r) => sum + r.latitud, 0) / registros.length
  const centerLng = registros.reduce((sum, r) => sum + r.longitud, 0) / registros.length

  return (
    <div className="rounded-lg overflow-hidden shadow">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

         {registros.map((registro) => (
           <Marker
             key={registro.id}
             position={[registro.latitud, registro.longitud]}
             icon={createCustomIcon(
               categoryColorMap[registro.categoria] || 'bg-gray-500'
             )}
           >
             <Popup>
               <div className="w-64 space-y-2">
                 <div>
                   <h3 className="font-semibold text-gray-900">
                     {categoryLabelMap[registro.categoria] || 'Otro'}
                   </h3>
                 </div>
                <p className="text-sm text-gray-700">{registro.observacion}</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Coordenadas:</strong> {registro.latitud.toFixed(4)}, {registro.longitud.toFixed(4)}</p>
                  <p><strong>Fecha:</strong> {new Date(registro.created_at).toLocaleDateString('es-ES')}</p>
                  <p><strong>Estado:</strong> Sincronizado</p>
                </div>
                {registro.image_url && (
                  <img
                    src={registro.image_url}
                    alt="Observación"
                    className="w-full h-48 object-cover rounded mt-2"
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="bg-white p-4 border-t border-gray-200">
        <h4 className="font-semibold text-sm mb-3">Leyenda de Categorías</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(categoryLabelMap).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${categoryColorMap[key]}`}
              ></div>
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
