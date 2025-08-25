import { Plugin } from './PluginSystem';
import { validateString, validateFunction } from '../utils/validators';

/**
 * Plugin builder options.
 * 
 * @template T - Configuration type for the plugin
 * @since 1.0.0
 */
export interface PluginOptions<T = any> {
  name: string;
  version: string;
  description?: string;
  dependencies?: string[];
  config?: T;
}

/**
 * Plugin builder class for creating plugins fluently.
 * 
 * @template T - Configuration type for the plugin
 * @since 1.0.0
 */
export class PluginBuilder<T = any> {
  private plugin: Partial<Plugin<T>> = {};

  constructor(name: string, version: string) {
    validateString(name, 'name');
    validateString(version, 'version');
    
    this.plugin.name = name;
    this.plugin.version = version;
  }

  /**
   * Sets the plugin description.
   * 
   * @param description - Plugin description
   * @returns Plugin builder for chaining
   */
  description(description: string): PluginBuilder<T> {
    validateString(description, 'description');
    this.plugin.description = description;
    return this;
  }

  /**
   * Sets plugin dependencies.
   * 
   * @param dependencies - Array of plugin names this plugin depends on
   * @returns Plugin builder for chaining
   */
  dependencies(dependencies: string[]): PluginBuilder<T> {
    if (!Array.isArray(dependencies)) {
      throw new Error('dependencies must be an array');
    }
    
    dependencies.forEach((dep, index) => {
      validateString(dep, `dependencies[${index}]`);
    });
    
    this.plugin.dependencies = dependencies;
    return this;
  }

  /**
   * Sets the plugin install function.
   * 
   * @param installFn - Function called when plugin is installed
   * @returns Plugin builder for chaining
   */
  install(installFn: (system: any, config?: T) => void | Promise<void>): PluginBuilder<T> {
    validateFunction(installFn, 'installFn');
    this.plugin.install = installFn;
    return this;
  }

  /**
   * Sets the plugin uninstall function.
   * 
   * @param uninstallFn - Function called when plugin is uninstalled
   * @returns Plugin builder for chaining
   */
  uninstall(uninstallFn: (system: any) => void | Promise<void>): PluginBuilder<T> {
    validateFunction(uninstallFn, 'uninstallFn');
    this.plugin.uninstall = uninstallFn;
    return this;
  }

  /**
   * Sets default configuration for the plugin.
   * 
   * @param config - Default configuration object
   * @returns Plugin builder for chaining
   */
  config(config: T): PluginBuilder<T> {
    this.plugin.config = config;
    return this;
  }

  /**
   * Builds the plugin.
   * 
   * @returns Complete plugin object
   * @throws {Error} When required fields are missing
   */
  build(): Plugin<T> {
    if (!this.plugin.name || !this.plugin.version || !this.plugin.install) {
      throw new Error('Plugin must have name, version, and install function');
    }

    return this.plugin as Plugin<T>;
  }
}

/**
 * Creates a new plugin builder.
 * 
 * @param name - Plugin name
 * @param version - Plugin version
 * @returns Plugin builder
 * 
 * @example
 * ```typescript
 * const mathPlugin = createPlugin('math-utils', '1.0.0')
 *   .description('Mathematical utility functions')
 *   .install((system) => {
 *     system.registerFunction('square', (x: number) => x * x);
 *     system.registerFunction('cube', (x: number) => x * x * x);
 *   })
 *   .uninstall((system) => {
 *     system.unregisterFunction('square');
 *     system.unregisterFunction('cube');
 *   })
 *   .build();
 * ```
 */
export function createPlugin<T = any>(name: string, version: string): PluginBuilder<T> {
  return new PluginBuilder<T>(name, version);
}

/**
 * Creates a plugin from options object.
 * 
 * @param options - Plugin options
 * @param installFn - Install function
 * @param uninstallFn - Optional uninstall function
 * @returns Complete plugin object
 * 
 * @example
 * ```typescript
 * const stringPlugin = createPluginFromOptions(
 *   {
 *     name: 'string-utils',
 *     version: '1.0.0',
 *     description: 'String utility functions'
 *   },
 *   (system) => {
 *     system.registerFunction('reverse', (s: string) => s.split('').reverse().join(''));
 *   }
 * );
 * ```
 */
export function createPluginFromOptions<T = any>(
  options: PluginOptions<T>,
  installFn: (system: any, config?: T) => void | Promise<void>,
  uninstallFn?: (system: any) => void | Promise<void>
): Plugin<T> {
  const builder = createPlugin<T>(options.name, options.version);
  
  if (options.description) {
    builder.description(options.description);
  }
  
  if (options.dependencies) {
    builder.dependencies(options.dependencies);
  }
  
  if (options.config) {
    builder.config(options.config);
  }
  
  builder.install(installFn);
  
  if (uninstallFn) {
    builder.uninstall(uninstallFn);
  }
  
  return builder.build();
}