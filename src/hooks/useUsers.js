import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export const useUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('perfiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setUsers(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const updateUserRole = async (userId, newRole) => {
    try {
      const { error: updateError } = await supabase
        .from('perfiles')
        .update({ rol: newRole, updated_at: new Date() })
        .eq('id', userId)

      if (updateError) throw updateError
      
      // Update local state
      setUsers(users.map((user) =>
        user.id === userId ? { ...user, rol: newRole } : user
      ))
      return { error: null }
    } catch (err) {
      console.error('Error updating user role:', err)
      return { error: err.message }
    }
  }

  return { users, loading, error, fetchUsers, updateUserRole }
}
