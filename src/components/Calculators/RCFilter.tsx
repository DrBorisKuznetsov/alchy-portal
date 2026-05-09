import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Info, Share2, Zap } from 'lucide-react';
import './Calculator.css';

const UNITS = {
  R: [
    { label: 'Ω', value: 1 },
    { label: 'kΩ', value: 1e3 },
    { label: 'MΩ', value: 1e6 },
  ],
  C: [
    { label: 'pF', value: 1e-12 },
    { label: 'nF', value: 1e-9 },
    { label: 'μF', value: 1e-6 },
    { label: 'mF', value: 1e-3 },
  ]
};

export default function RCFilter() {
  const [resistance, setResistance] = useState(10);
  const [rUnit, setRUnit] = useState(1e3); // kΩ
  const [capacitance, setCapacitance] = useState(100);
  const [cUnit, setCUnit] = useState(1e-9); // nF

  // Calculate cutoff frequency: f = 1 / (2 * pi * R * C)
  const fc = useMemo(() => {
    const r = resistance * rUnit;
    const c = capacitance * cUnit;
    if (r === 0 || c === 0) return 0;
    return 1 / (2 * Math.PI * r * c);
  }, [resistance, rUnit, capacitance, cUnit]);

  // Generate chart data
  const chartData = useMemo(() => {
    if (fc === 0) return [];
    const data = [];
    // 3 decades around fc
    const startFreq = fc / 50;
    const endFreq = fc * 50;
    const steps = 100;
    const logStart = Math.log10(startFreq);
    const logEnd = Math.log10(endFreq);
    const step = (logEnd - logStart) / steps;

    for (let i = 0; i <= steps; i++) {
      const f = Math.pow(10, logStart + i * step);
      // Magnitude: |H(f)| = 1 / sqrt(1 + (f/fc)^2)
      const magnitude = 1 / Math.sqrt(1 + Math.pow(f / fc, 2));
      const gainDb = 20 * Math.log10(magnitude);
      
      data.push({
        frequency: f,
        gain: parseFloat(gainDb.toFixed(2)),
        label: f < 1000 ? `${f.toFixed(0)} Hz` : `${(f/1000).toFixed(1)} kHz`
      });
    }
    return data;
  }, [fc]);

  const formatFrequency = (f: number) => {
    if (f >= 1e6) return `${(f / 1e6).toFixed(2)} MHz`;
    if (f >= 1e3) return `${(f / 1e3).toFixed(2)} kHz`;
    return `${f.toFixed(2)} Hz`;
  };

  return (
    <div className="calculator" id="rc-filter-calc">
      <div className="calculator__header">
        <div className="calculator__title-group">
          <Zap className="text-primary" size={24} />
          <h2 className="calculator__title">RC Фильтр (Low Pass)</h2>
        </div>
        <div className="calculator__actions">
          <button className="btn btn-icon" title="Инфо"><Info size={18} /></button>
          <button className="btn btn-icon" title="Поделиться"><Share2 size={18} /></button>
        </div>
      </div>

      <div className="calculator__content">
        <div className="calculator__inputs">
          <div className="calc-group">
            <label className="calc-label">Сопротивление (R)</label>
            <div className="calc-input-wrapper">
              <input
                type="number"
                value={resistance}
                onChange={(e) => setResistance(parseFloat(e.target.value) || 0)}
                className="calc-input"
              />
              <select 
                className="calc-select"
                value={rUnit}
                onChange={(e) => setRUnit(parseFloat(e.target.value))}
              >
                {UNITS.R.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>

          <div className="calc-group">
            <label className="calc-label">Емкость (C)</label>
            <div className="calc-input-wrapper">
              <input
                type="number"
                value={capacitance}
                onChange={(e) => setCapacitance(parseFloat(e.target.value) || 0)}
                className="calc-input"
              />
              <select 
                className="calc-select"
                value={cUnit}
                onChange={(e) => setCUnit(parseFloat(e.target.value))}
              >
                {UNITS.C.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>

          <div className="calculator__result">
            <span className="result-label">Частота среза (f<sub>c</sub>):</span>
            <span className="result-value">{formatFrequency(fc)}</span>
            <div className="result-info">
              При этой частоте сигнал ослабляется на -3 дБ (до 70.7%)
            </div>
          </div>
        </div>

        <div className="calculator__viz">
          <div className="viz-header">
            <span>АЧХ (Амплитудно-частотная характеристика)</span>
            <span className="viz-unit">Усиление (дБ)</span>
          </div>
          <div className="viz-chart">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="frequency" 
                  hide 
                />
                <YAxis 
                  domain={[-40, 0]} 
                  tick={{ fontSize: 10, fill: '#888' }}
                  axisLine={{ stroke: '#444' }}
                  tickLine={{ stroke: '#444' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#00d4ff' }}
                  formatter={(value: any) => [`${value} дБ`, 'Усиление']}
                  labelFormatter={(label) => {
                    const d = chartData.find(i => i.frequency === label);
                    return d ? d.label : label;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="gain" 
                  stroke="#00d4ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorGain)" 
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="viz-footer">
            <div className="viz-legend">
              <div className="legend-item">
                <div className="legend-line" style={{ backgroundColor: 'var(--primary)' }}></div>
                <span>Коэффициент передачи</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="calculator__footer">
        <div className="calculator__note">
          <Info size={14} />
          <span>Формула: f<sub>c</sub> = 1 / (2πRC)</span>
        </div>
        <Link to="/catalog?search=RC" className="calc-link">
          Смотреть видео про фильтры →
        </Link>
      </div>
    </div>
  );
}
