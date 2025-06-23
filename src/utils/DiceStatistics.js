export class DiceStatistics {
  calculate(rollHistory) {
    if (!rollHistory || rollHistory.length === 0) {
      return {
        sampleSize: 0,
        average: 0,
        median: 0,
        mode: 0,
        standardDeviation: 0,
        criticalRate: 0,
        fumbleRate: 0,
        consistency: 0
      }
    }
    
    const totals = rollHistory.map(r => r.total || 0)
    const d20Rolls = rollHistory.filter(r => r.dieSize === 20)
    
    return {
      sampleSize: rollHistory.length,
      average: this.calculateAverage(totals),
      median: this.calculateMedian(totals),
      mode: this.calculateMode(totals),
      standardDeviation: this.calculateStandardDeviation(totals),
      criticalRate: this.calculateCriticalRate(d20Rolls),
      fumbleRate: this.calculateFumbleRate(d20Rolls),
      consistency: this.calculateConsistency(totals)
    }
  }
  
  analyzeRoll(rollResult, history) {
    const recentSimilar = history
      .filter(r => r.rollType === rollResult.rollType)
      .slice(0, 10)
    
    if (recentSimilar.length === 0) {
      return { sampleSize: 0 }
    }
    
    const averageTotal = recentSimilar.reduce((sum, r) => sum + r.total, 0) / recentSimilar.length
    
    return {
      sampleSize: recentSimilar.length,
      averageTotal,
      currentVsAverage: rollResult.total - averageTotal,
      trend: this.calculateTrend(recentSimilar)
    }
  }
  
  calculateAverage(values) {
    if (values.length === 0) return 0
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }
  
  calculateMedian(values) {
    if (values.length === 0) return 0
    const sorted = [...values].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid]
  }
  
  calculateMode(values) {
    if (values.length === 0) return 0
    
    const frequency = {}
    let maxFreq = 0
    let mode = values[0]
    
    values.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1
      if (frequency[val] > maxFreq) {
        maxFreq = frequency[val]
        mode = val
      }
    })
    
    return mode
  }
  
  calculateStandardDeviation(values) {
    if (values.length < 2) return 0
    
    const mean = this.calculateAverage(values)
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
    const variance = this.calculateAverage(squaredDiffs)
    
    return Math.sqrt(variance)
  }
  
  calculateCriticalRate(d20Rolls) {
    if (d20Rolls.length === 0) return 0
    const crits = d20Rolls.filter(r => r.isNatural20).length
    return crits / d20Rolls.length
  }
  
  calculateFumbleRate(d20Rolls) {
    if (d20Rolls.length === 0) return 0
    const fumbles = d20Rolls.filter(r => r.isNatural1).length
    return fumbles / d20Rolls.length
  }
  
  calculateConsistency(values) {
    if (values.length < 2) return 1
    
    const mean = this.calculateAverage(values)
    const stdDev = this.calculateStandardDeviation(values)
    
    // Coefficient of variation (lower is more consistent)
    const cv = stdDev / mean
    
    // Convert to 0-1 scale where 1 is most consistent
    return Math.max(0, 1 - cv)
  }
  
  calculateTrend(recentRolls) {
    if (recentRolls.length < 3) return 'neutral'
    
    const firstHalf = recentRolls.slice(0, Math.floor(recentRolls.length / 2))
    const secondHalf = recentRolls.slice(Math.floor(recentRolls.length / 2))
    
    const firstAvg = this.calculateAverage(firstHalf.map(r => r.total))
    const secondAvg = this.calculateAverage(secondHalf.map(r => r.total))
    
    if (secondAvg > firstAvg * 1.1) return 'improving'
    if (secondAvg < firstAvg * 0.9) return 'declining'
    return 'stable'
  }
}