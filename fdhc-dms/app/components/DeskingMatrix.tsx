'use client'

import React, { useState, useMemo } from 'react'
import { Calculator, Home, Map, ArrowRight, DollarSign } from 'lucide-react'
import { formatCurrency, calculateMonthlyPayment } from '@/app/lib/utils'
import { DeskingScenario, DeskingCosts } from '@/app/types'

const defaultScenarios: DeskingScenario[] = [
  {
    id: 1,
    name: 'Chattel - Minimum Down',
    type: 'CHATTEL',
    downPercent: 5,
    termYears: 20,
    rate: 8.99,
    includeSitePrep: false
  },
  {
    id: 2,
    name: 'Chattel - Standard',
    type: 'CHATTEL',
    downPercent: 10,
    termYears: 20,
    rate: 8.49,
    includeSitePrep: false
  },
  {
    id: 3,
    name: 'Land-Home - FHA/Conventional',
    type: 'LAND_HOME',
    downPercent: 20,
    termYears: 30,
    rate: 6.75,
    includeSitePrep: true
  }
]

export default function DeskingMatrix() {
  const [costs, setCosts] = useState<DeskingCosts>({
    basePrice: 115000,
    optionsPrice: 12500,
    freightSetup: 18000,
    sitePrep: 25000,
    tradeIn: 0
  })

  const [scenarios] = useState<DeskingScenario[]>(defaultScenarios)

  const calculateTotalCost = (scenario: DeskingScenario): number => {
    let total = costs.basePrice + costs.optionsPrice + costs.freightSetup
    if (scenario.includeSitePrep) total += costs.sitePrep
    return total
  }

  const calculateAmountFinanced = (scenario: DeskingScenario): number => {
    const totalCost = calculateTotalCost(scenario)
    const netCost = totalCost - costs.tradeIn
    const downPayment = netCost * (scenario.downPercent / 100)
    return netCost - downPayment
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900">Deal Desking Matrix</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Calculator size={16} /> Compare Chattel vs. Land-Home financing scenarios
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Itemized Costs */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Home className="text-blue-600" size={20} /> Itemized Costs
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Home Invoice
                </label>
                <input
                  type="number"
                  value={costs.basePrice}
                  onChange={(e) => setCosts({...costs, basePrice: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Factory Options
                </label>
                <input
                  type="number"
                  value={costs.optionsPrice}
                  onChange={(e) => setCosts({...costs, optionsPrice: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Freight, Blocking & Setup
                </label>
                <input
                  type="number"
                  value={costs.freightSetup}
                  onChange={(e) => setCosts({...costs, freightSetup: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Map size={16} className="text-emerald-600" /> Site Prep
                </label>
                <p className="text-xs text-gray-500 mb-2">Well, septic, foundation, permits</p>
                <input
                  type="number"
                  value={costs.sitePrep}
                  onChange={(e) => setCosts({...costs, sitePrep: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trade-In Value
                </label>
                <input
                  type="number"
                  value={costs.tradeIn}
                  onChange={(e) => setCosts({...costs, tradeIn: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Three Scenario Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((scenario) => {
            const totalCost = calculateTotalCost(scenario)
            const amountFinanced = calculateAmountFinanced(scenario)
            const monthlyPayment = calculateMonthlyPayment(amountFinanced, scenario.rate, scenario.termYears)
            const downPaymentAmount = (totalCost - costs.tradeIn) * (scenario.downPercent / 100)
            const isLandHome = scenario.type === 'LAND_HOME'

            return (
              <div
                key={scenario.id}
                className={`bg-white rounded-2xl shadow-sm border-2 transition-all hover:shadow-md ${
                  isLandHome ? 'border-emerald-200' : 'border-blue-200'
                }`}
              >
                <div className={`p-4 rounded-t-2xl ${isLandHome ? 'bg-emerald-50' : 'bg-blue-50'}`}>
                  <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                    isLandHome ? 'bg-emerald-200 text-emerald-800' : 'bg-blue-200 text-blue-800'
                  }`}>
                    {scenario.type === 'CHATTEL' ? 'Chattel' : 'Land-Home'}
                  </span>
                  <h3 className="mt-2 font-bold text-slate-900">{scenario.name}</h3>
                </div>

                <div className="p-5">
                  <div className="text-center py-6 border-b border-gray-100 mb-5">
                    <p className="text-4xl font-black text-slate-900">
                      {formatCurrency(monthlyPayment)}
                    </p>
                    <p className="text-sm text-slate-500 mt-1 font-medium">per month</p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Project</span>
                      <span className="font-bold">{formatCurrency(totalCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Down Payment ({scenario.downPercent}%)</span>
                      <span className="font-bold text-green-600">{formatCurrency(downPaymentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Financed</span>
                      <span className="font-bold">{formatCurrency(amountFinanced)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-slate-500">Rate / Term</span>
                      <span className="font-bold text-blue-600">{scenario.rate}% / {scenario.termYears}yr</span>
                    </div>
                  </div>

                  <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex justify-center items-center gap-2 transition-colors">
                    Select Structure <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
