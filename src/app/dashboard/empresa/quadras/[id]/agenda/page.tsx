'use client'

import { useEffect, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useParams } from 'next/navigation'

interface Agendamento {
  id: string
  dataInicio: string
  dataFim: string
  nomeCliente: string
  telefoneCliente: string
  email?: string
  status: string
  observacoes?: string
}

export default function AgendaPage() {
  const params = useParams()
  const [date, setDate] = useState<Date>(new Date())
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nomeCliente: '',
    telefoneCliente: '',
    email: '',
    observacoes: '',
    horarioInicio: '08:00',
    horarioFim: '09:00'
  })

  useEffect(() => {
    loadAgendamentos()
  }, [date])

  const loadAgendamentos = async () => {
    const inicio = new Date(date)
    inicio.setHours(0, 0, 0, 0)
    const fim = new Date(date)
    fim.setHours(23, 59, 59, 999)

    try {
      const response = await fetch(
        `/api/quadras/${params.id}/agendamentos?inicio=${inicio.toISOString()}&fim=${fim.toISOString()}`
      )
      if (response.ok) {
        const data = await response.json()
        setAgendamentos(data)
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const [horaInicio, minutoInicio] = formData.horarioInicio.split(':')
    const [horaFim, minutoFim] = formData.horarioFim.split(':')

    const dataInicio = new Date(date)
    dataInicio.setHours(parseInt(horaInicio), parseInt(minutoInicio), 0)

    const dataFim = new Date(date)
    dataFim.setHours(parseInt(horaFim), parseInt(minutoFim), 0)

    try {
      const response = await fetch(`/api/quadras/${params.id}/agendamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dataInicio,
          dataFim,
        }),
      })

      if (response.ok) {
        setShowForm(false)
        loadAgendamentos()
        setFormData({
          nomeCliente: '',
          telefoneCliente: '',
          email: '',
          observacoes: '',
          horarioInicio: '08:00',
          horarioFim: '09:00'
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar agendamento')
      }
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      alert('Erro ao criar agendamento')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Agenda da Quadra</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            className="rounded-md border"
          />
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Agendamentos para {date.toLocaleDateString()}
            </h2>
            <Button onClick={() => setShowForm(true)}>Novo Agendamento</Button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horarioInicio">Horário Início</Label>
                  <Input
                    id="horarioInicio"
                    type="time"
                    value={formData.horarioInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, horarioInicio: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horarioFim">Horário Fim</Label>
                  <Input
                    id="horarioFim"
                    type="time"
                    value={formData.horarioFim}
                    onChange={(e) =>
                      setFormData({ ...formData, horarioFim: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomeCliente">Nome do Cliente</Label>
                <Input
                  id="nomeCliente"
                  value={formData.nomeCliente}
                  onChange={(e) =>
                    setFormData({ ...formData, nomeCliente: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefoneCliente">Telefone</Label>
                <Input
                  id="telefoneCliente"
                  value={formData.telefoneCliente}
                  onChange={(e) =>
                    setFormData({ ...formData, telefoneCliente: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData({ ...formData, observacoes: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Salvar</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {agendamentos.length === 0 ? (
              <p className="text-gray-500">Nenhum agendamento para este dia</p>
            ) : (
              agendamentos.map((agendamento) => (
                <Card key={agendamento.id} className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{agendamento.nomeCliente}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(agendamento.dataInicio).toLocaleTimeString()} - {new Date(agendamento.dataFim).toLocaleTimeString()}
                      </p>
                      <p className="text-sm">{agendamento.telefoneCliente}</p>
                      {agendamento.observacoes && (
                        <p className="text-sm text-gray-500 mt-1">
                          {agendamento.observacoes}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        agendamento.status === 'confirmado'
                          ? 'bg-green-100 text-green-800'
                          : agendamento.status === 'cancelado'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {agendamento.status}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
