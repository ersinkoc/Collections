/**
 * String utilities plugin for @oxog/collections
 * Provides advanced string manipulation and formatting functions
 */

const { createPlugin } = require('../../dist/plugins/createPlugin.js');

/**
 * Configuration for the string utilities plugin
 */
const DEFAULT_CONFIG = {
  defaultLocale: 'en-US',
  caseSensitive: false,
  trimWhitespace: true,
  allowHtml: false,
  maxStringLength: 100000
};

/**
 * String utility functions
 */
const stringUtils = {
  // Case transformations
  camelCase: (str) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  },
  
  pascalCase: (str) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
      .replace(/\s+/g, '');
  },
  
  kebabCase: (str) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },
  
  snakeCase: (str) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  },
  
  titleCase: (str) => {
    return str.replace(/\w\S*/g, txt => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },
  
  // String analysis
  wordCount: (str) => {
    return str.trim().split(/\s+/).filter(word => word.length > 0).length;
  },
  
  characterCount: (str, includeSpaces = true) => {
    return includeSpaces ? str.length : str.replace(/\s/g, '').length;
  },
  
  lineCount: (str) => {
    return str.split('\n').length;
  },
  
  // String manipulation
  reverse: (str) => {
    return str.split('').reverse().join('');
  },
  
  truncate: (str, length, ellipsis = '...') => {
    if (str.length <= length) return str;
    return str.slice(0, length - ellipsis.length) + ellipsis;
  },
  
  pad: (str, targetLength, padString = ' ') => {
    return str.padStart(targetLength, padString);
  },
  
  padStart: (str, targetLength, padString = ' ') => {
    return str.padStart(targetLength, padString);
  },
  
  padEnd: (str, targetLength, padString = ' ') => {
    return str.padEnd(targetLength, padString);
  },
  
  center: (str, width, fillChar = ' ') => {
    if (str.length >= width) return str;
    
    const totalPadding = width - str.length;
    const leftPadding = Math.floor(totalPadding / 2);
    const rightPadding = totalPadding - leftPadding;
    
    return fillChar.repeat(leftPadding) + str + fillChar.repeat(rightPadding);
  },
  
  // String searching
  contains: (str, substring, caseSensitive = false) => {
    const haystack = caseSensitive ? str : str.toLowerCase();
    const needle = caseSensitive ? substring : substring.toLowerCase();
    return haystack.includes(needle);
  },
  
  startsWith: (str, prefix, caseSensitive = false) => {
    const target = caseSensitive ? str : str.toLowerCase();
    const search = caseSensitive ? prefix : prefix.toLowerCase();
    return target.startsWith(search);
  },
  
  endsWith: (str, suffix, caseSensitive = false) => {
    const target = caseSensitive ? str : str.toLowerCase();
    const search = caseSensitive ? suffix : suffix.toLowerCase();
    return target.endsWith(search);
  },
  
  countOccurrences: (str, substring, caseSensitive = false) => {
    const haystack = caseSensitive ? str : str.toLowerCase();
    const needle = caseSensitive ? substring : substring.toLowerCase();
    
    let count = 0;
    let index = 0;
    
    while ((index = haystack.indexOf(needle, index)) !== -1) {
      count++;
      index += needle.length;
    }
    
    return count;
  },
  
  // String formatting
  format: (template, ...args) => {
    return template.replace(/{(\d+)}/g, (match, index) => {
      return typeof args[index] !== 'undefined' ? args[index] : match;
    });
  },
  
  formatNamed: (template, params) => {
    return template.replace(/{(\w+)}/g, (match, key) => {
      return typeof params[key] !== 'undefined' ? params[key] : match;
    });
  },
  
  // String cleaning
  stripHtml: (str) => {
    return str.replace(/<[^>]*>/g, '');
  },
  
  stripWhitespace: (str) => {
    return str.replace(/\s+/g, ' ').trim();
  },
  
  removeAccents: (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  },
  
  slugify: (str, separator = '-') => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, separator)
      .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');
  },
  
  // String extraction
  extractNumbers: (str) => {
    const matches = str.match(/-?\d+\.?\d*/g);
    return matches ? matches.map(Number) : [];
  },
  
  extractEmails: (str) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return str.match(emailRegex) || [];
  },
  
  extractUrls: (str) => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return str.match(urlRegex) || [];
  },
  
  extractHashtags: (str) => {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    return str.match(hashtagRegex) || [];
  },
  
  extractMentions: (str) => {
    const mentionRegex = /@[a-zA-Z0-9_]+/g;
    return str.match(mentionRegex) || [];
  },
  
  // String validation
  isEmail: (str) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(str);
  },
  
  isUrl: (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  },
  
  isNumeric: (str) => {
    return !isNaN(str) && !isNaN(parseFloat(str));
  },
  
  isAlpha: (str) => {
    return /^[a-zA-Z]+$/.test(str);
  },
  
  isAlphanumeric: (str) => {
    return /^[a-zA-Z0-9]+$/.test(str);
  },
  
  // String similarity
  levenshteinDistance: (str1, str2) => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  },
  
  similarity: (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = stringUtils.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  },
  
  // Random string generation
  randomString: (length, charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  },
  
  randomAlpha: (length) => {
    return stringUtils.randomString(length, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  },
  
  randomNumeric: (length) => {
    return stringUtils.randomString(length, '0123456789');
  },
  
  randomAlphanumeric: (length) => {
    return stringUtils.randomString(length);
  },
  
  // Advanced string operations
  diff: (str1, str2) => {
    const changes = [];
    let i = 0, j = 0;
    
    while (i < str1.length && j < str2.length) {
      if (str1[i] === str2[j]) {
        i++;
        j++;
      } else {
        const start = i;
        while (i < str1.length && j < str2.length && str1[i] !== str2[j]) {
          i++;
          j++;
        }
        changes.push({
          type: 'change',
          oldText: str1.slice(start, i),
          newText: str2.slice(start, j),
          position: start
        });
      }
    }
    
    return changes;
  },
  
  wrap: (str, width) => {
    const lines = [];
    let currentLine = '';
    const words = str.split(' ');
    
    for (const word of words) {
      if (currentLine.length + word.length + 1 <= width) {
        currentLine = currentLine ? `${currentLine} ${word}` : word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    
    if (currentLine) lines.push(currentLine);
    return lines;
  },
  
  unwrap: (lines) => {
    return Array.isArray(lines) ? lines.join(' ') : lines;
  }
};

/**
 * Create the string utilities plugin
 */
const stringUtilsPlugin = createPlugin('string-utils', '1.1.0')
  .description('Comprehensive string manipulation and formatting utilities')
  .install((system, config = DEFAULT_CONFIG) => {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    
    // Register all string utilities
    Object.keys(stringUtils).forEach(name => {
      system.registerFunction(name, (...args) => {
        // Apply configuration defaults where applicable
        if (['contains', 'startsWith', 'endsWith', 'countOccurrences'].includes(name) && args.length === 2) {
          args.push(finalConfig.caseSensitive);
        }
        
        const result = stringUtils[name](...args);
        
        // Apply post-processing based on config
        if (typeof result === 'string') {
          if (finalConfig.trimWhitespace && ['camelCase', 'pascalCase', 'kebabCase', 'snakeCase'].includes(name)) {
            return result.trim();
          }
          
          if (!finalConfig.allowHtml && name === 'format') {
            return stringUtils.stripHtml(result);
          }
          
          if (result.length > finalConfig.maxStringLength) {
            return result.slice(0, finalConfig.maxStringLength);
          }
        }
        
        return result;
      });
    });
    
    // Template literal helper
    system.registerFunction('template', (strings, ...values) => {
      return strings.reduce((result, string, i) => {
        return result + string + (values[i] || '');
      }, '');
    });
    
    // String builder utility
    system.registerFunction('StringBuilder', () => {
      const builder = {
        parts: [],
        
        append(str) {
          this.parts.push(String(str));
          return this;
        },
        
        appendLine(str = '') {
          this.parts.push(String(str) + '\n');
          return this;
        },
        
        prepend(str) {
          this.parts.unshift(String(str));
          return this;
        },
        
        insert(index, str) {
          this.parts.splice(index, 0, String(str));
          return this;
        },
        
        clear() {
          this.parts = [];
          return this;
        },
        
        toString() {
          return this.parts.join('');
        },
        
        length() {
          return this.toString().length;
        }
      };
      
      return builder;
    });
    
    // Internationalization helpers
    system.registerFunction('normalize', (str, form = 'NFC') => {
      return str.normalize(form);
    });
    
    system.registerFunction('localeCompare', (str1, str2, locale = finalConfig.defaultLocale) => {
      return str1.localeCompare(str2, locale);
    });
    
    system.registerFunction('toLocaleCase', (str, caseType, locale = finalConfig.defaultLocale) => {
      if (caseType === 'upper') {
        return str.toLocaleUpperCase(locale);
      } else if (caseType === 'lower') {
        return str.toLocaleLowerCase(locale);
      }
      return str;
    });
    
    // Configuration functions
    system.registerFunction('getStringConfig', () => finalConfig);
    system.registerFunction('setDefaultLocale', (locale) => {
      finalConfig.defaultLocale = locale;
    });
    system.registerFunction('setCaseSensitive', (caseSensitive) => {
      finalConfig.caseSensitive = Boolean(caseSensitive);
    });
    
    console.log(`✅ String Utils Plugin installed with config:`, finalConfig);
  })
  
  .uninstall((system) => {
    const functions = [
      ...Object.keys(stringUtils),
      'template', 'StringBuilder', 'normalize', 'localeCompare', 'toLocaleCase',
      'getStringConfig', 'setDefaultLocale', 'setCaseSensitive'
    ];
    
    functions.forEach(fn => {
      try {
        system.unregisterFunction(fn);
      } catch (error) {
        // Function might not exist
      }
    });
    
    console.log('❌ String Utils Plugin uninstalled');
  })
  
  .build();

module.exports = stringUtilsPlugin;
module.exports.DEFAULT_CONFIG = DEFAULT_CONFIG;