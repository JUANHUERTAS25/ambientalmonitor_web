import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export const useRegistros = () => {
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRegistros = async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('registro_santurban')
        .select(`
          id,
          user_id,
          tipo_observacion,
          descripcion,
          latitud,
          longitud,
          imagen_url,
          created_at,
          sincronizado
        `)

      // Apply filters
      if (filters.tipo_observacion) {
        query = query.eq('observacion', filters.tipo_observacion)
      }

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate)
      }

      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate)
      }

      if (filters.usuarioId) {
        query = query.eq('user_id', filters.usuarioId)
      }

      // Order by creation date descending
      query = query.order('created_at', { ascending: false })

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setRegistros(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching registros:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistros()
  }, [])

  return { registros, loading, error, fetchRegistros }
}
