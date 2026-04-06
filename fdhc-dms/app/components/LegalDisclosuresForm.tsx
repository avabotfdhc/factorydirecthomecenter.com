'use client'

import { useState } from 'react'
import { AlertTriangle, Info } from 'lucide-react'

interface Disclosure {
  id: string
  title: string
  description: string
  required: boolean
  stateSpecific?: string[]
}

const disclosures: Disclosure[] = [
  {
    id: 'asbestos',
    title: 'Asbestos Disclosure',
    description: 'I acknowledge that I have received information about asbestos in manufactured homes built before 1977.',
    required: false,
  },
  {
    id: 'lead_paint',
    title: 'Lead-Based Paint Disclosure',
    description: 'I acknowledge that I have received the Lead-Based Paint disclosure for homes built before 1978.',
    required: false,
  },
  {
    id: 'formaldehyde',
    title: 'Formaldehyde Emissions Disclosure',
    description: 'I acknowledge that I have received information about formaldehyde emissions in manufactured housing.',
    required: true,
  },
  {
    id: 'mold',
    title: 'Mold and Moisture Disclosure',
    description: 'I acknowledge that I have received information about mold and moisture control in manufactured homes.',
    required: false,
  },
]

interface LegalDisclosuresFormProps {
  deliveryState: string
  acknowledgments: {
    asbestos: boolean
    lead_paint: boolean
    formaldehyde: boolean
    mold: boolean
    cooling_off_waived: boolean
  }
  onChange: (acknowledgments: any) => void
}

export function LegalDisclosuresForm({ 
  deliveryState, 
  acknowledgments, 
  onChange 
}: LegalDisclosuresFormProps) {
  const [showCoolingOffInfo, setShowCoolingOffInfo] = useState(false)

  const handleToggle = (id: string) => {
    onChange({
      ...acknowledgments,
      [id]: !acknowledgments[id as keyof typeof acknowledgments]
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Legal Disclosures & Compliance</h2>
      
      {/* State Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Delivery State: {deliveryState}</p>
            <p className="text-sm text-blue-700 mt-1">
              This agreement will be configured for {deliveryState} state compliance requirements including 
              tax calculations, cooling-off period, and required disclosures.
            </p>
          </div>
        </div>
      </div>

      {/* Required Disclosures */}
      <div className="space-y-4 mb-6">
        <h3 className="font-medium text-slate-900">Required Disclosures</h3>
        
        {disclosures.filter(d => d.required).map((disclosure) => (
          <label 
            key={disclosure.id}
            className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={acknowledgments[disclosure.id as keyof typeof acknowledgments] as boolean}
              onChange={() => handleToggle(disclosure.id)}
              className="mt-1 w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <p className="font-medium text-slate-900">{disclosure.title}</p>
              <p className="text-sm text-slate-600">{disclosure.description}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Optional Disclosures */}
      <div className="space-y-4 mb-6">
        <h3 className="font-medium text-slate-900">Additional Disclosures</h3>
        
        {disclosures.filter(d => !d.required).map((disclosure) => (
          <label 
            key={disclosure.id}
            className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={acknowledgments[disclosure.id as keyof typeof acknowledgments] as boolean}
              onChange={() => handleToggle(disclosure.id)}
              className="mt-1 w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <p className="font-medium text-slate-900">{disclosure.title}</p>
              <p className="text-sm text-slate-600">{disclosure.description}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Cooling-Off Period */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-slate-900">Cooling-Off Period</h3>
            <p className="text-sm text-slate-600 mt-1">
              Federal law provides a 3-day cooling-off period for manufactured home purchases. 
              The buyer has 3 business days to cancel the agreement without penalty.
            </p>
          </div>
        </div>

        <label className="flex items-start gap-3 p-3 border border-amber-200 bg-amber-50 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={acknowledgments.cooling_off_waived}
            onChange={() => handleToggle('cooling_off_waived')}
            className="mt-1 w-4 h-4 text-amber-600 rounded"
          />
          <div>
            <p className="font-medium text-amber-900">Waive Cooling-Off Period</p>
            <p className="text-sm text-amber-700">
              Check this box ONLY if the buyer explicitly requests to waive their cooling-off period rights. 
              This requires additional documentation and manager approval.
            </p>
          </div>
        </label>
      </div>

      {/* HUD Compliance Notice */}
      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <h3 className="font-medium text-slate-900 mb-2">HUD Compliance</h3>
        <p className="text-sm text-slate-600">
          This agreement includes all required HUD disclosures including:
        </p>
        <ul className="text-sm text-slate-600 list-disc list-inside mt-2 space-y-1">
          <li>Installation standards compliance (24 CFR 3285)</li>
          <li>HUD label verification</li>
          <li>Manufacturer warranty information</li>
          <li>Dealer warranty terms</li>
        </ul>
      </div>
    </div>
  )
}
