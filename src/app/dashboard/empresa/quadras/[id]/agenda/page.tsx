'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useParams } from 'next/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from '@/lib/utils'
import { CalendarWrapper } from '@/components/ui/calendar-wrapper'
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import ThemeToggle from '@/components/ui/ThemeToggle';

interface Agendamento {
  id: string
  dataInicio: string
  dataFim: string
  nomeCliente: string
  telefoneCliente: string
  isWhatsapp: boolean
  email?: string
  status: string
  tipo: string
  observacoes?: string
}

interface FormData {
  nomeCliente: string
  telefoneCliente: string
  isWhatsapp: boolean
  email: string
  observacoes: string
  horarioInicio: string
  horarioFim: string
  status: string
  tipo: string
}

interface FormContextType {
  formData: FormData
  setFormData: (data: Partial<FormData>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

const FormContext = createContext<FormContextType | null>(null)

const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) throw new Error('useFormContext must be used within FormProvider')
  return context
}

// Horários disponíveis para agendamento
const HORARIOS = Array.from({ length: 32 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6 // Começa às 6h
  const minute = (i % 2) * 30
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
})

const formatDateToLocale = (date: Date) => {
  const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
  
  const weekday = weekdays[date.getDay()]
  const day = date.getDate()
  const month = months[date.getMonth()]
  
  return `${weekday}, ${day} de ${month}`
}

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 3) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`
  return `${numbers.slice(0, 2)} ${numbers.slice(2, 3)}${numbers.slice(3, 11)}`
}

const AgendamentoForm = () => {
  const { formData, setFormData, handleSubmit } = useFormContext()

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData({ telefoneCliente: formatted })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="horarioInicio">Horário Início</Label>
          <Input
            id="horarioInicio"
            type="time"
            value={formData.horarioInicio}
            onChange={(e) => setFormData({ horarioInicio: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="horarioFim">Horário Fim</Label>
          <Input
            id="horarioFim"
            type="time"
            value={formData.horarioFim}
            onChange={(e) => setFormData({ horarioFim: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nomeCliente">Nome do Cliente</Label>
        <Input
          id="nomeCliente"
          value={formData.nomeCliente}
          onChange={(e) => setFormData({ nomeCliente: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefoneCliente">Telefone</Label>
        <div className="flex items-center gap-2">
          <Input
            id="telefoneCliente"
            value={formData.telefoneCliente}
            onChange={handlePhoneChange}
            placeholder="51 999999999"
            required
          />
          <div className="flex items-center gap-2">
            <Checkbox
              id="isWhatsapp"
              checked={formData.isWhatsapp}
              onCheckedChange={(checked) => setFormData({ isWhatsapp: checked as boolean })}
            />
            <Label htmlFor="isWhatsapp" className="text-sm">WhatsApp</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email (opcional)</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ email: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo</Label>
          <Select
            value={formData.tipo}
            onValueChange={(value) => setFormData({ tipo: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eventual">Eventual</SelectItem>
              <SelectItem value="mensal">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({ observacoes: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  )
}

export default function AgendaPage() {
  const { theme, setTheme } = useTheme()
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [date, setDate] = useState<Date>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [formData, setFormData] = useState<FormData>({
    nomeCliente: '',
    telefoneCliente: '',
    isWhatsapp: false,
    email: '',
    observacoes: '',
    horarioInicio: '08:00',
    horarioFim: '09:00',
    status: 'pendente',
    tipo: 'eventual'
  })
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      loadAgendamentos()
    }
  }, [date, mounted])

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
          nomeCliente: formData.nomeCliente,
          telefoneCliente: formData.telefoneCliente,
          isWhatsapp: formData.isWhatsapp,
          email: formData.email,
          observacoes: formData.observacoes,
          status: formData.status,
          tipo: formData.tipo,
          dataInicio: dataInicio.toISOString(),
          dataFim: dataFim.toISOString(),
        }),
      })

      if (response.ok) {
        setFormData({
          nomeCliente: '',
          telefoneCliente: '',
          isWhatsapp: false,
          email: '',
          observacoes: '',
          horarioInicio: '08:00',
          horarioFim: '09:00',
          status: 'pendente',
          tipo: 'eventual'
        })
        loadAgendamentos()
        setIsSheetOpen(false)
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar agendamento')
      }
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      alert('Erro ao criar agendamento')
    }
  }

  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }, [])

  const isHorarioOcupado = (horario: string) => {
    const [hora, minuto] = horario.split(':')
    const horarioData = new Date(date)
    horarioData.setHours(parseInt(hora), parseInt(minuto), 0)
    
    return agendamentos.some(agendamento => {
      const inicio = new Date(agendamento.dataInicio)
      const fim = new Date(agendamento.dataFim)
      return horarioData >= inicio && horarioData < fim
    })
  }

  const getAgendamento = (horario: string) => {
    const [hora, minuto] = horario.split(':')
    const horarioData = new Date(date)
    horarioData.setHours(parseInt(hora), parseInt(minuto), 0)
    
    return agendamentos.find(agendamento => {
      const inicio = new Date(agendamento.dataInicio)
      const fim = new Date(agendamento.dataFim)
      return horarioData >= inicio && horarioData < fim
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'text-yellow-500 dark:text-yellow-400'
      case 'confirmado':
        return 'text-green-500 dark:text-green-400'
      case 'pago':
        return 'text-blue-500 dark:text-blue-400'
      default:
        return ''
    }
  }

  const formContextValue = {
    formData,
    setFormData: updateFormData,
    handleSubmit
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Coluna do Calendário */}
        <Card className="md:w-[350px] p-4">
          <CalendarWrapper
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
            disabled={!mounted}
          />
        </Card>

        {/* Coluna dos Horários */}
        <Card className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {mounted ? formatDateToLocale(date) : null}
            </h2>
            
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button disabled={!mounted}>Novo Agendamento</Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Novo Agendamento</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <FormContext.Provider value={formContextValue}>
                    <AgendamentoForm />
                  </FormContext.Provider>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-2">
              {mounted ? (
                HORARIOS.map((horario) => {
                  const agendamento = getAgendamento(horario)
                  const ocupado = isHorarioOcupado(horario)

                  return (
                    <div
                      key={horario}
                      className={cn(
                        "p-3 rounded-lg border",
                        ocupado 
                          ? "bg-primary/10 border-primary" 
                          : "hover:bg-accent cursor-pointer"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{horario}</span>
                        {agendamento && (
                          <div className="text-sm">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{agendamento.nomeCliente}</p>
                              <span className={cn("text-xs font-medium", getStatusColor(agendamento.status))}>
                                {agendamento.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <p>{agendamento.telefoneCliente}</p>
                              {agendamento.isWhatsapp && <span>📱</span>}
                              <span className="text-xs">{agendamento.tipo}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : null}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}
