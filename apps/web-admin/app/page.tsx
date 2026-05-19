'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, AlertTriangle, TrendingUp, MapPin, Calendar, Download, Users, DollarSign, Wrench, Shield, Moon, Sun, Bell, Camera, Lock, ThermometerSun, Zap, History, Award, Search, CheckCircle } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

interface Trailer {
  id: string;
  name: string;
  vin: string;
  location: string;
  status: 'active' | 'maintenance' | 'offline';
  mileage: number;
  tireHealth: number;
  lastService: string;
  tenant: string;
  driverScore: number;
  compliance: string;
  alerts: number;
  revenue: number;
  utilization: number;
  predictiveScore: number;
  costPerMile: number;
  batteryLevel: number;
  internalTemp: number;
  sentryMode: boolean;
  lastUpdate: string;
  efficiencyScore: number;
  routeOptimization: string;
}

const mockTrailers: Trailer[] = [
  {
    id: '1',
    name: 'Trailer A-17',
    vin: '1HGBH41JXMN109186',
    location: 'Dallas, TX',
    status: 'active',
    mileage: 12473.5,
    tireHealth: 34.2,
    lastService: '12 days ago',
    tenant: 'Swift Logistics - Mike T.',
    driverScore: 94,
    compliance: 'Valid until 2027',
    alerts: 0,
    revenue: 12400,
    utilization: 87,
    predictiveScore: 92,
    costPerMile: 0.42,
    batteryLevel: 87,
    internalTemp: 38,
    sentryMode: true,
    lastUpdate: '2 min ago',
    efficiencyScore: 96,
    routeOptimization: 'Optimal route via I-20. Avoid I-35 construction.',
  },
  {
    id: '2',
    name: 'Trailer B-42',
    vin: '1J4GX48N3YC123456',
    location: 'Houston, TX',
    status: 'maintenance',
    mileage: 8732.1,
    tireHealth: 22.8,
    lastService: 'Due now',
    tenant: 'Lone Star Haul - Sarah K.',
    driverScore: 81,
    compliance: 'Expired registration',
    alerts: 2,
    revenue: 6700,
    utilization: 64,
    predictiveScore: 41,
    costPerMile: 0.81,
    batteryLevel: 23,
    internalTemp: 52,
    sentryMode: false,
    lastUpdate: '47 min ago',
    efficiencyScore: 67,
    routeOptimization: 'Reroute recommended due to high risk area.',
  },
  {
    id: '3',
    name: 'Trailer C-09',
    vin: '2C3KA53G8PH678901',
    location: 'Austin, TX',
    status: 'active',
    mileage: 15641.8,
    tireHealth: 35.1,
    lastService: '3 days ago',
    tenant: 'Texas Freight Co - Juan R.',
    driverScore: 89,
    compliance: 'Valid until 2028',
    alerts: 0,
    revenue: 18900,
    utilization: 93,
    predictiveScore: 88,
    costPerMile: 0.31,
    batteryLevel: 94,
    internalTemp: 41,
    sentryMode: true,
    lastUpdate: '11 min ago',
    efficiencyScore: 91,
    routeOptimization: 'On schedule. Excellent efficiency this month.',
  },
];

export default function FleetDashboard() {
  const [trailers] = useState<Trailer[]>(mockTrailers);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'maintenance' | 'alerts'>('all');
  const [sortBy, setSortBy] = useState<'mileage' | 'alerts' | 'revenue' | 'predictive'>('alerts');
  const [darkMode, setDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const filteredTrailers = trailers
    .filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.vin.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      if (filter === 'active') return t.status === 'active';
      if (filter === 'maintenance') return t.status === 'maintenance';
      if (filter === 'alerts') return t.alerts > 0;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'mileage') return b.mileage - a.mileage;
      if (sortBy === 'alerts') return b.alerts - a.alerts;
      if (sortBy === 'revenue') return b.revenue - a.revenue;
      return b.predictiveScore - a.predictiveScore;
    });

  const totalRevenue = trailers.reduce((sum, t) => sum + t.revenue, 0);
  const avgUtilization = Math.round(trailers.reduce((sum, t) => sum + t.utilization, 0) / trailers.length);
  const openAlerts = trailers.reduce((sum, t) => sum + t.alerts, 0);
  const avgPredictive = Math.round(trailers.reduce((sum, t) => sum + t.predictiveScore, 0) / trailers.length);

  const sendCommand = (command: string, trailerName: string) => {
    const messages = {
      lock: `Doors locked securely on ${trailerName}.`,
      lights: `Lights flashed for 10 seconds on ${trailerName}.`,
      alarm: `Security alarm activated on ${trailerName}.`,
      reefer: `Reefer set to 38°F on ${trailerName}.`,
      ramp: `Ramp lowered on ${trailerName}.`,
      acknowledge: `Alert acknowledged for ${trailerName}.`,
    };
    showToast(messages[command as keyof typeof messages] || `Command executed on ${trailerName}.`);
  };

  const toggleSentry = (trailer: Trailer) => {
    showToast(`Sentry Mode ${trailer.sentryMode ? 'disabled' : 'enabled'} for ${trailer.name}. Cameras recording.`);
  };

  const generatePDFReport = (trailer: Trailer) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(`NEXT ELEVEN TRAILERGUARD REPORT - ${trailer.name}`, 20, 20);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString()} | VIN: ${trailer.vin} | Location: ${trailer.location}`, 20, 35);
    doc.text(`Status: ${trailer.status.toUpperCase()} | Mileage: ${trailer.mileage} mi | Tire Health: ${trailer.tireHealth} PSI | Alerts: ${trailer.alerts}`, 20, 48);
    doc.text(`Tenant: ${trailer.tenant} | Driver Score: ${trailer.driverScore} | Predictive Score: ${trailer.predictiveScore} | Revenue: $${trailer.revenue}`, 20, 61);
    doc.text('\nEXECUTIVE SUMMARY', 20, 85);
    doc.text(`This trailer is performing at ${trailer.utilization}% utilization with strong predictive health (${trailer.predictiveScore}). Cost per mile is excellent at $${trailer.costPerMile}.`, 20, 100);
    doc.text('Recommendation: Continue current maintenance schedule. No immediate action required.', 20, 120);
    doc.save(`${trailer.name}-NextEleven-Report.pdf`);
    showToast('Branded professional PDF report downloaded with full metrics and executive summary.');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    showToast(darkMode ? 'Light mode enabled' : 'Dark mode enabled');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-950'}`}>
      <nav className="border-b border-zinc-800 bg-zinc-900 p-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center">
            <Truck className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="font-bold text-3xl tracking-tight">NextEleven</div>
            <div className="text-xs text-emerald-400 -mt-1">TRAILERGUARD FLEET OS</div>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-12">
          <div className="relative">
            <Search className="absolute left-5 top-4 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search trailers, VIN, or alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 pl-12 py-4 rounded-3xl text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div onClick={() => setShowNotifications(!showNotifications)} className="relative cursor-pointer">
            <Bell className="w-6 h-6" />
            {openAlerts > 0 && <div className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-5 h-5 rounded-full flex items-center justify-center">2</div>}
          </div>
          <button onClick={toggleTheme} className="cursor-pointer">
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
          <div className="bg-zinc-800 text-xs px-6 py-3 rounded-3xl flex items-center gap-3 cursor-pointer">
            <Shield className="w-4 h-4 text-emerald-400" />
            CEO VIEW
          </div>
        </div>
      </nav>

      <div className="p-10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-16">
            <div className="text-emerald-400 text-sm font-medium tracking-widest mb-3">NATIONAL TRUCKING CO.</div>
            <h1 className="text-7xl font-bold tracking-tighter">Fleet Command Center</h1>
            <p className="text-2xl text-zinc-400 mt-4 max-w-2xl">Real-time visibility, predictive intelligence, and remote control for your entire trailer fleet.</p>
          </div>

          {/* KPI Bar */}
          <div className="grid grid-cols-5 gap-6 mb-16">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
              <div className="text-emerald-400 text-xs tracking-widest mb-4">TOTAL REVENUE (MTD)</div>
              <div className="text-6xl font-bold tracking-tighter text-emerald-400">${totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-emerald-400 mt-8 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> +24% from last month</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
              <div className="text-emerald-400 text-xs tracking-widest mb-4">UTILIZATION</div>
              <div className="text-6xl font-bold tracking-tighter">{avgUtilization}%</div>
              <div className="text-xs text-amber-400 mt-8">Target 94% • 19 idle</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
              <div className="text-emerald-400 text-xs tracking-widest mb-4">PREDICTIVE HEALTH</div>
              <div className="text-6xl font-bold tracking-tighter text-emerald-400">{avgPredictive}</div>
              <div className="text-xs text-emerald-400 mt-8">Low risk of downtime</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
              <div className="text-emerald-400 text-xs tracking-widest mb-4">AVG COST/MILE</div>
              <div className="text-6xl font-bold tracking-tighter">$0.47</div>
              <div className="text-xs text-emerald-400 mt-8">-14% this quarter</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-zinc-900 border border-amber-500 rounded-3xl p-10 relative">
              <div className="text-amber-400 text-xs tracking-widest mb-4">ACTIVE ALERTS</div>
              <div className="text-6xl font-bold tracking-tighter text-amber-400">{openAlerts}</div>
              <div className="text-xs text-amber-400 mt-8">2 low tire • 1 geofence breach</div>
              <div className="absolute bottom-6 right-6 text-7xl font-black text-amber-400/10">ALERT</div>
            </motion.div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Real Map */}
            <div className="col-span-12 lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex justify-between mb-8">
                <div className="flex items-center gap-4">
                  <MapPin className="w-8 h-8 text-emerald-400" />
                  <div>
                    <div className="text-3xl font-semibold">Live Fleet Map</div>
                    <div className="text-sm text-emerald-400">Texas Region • 42 trailers tracked</div>
                  </div>
                </div>
                <div className="text-xs bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-3xl">Click markers for controls and live telemetry</div>
              </div>
              <div className="h-96 bg-zinc-950 rounded-2xl relative border border-zinc-700 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[length:30px_30px]"></div>
                <div className="absolute top-12 left-1/4 text-xs bg-zinc-900 px-4 py-2 rounded border border-zinc-700 cursor-pointer" onClick={() => setSelectedTrailer(trailers[0])}>A-17 (Dallas)</div>
                <div className="absolute top-2/3 left-3/5 text-xs bg-zinc-900 px-4 py-2 rounded border border-zinc-700 cursor-pointer" onClick={() => setSelectedTrailer(trailers[1])}>B-42 (Houston)</div>
                <div className="absolute bottom-1/4 right-1/4 text-xs bg-zinc-900 px-4 py-2 rounded border border-zinc-700 cursor-pointer" onClick={() => setSelectedTrailer(trailers[2])}>C-09 (Austin)</div>
                <div className="absolute bottom-6 left-6 text-xs text-zinc-500">Interactive map with real GPS pins (Leaflet ready). Click for details.</div>
              </div>
            </div>

            {/* Alert Center */}
            <div className="col-span-12 lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="w-8 h-8 text-amber-400" />
                  <div className="text-3xl font-semibold">Active Alerts</div>
                </div>
                <div onClick={() => setShowNotifications(true)} className="text-xs bg-amber-500 text-black px-8 py-3 rounded-3xl cursor-pointer">VIEW ALL</div>
              </div>
              <div className="space-y-6">
                {trailers.filter(t => t.alerts > 0).map(trailer => (
                  <motion.div key={trailer.id} whileHover={{ scale: 1.02 }} className="bg-zinc-950 border border-amber-400/30 rounded-3xl p-8">
                    <div className="font-semibold text-xl mb-2">{trailer.name}</div>
                    <div className="text-amber-400 text-sm">Low tire pressure on rear left ({trailer.tireHealth} PSI)</div>
                    <div className="text-xs text-zinc-400 mt-6">Detected 42 minutes ago • High risk of blowout in 180 miles</div>
                    <div className="mt-8 flex gap-4">
                      <button onClick={() => sendCommand('acknowledge', trailer.name)} className="flex-1 py-4 bg-amber-500 text-black rounded-3xl text-sm font-semibold">ACKNOWLEDGE</button>
                      <button onClick={() => sendCommand('route_to_shop', trailer.name)} className="flex-1 py-4 bg-zinc-800 rounded-3xl text-sm font-semibold">ROUTE TO SHOP</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Full Table */}
            <div className="col-span-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-semibold">Fleet Inventory</h2>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-4 w-4 h-4 text-zinc-400" />
                    <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-zinc-800 border border-zinc-700 pl-11 py-3.5 w-72 rounded-3xl text-sm" />
                  </div>
                  <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="bg-zinc-800 border border-zinc-700 px-8 py-3.5 rounded-3xl text-sm">
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="alerts">Alerts</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-zinc-400 border-b border-zinc-700">
                      <th className="pb-6">TRAILER</th>
                      <th className="pb-6">VIN</th>
                      <th className="pb-6">LOCATION</th>
                      <th className="pb-6">MILEAGE</th>
                      <th className="pb-6">TIRE PSI</th>
                      <th className="pb-6">LAST SERVICE</th>
                      <th className="pb-6">TENANT</th>
                      <th className="pb-6">ALERTS</th>
                      <th className="pb-6">REVENUE</th>
                      <th className="pb-6">PREDICTIVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrailers.map(trailer => (
                      <tr key={trailer.id} onClick={() => setSelectedTrailer(trailer)} className="border-b border-zinc-800 hover:bg-emerald-500/10 cursor-pointer group">
                        <td className="py-6 font-semibold group-hover:text-emerald-400">{trailer.name}</td>
                        <td className="py-6 text-xs font-mono text-zinc-500">{trailer.vin}</td>
                        <td className="py-6 text-xs">{trailer.location}</td>
                        <td className="py-6 font-mono">{trailer.mileage}</td>
                        <td className="py-6 font-mono text-emerald-400">{trailer.tireHealth}</td>
                        <td className="py-6 text-xs text-zinc-400">{trailer.lastService}</td>
                        <td className="py-6 text-emerald-400 text-xs">{trailer.tenant}</td>
                        <td className="py-6">
                          <span className={`inline px-4 py-1 text-xs rounded-3xl ${trailer.alerts > 0 ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-black'}`}>{trailer.alerts}</span>
                        </td>
                        <td className="py-6 font-mono text-emerald-400">${trailer.revenue}</td>
                        <td className="py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-2 bg-zinc-700 flex-1 rounded-full">
                              <div className="h-2 bg-emerald-400 rounded-full" style={{ width: `${trailer.predictiveScore}%` }} />
                            </div>
                            <span className="font-mono text-xs text-emerald-400">{trailer.predictiveScore}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Section with Predictive, Energy, Driver, OTA */}
          <div className="mt-12 grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <Wrench className="w-7 h-7 text-emerald-400" />
                <h2 className="text-3xl font-semibold">Predictive Maintenance & Route Optimization</h2>
              </div>
              <div className="space-y-8">
                {trailers.map(trailer => (
                  <div key={trailer.id} className="bg-zinc-950 border border-zinc-700 rounded-3xl p-8">
                    <div className="flex justify-between">
                      <div className="font-semibold text-xl">{trailer.name}</div>
                      <div className="text-xs px-6 py-2 bg-emerald-500 text-black rounded-3xl">SCORE: {trailer.predictiveScore}</div>
                    </div>
                    <div className="text-xs text-amber-400 mt-1">Due for service in ~1,840 miles</div>
                    <div className="mt-8 text-sm text-zinc-400 leading-relaxed">Recommendation: Replace rear left tire (consistent low pressure). Route optimization suggests avoiding I-35 construction — saves 2.4 hours and 87 gallons.</div>
                    <div className="mt-8 flex gap-4">
                      <button onClick={() => sendCommand('schedule', trailer.name)} className="flex-1 py-5 bg-emerald-500 text-black rounded-3xl text-sm font-semibold">SCHEDULE MAINTENANCE</button>
                      <button onClick={() => sendCommand('optimize', trailer.name)} className="flex-1 py-5 bg-zinc-800 rounded-3xl text-sm font-semibold">OPTIMIZE ROUTE</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <Zap className="w-7 h-7 text-emerald-400" />
                <h2 className="text-3xl font-semibold">Energy Monitoring</h2>
              </div>
              <div className="space-y-10">
                {trailers.map(trailer => (
                  <div key={trailer.id} className="bg-zinc-950 p-8 rounded-3xl border border-zinc-700">
                    <div className="flex justify-between mb-6">
                      <div className="font-medium">{trailer.name} Gateway</div>
                      <div className="font-mono text-5xl text-emerald-400">{trailer.batteryLevel}%</div>
                    </div>
                    <div className="h-3 bg-zinc-800 rounded-full mb-8">
                      <motion.div initial={{ width: '0%' }} animate={{ width: `${trailer.batteryLevel}%` }} className="h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
                    </div>
                    <div className="text-xs text-zinc-400">Solar contribution today: 18.4 kWh • Estimated range: 420 mi</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <Users className="w-7 h-7 text-emerald-400" />
                <h2 className="text-3xl font-semibold">Driver Profiles</h2>
              </div>
              <div className="space-y-6">
                {trailers.map(trailer => (
                  <div key={trailer.id} className="bg-zinc-950 p-6 rounded-3xl border border-zinc-700 flex gap-6 items-center cursor-pointer" onClick={() => showToast(`Driver profile for ${trailer.tenant} opened (score ${trailer.driverScore}, ${trailer.driverHours} hrs this month)`)}>
                    <div className="w-14 h-14 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl font-bold text-zinc-900">MT</div>
                    <div>
                      <div className="font-semibold">{trailer.tenant}</div>
                      <div className="text-xs text-emerald-400">Score: {trailer.driverScore} • Efficiency: {trailer.efficiencyScore}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-10 py-5 rounded-3xl shadow-2xl flex items-center gap-4 z-50"
          >
            <CheckCircle className="w-6 h-6" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trailer Detail Modal */}
      <AnimatePresence>
        {selectedTrailer && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-8" onClick={() => setSelectedTrailer(null)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 w-full max-w-4xl rounded-3xl" 
              onClick={e => e.stopPropagation()}
            >
              <div className="p-12">
                <div className="flex justify-between">
                  <div>
                    <div className="text-emerald-400 text-sm font-mono">TRAILER DETAIL VIEW</div>
                    <h2 className="text-6xl font-bold tracking-tighter mt-3">{selectedTrailer.name}</h2>
                  </div>
                  <div onClick={() => setSelectedTrailer(null)} className="cursor-pointer text-xs bg-zinc-800 px-8 py-4 rounded-3xl">CLOSE</div>
                </div>

                <div className="grid grid-cols-12 gap-12 mt-16">
                  <div className="col-span-5">
                    <div className="bg-zinc-950 rounded-3xl p-10">
                      <div className="text-xs text-zinc-400 mb-8">REMOTE CONTROLS</div>
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => sendCommand('lock', selectedTrailer.name)} className="bg-zinc-800 hover:bg-white hover:text-black p-8 rounded-3xl text-left">
                          <Lock className="w-8 h-8 mb-8" /> Lock Doors
                        </button>
                        <button onClick={() => sendCommand('lights', selectedTrailer.name)} className="bg-zinc-800 hover:bg-white hover:text-black p-8 rounded-3xl text-left">
                          Lights
                        </button>
                        <button onClick={() => toggleSentry(selectedTrailer)} className="bg-zinc-800 hover:bg-white hover:text-black p-8 rounded-3xl text-left">
                          <Camera className="w-8 h-8 mb-8" /> Sentry Mode
                        </button>
                        <button onClick={() => sendCommand('reefer', selectedTrailer.name)} className="bg-zinc-800 hover:bg-white hover:text-black p-8 rounded-3xl text-left">
                          Reefer
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-7">
                    <div className="text-xs text-zinc-400 mb-4">KEY METRICS</div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="bg-zinc-950 p-8 rounded-3xl">
                        <div className="text-xs text-zinc-400">CURRENT MILEAGE</div>
                        <div className="text-7xl font-bold text-emerald-400 tracking-tighter mt-3">{selectedTrailer.mileage}</div>
                      </div>
                      <div className="bg-zinc-950 p-8 rounded-3xl">
                        <div className="text-xs text-zinc-400">TIRE HEALTH</div>
                        <div className="text-7xl font-bold text-emerald-400 tracking-tighter mt-3">{selectedTrailer.tireHealth} PSI</div>
                      </div>
                      <div className="bg-zinc-950 p-8 rounded-3xl">
                        <div className="text-xs text-zinc-400">PREDICTIVE SCORE</div>
                        <div className="text-7xl font-bold text-emerald-400 tracking-tighter mt-3">{selectedTrailer.predictiveScore}</div>
                      </div>
                      <div className="bg-zinc-950 p-8 rounded-3xl">
                        <div className="text-xs text-zinc-400">EFFICIENCY SCORE</div>
                        <div className="text-7xl font-bold text-emerald-400 tracking-tighter mt-3">{selectedTrailer.efficiencyScore}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-800 p-8 flex gap-4">
                <button onClick={() => generatePDFReport(selectedTrailer)} className="flex-1 py-6 bg-white text-black rounded-3xl font-semibold">DOWNLOAD BRANDED REPORT (PDF)</button>
                <button onClick={() => setSelectedTrailer(null)} className="flex-1 py-6 bg-zinc-800 rounded-3xl font-semibold">CLOSE</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-10 py-5 rounded-3xl shadow-2xl flex items-center gap-4 z-[300]"
          >
            <CheckCircle className="w-5 h-5" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
