import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '../../auth/contexts/AuthContext'
import { useMenu } from '../contexts/MenuContext'
import LoadingSpinner from '../../general/components/ui/Loading'
import Button from '../../general/components/ui/Button'
import Alert from '../../general/components/ui/Alert'
import MenuForm from '../forms/MenuForm'
import MenuRating from '../components/MenuRating'

export default function MenuDashboard() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const { menuService } = useMenu()

  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingMenu, setEditingMenu] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = isAdmin
        ? await menuService.getAllMenus()
        : await menuService.getActiveMenus()
      setMenus(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [isAdmin])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await menuService.deleteMenu(id)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {isAdmin ? 'Menu Management' : 'Menu'}
        </h2>
        {isAdmin && !showForm && !editingMenu && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Menu
          </Button>
        )}
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {showForm && !editingMenu && (
        <MenuForm
          onSubmit={async (data) => {
            await menuService.createMenu(data)
            setShowForm(false)
            await load()
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menus.map((m) => (
          <div key={m.id} className="bg-white p-6 rounded shadow">
            {editingMenu?.id === m.id ? (
              <MenuForm
                menu={editingMenu}
                onSubmit={async (data) => {
                  await menuService.updateMenu(m.id, data)
                  setEditingMenu(null)
                  await load()
                }}
                onCancel={() => setEditingMenu(null)}
              />
            ) : (
              <>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">{m.name}</h3>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingMenu(m)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-600">{m.description}</p>
                <div className="mt-4 border-t pt-3">
                  <MenuRating menuId={m.id} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}