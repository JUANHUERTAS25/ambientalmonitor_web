import { Download, FileText } from 'lucide-react'
import { exportToCSV, exportToPDF } from '../utils/export'

export default function ExportButtons({ registros }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() =>
          exportToCSV(registros, `registros-${new Date().toISOString().split('T')[0]}.csv`)
        }
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <Download size={18} />
        Exportar CSV
      </button>
      <button
        onClick={() =>
          exportToPDF(registros, `registros-${new Date().toISOString().split('T')[0]}.pdf`)
        }
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <FileText size={18} />
        Exportar PDF
      </button>
    </div>
  )
}
