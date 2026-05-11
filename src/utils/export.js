import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const categoryLabelMap = {
  degradacion: 'Degradación',
  flora: 'Flora',
  fauna: 'Fauna',
  recurso_hidrico: 'Recurso Hídrico',
  incendio: 'Incendio',
  otro: 'Otro',
}

export const exportToCSV = (registros, fileName = 'registros.csv') => {
  const headers = ['ID', 'Tipo', 'Descripción', 'Latitud', 'Longitud', 'Fecha', 'Estado']
  
   const rows = registros.map((reg) => [
     reg.id,
     categoryLabelMap[reg.observacion] || reg.observacion,
     reg.observacion,
     reg.latitud.toFixed(4),
     reg.longitud.toFixed(4),
     new Date(reg.created_at).toLocaleDateString('es-ES'),
     'Sincronizado',
   ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          // Escape commas and quotes in cell values
          if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell
        })
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToPDF = (registros, fileName = 'registros.pdf') => {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(16)
  doc.text('Reporte de Registros - Ambiental Monitor', 14, 15)
  
  // Add generation date
  doc.setFontSize(10)
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`, 14, 25)
  
   // Add statistics
   doc.setFontSize(11)
   doc.text(`Total de Registros: ${registros.length}`, 14, 35)
   doc.text(`Estado: Sincronizados`, 14, 42)

  // Add table
   const tableData = registros.map((reg) => [
     categoryLabelMap[reg.observacion] || reg.observacion,
     reg.observacion.substring(0, 30) + (reg.observacion.length > 30 ? '...' : ''),
     reg.latitud.toFixed(4),
     reg.longitud.toFixed(4),
     new Date(reg.created_at).toLocaleDateString('es-ES'),
     'Sincronizado',
   ])

  autoTable(doc, {
    head: [['Tipo', 'Descripción', 'Lat', 'Lng', 'Fecha', 'Estado']],
    body: tableData,
    startY: 60,
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: 255,
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: 50,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 40 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 },
    },
  })

  doc.save(fileName)
}
