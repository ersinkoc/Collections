/**
 * Mathematical utilities plugin for @oxog/collections
 * Demonstrates plugin creation with dependencies and configuration
 */

const { createPlugin } = require('../../dist/plugins/createPlugin.js');

/**
 * Configuration interface for the math plugin
 */
const DEFAULT_CONFIG = {
  precision: 10,
  angleUnit: 'radians', // 'radians' or 'degrees'
  enableStatistics: true,
  enableGeometry: true,
  enableNumberTheory: false
};

/**
 * Helper functions
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

function convertAngle(angle, fromUnit, toUnit) {
  if (fromUnit === toUnit) return angle;
  if (fromUnit === 'degrees' && toUnit === 'radians') {
    return toRadians(angle);
  }
  if (fromUnit === 'radians' && toUnit === 'degrees') {
    return toDegrees(angle);
  }
  return angle;
}

/**
 * Create the math utilities plugin
 */
const mathPlugin = createPlugin('math-utils', '1.2.0')
  .description('Advanced mathematical utilities and statistical functions')
  .install((system, config = DEFAULT_CONFIG) => {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    
    // Basic math operations
    system.registerFunction('add', (a, b) => a + b);
    system.registerFunction('subtract', (a, b) => a - b);
    system.registerFunction('multiply', (a, b) => a * b);
    system.registerFunction('divide', (a, b) => {
      if (b === 0) throw new Error('Division by zero');
      return a / b;
    });
    
    system.registerFunction('power', (base, exponent) => Math.pow(base, exponent));
    system.registerFunction('sqrt', (n) => {
      if (n < 0) throw new Error('Cannot take square root of negative number');
      return Math.sqrt(n);
    });
    system.registerFunction('abs', Math.abs);
    system.registerFunction('sign', Math.sign);
    
    // Advanced math operations
    system.registerFunction('factorial', (n) => {
      if (n < 0) throw new Error('Factorial of negative number is undefined');
      if (n === 0 || n === 1) return 1;
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      return result;
    });
    
    system.registerFunction('fibonacci', (n) => {
      if (n < 0) throw new Error('Fibonacci index must be non-negative');
      if (n <= 1) return n;
      
      let a = 0, b = 1;
      for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
      }
      return b;
    });
    
    system.registerFunction('gcd', (a, b) => {
      a = Math.abs(a);
      b = Math.abs(b);
      while (b !== 0) {
        [a, b] = [b, a % b];
      }
      return a;
    });
    
    system.registerFunction('lcm', (a, b) => {
      const gcd = system.call('gcd', a, b);
      return Math.abs(a * b) / gcd;
    });
    
    // Trigonometric functions (with angle unit support)
    system.registerFunction('sin', (angle) => {
      const radians = convertAngle(angle, finalConfig.angleUnit, 'radians');
      return Math.sin(radians);
    });
    
    system.registerFunction('cos', (angle) => {
      const radians = convertAngle(angle, finalConfig.angleUnit, 'radians');
      return Math.cos(radians);
    });
    
    system.registerFunction('tan', (angle) => {
      const radians = convertAngle(angle, finalConfig.angleUnit, 'radians');
      return Math.tan(radians);
    });
    
    // Statistics functions (if enabled)
    if (finalConfig.enableStatistics) {
      system.registerFunction('mean', (numbers) => {
        if (!Array.isArray(numbers) || numbers.length === 0) {
          throw new Error('Input must be a non-empty array');
        }
        return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
      });
      
      system.registerFunction('median', (numbers) => {
        if (!Array.isArray(numbers) || numbers.length === 0) {
          throw new Error('Input must be a non-empty array');
        }
        const sorted = [...numbers].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
          return (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
          return sorted[mid];
        }
      });
      
      system.registerFunction('mode', (numbers) => {
        if (!Array.isArray(numbers) || numbers.length === 0) {
          throw new Error('Input must be a non-empty array');
        }
        
        const frequency = {};
        let maxFreq = 0;
        
        numbers.forEach(num => {
          frequency[num] = (frequency[num] || 0) + 1;
          maxFreq = Math.max(maxFreq, frequency[num]);
        });
        
        return Object.keys(frequency)
          .filter(key => frequency[key] === maxFreq)
          .map(Number);
      });
      
      system.registerFunction('variance', (numbers, sample = false) => {
        if (!Array.isArray(numbers) || numbers.length === 0) {
          throw new Error('Input must be a non-empty array');
        }
        
        const mean = system.call('mean', numbers);
        const sumSquaredDiffs = numbers.reduce((sum, n) => {
          return sum + Math.pow(n - mean, 2);
        }, 0);
        
        const divisor = sample ? numbers.length - 1 : numbers.length;
        return sumSquaredDiffs / divisor;
      });
      
      system.registerFunction('standardDeviation', (numbers, sample = false) => {
        return Math.sqrt(system.call('variance', numbers, sample));
      });
      
      system.registerFunction('correlation', (x, y) => {
        if (!Array.isArray(x) || !Array.isArray(y) || x.length !== y.length) {
          throw new Error('Input must be arrays of equal length');
        }
        
        const meanX = system.call('mean', x);
        const meanY = system.call('mean', y);
        
        let numerator = 0;
        let sumSquaredX = 0;
        let sumSquaredY = 0;
        
        for (let i = 0; i < x.length; i++) {
          const diffX = x[i] - meanX;
          const diffY = y[i] - meanY;
          
          numerator += diffX * diffY;
          sumSquaredX += diffX * diffX;
          sumSquaredY += diffY * diffY;
        }
        
        const denominator = Math.sqrt(sumSquaredX * sumSquaredY);
        return denominator === 0 ? 0 : numerator / denominator;
      });
    }
    
    // Geometry functions (if enabled)
    if (finalConfig.enableGeometry) {
      system.registerFunction('distance', (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      });
      
      system.registerFunction('circleArea', (radius) => {
        if (radius < 0) throw new Error('Radius cannot be negative');
        return Math.PI * radius * radius;
      });
      
      system.registerFunction('circleCircumference', (radius) => {
        if (radius < 0) throw new Error('Radius cannot be negative');
        return 2 * Math.PI * radius;
      });
      
      system.registerFunction('rectangleArea', (width, height) => {
        if (width < 0 || height < 0) throw new Error('Dimensions cannot be negative');
        return width * height;
      });
      
      system.registerFunction('rectanglePerimeter', (width, height) => {
        if (width < 0 || height < 0) throw new Error('Dimensions cannot be negative');
        return 2 * (width + height);
      });
      
      system.registerFunction('triangleArea', (base, height) => {
        if (base < 0 || height < 0) throw new Error('Dimensions cannot be negative');
        return 0.5 * base * height;
      });
    }
    
    // Number theory functions (if enabled)
    if (finalConfig.enableNumberTheory) {
      system.registerFunction('isPrime', (n) => {
        if (n < 2) return false;
        if (n === 2) return true;
        if (n % 2 === 0) return false;
        
        for (let i = 3; i * i <= n; i += 2) {
          if (n % i === 0) return false;
        }
        return true;
      });
      
      system.registerFunction('primeFactors', (n) => {
        const factors = [];
        let divisor = 2;
        
        while (divisor * divisor <= n) {
          while (n % divisor === 0) {
            factors.push(divisor);
            n /= divisor;
          }
          divisor++;
        }
        
        if (n > 1) {
          factors.push(n);
        }
        
        return factors;
      });
      
      system.registerFunction('nthPrime', (n) => {
        if (n < 1) throw new Error('n must be positive');
        if (n === 1) return 2;
        
        let count = 1;
        let num = 3;
        
        while (count < n) {
          if (system.call('isPrime', num)) {
            count++;
          }
          if (count < n) num += 2;
        }
        
        return num;
      });
    }
    
    // Utility functions
    system.registerFunction('round', (number, decimals = 0) => {
      const factor = Math.pow(10, decimals);
      return Math.round(number * factor) / factor;
    });
    
    system.registerFunction('clamp', (value, min, max) => {
      return Math.min(Math.max(value, min), max);
    });
    
    system.registerFunction('lerp', (start, end, t) => {
      return start + (end - start) * t;
    });
    
    system.registerFunction('normalize', (value, min, max) => {
      if (max === min) throw new Error('Max and min cannot be equal');
      return (value - min) / (max - min);
    });
    
    // Random number utilities
    system.registerFunction('randomInt', (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    });
    
    system.registerFunction('randomFloat', (min, max) => {
      return Math.random() * (max - min) + min;
    });
    
    system.registerFunction('randomGaussian', (mean = 0, stdDev = 1) => {
      // Box-Muller transform
      const u = Math.random();
      const v = Math.random();
      const normal = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      return mean + stdDev * normal;
    });
    
    // Plugin configuration functions
    system.registerFunction('getConfig', () => finalConfig);
    system.registerFunction('setAngleUnit', (unit) => {
      if (unit !== 'radians' && unit !== 'degrees') {
        throw new Error('Angle unit must be "radians" or "degrees"');
      }
      finalConfig.angleUnit = unit;
    });
    
    console.log(`✅ Math Utils Plugin installed with config:`, finalConfig);
  })
  
  .uninstall((system) => {
    const functions = [
      'add', 'subtract', 'multiply', 'divide', 'power', 'sqrt', 'abs', 'sign',
      'factorial', 'fibonacci', 'gcd', 'lcm', 'sin', 'cos', 'tan',
      'mean', 'median', 'mode', 'variance', 'standardDeviation', 'correlation',
      'distance', 'circleArea', 'circleCircumference', 'rectangleArea', 
      'rectanglePerimeter', 'triangleArea', 'isPrime', 'primeFactors', 'nthPrime',
      'round', 'clamp', 'lerp', 'normalize', 'randomInt', 'randomFloat', 
      'randomGaussian', 'getConfig', 'setAngleUnit'
    ];
    
    functions.forEach(fn => {
      try {
        system.unregisterFunction(fn);
      } catch (error) {
        // Function might not exist if feature was disabled
      }
    });
    
    console.log('❌ Math Utils Plugin uninstalled');
  })
  
  .build();

module.exports = mathPlugin;

// Export for direct usage
module.exports.DEFAULT_CONFIG = DEFAULT_CONFIG;