import { validateObject, validateString, validateFunction } from '../utils/validators';

/**
 * Plugin interface for extending collections functionality.
 * 
 * @template T - The type of configuration options for the plugin
 * @since 1.0.0
 */
export interface Plugin<T = any> {
  name: string;
  version: string;
  description?: string;
  dependencies?: string[];
  install: (system: PluginSystem, config?: T) => void | Promise<void>;
  uninstall?: (system: PluginSystem) => void | Promise<void>;
  config?: T;
}

/**
 * Plugin context for accessing system functionality.
 * 
 * @since 1.0.0
 */
export interface PluginContext {
  registerFunction: (name: string, fn: Function) => void;
  unregisterFunction: (name: string) => void;
  getFunction: (name: string) => Function | undefined;
  emit: (event: string, ...args: any[]) => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
  off: (event: string, listener: (...args: any[]) => void) => void;
}

/**
 * Main plugin system for managing extensions.
 * 
 * @since 1.0.0
 */
export class PluginSystem {
  private plugins = new Map<string, Plugin>();
  private functions = new Map<string, Function>();
  private eventListeners = new Map<string, Set<(...args: any[]) => void>>();
  // Track listeners added by each plugin for cleanup on uninstall
  private pluginListeners = new Map<string, Map<string, Set<(...args: any[]) => void>>>();
  // Track which plugin is currently being installed (for listener attribution)
  private currentlyInstallingPlugin: string | null = null;

  /**
   * Installs a plugin into the system.
   * 
   * @param plugin - Plugin to install
   * @param config - Optional configuration for the plugin
   * @throws {ValidationError} When plugin is invalid
   * 
   * @example
   * ```typescript
   * const mathPlugin: Plugin = {
   *   name: 'math-utils',
   *   version: '1.0.0',
   *   install: (system) => {
   *     system.registerFunction('square', (x: number) => x * x);
   *   }
   * };
   * 
   * const pluginSystem = new PluginSystem();
   * await pluginSystem.install(mathPlugin);
   * ```
   */
  async install<T = any>(plugin: Plugin<T>, config?: T): Promise<void> {
    validateObject(plugin, 'plugin');
    validateString(plugin.name, 'plugin.name');
    validateString(plugin.version, 'plugin.version');
    validateFunction(plugin.install, 'plugin.install');

    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin '${plugin.name}' is already installed`);
    }

    // Check dependencies
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(`Plugin '${plugin.name}' requires dependency '${dep}'`);
        }
      }
    }

    // Install the plugin
    plugin.config = config;

    // Track which plugin is being installed so event listeners can be attributed to it
    this.currentlyInstallingPlugin = plugin.name;
    this.pluginListeners.set(plugin.name, new Map());

    try {
      await plugin.install(this, config);
      this.plugins.set(plugin.name, plugin);
      this.emit('plugin:installed', plugin);
    } finally {
      // Clear installation context even if install fails
      this.currentlyInstallingPlugin = null;
    }
  }

  /**
   * Uninstalls a plugin from the system.
   * 
   * @param name - Name of plugin to uninstall
   * @throws {Error} When plugin is not found or has dependents
   */
  async uninstall(name: string): Promise<void> {
    validateString(name, 'name');

    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin '${name}' is not installed`);
    }

    // Check if other plugins depend on this one
    for (const [, installedPlugin] of this.plugins) {
      if (installedPlugin.dependencies?.includes(name)) {
        throw new Error(`Cannot uninstall '${name}' - plugin '${installedPlugin.name}' depends on it`);
      }
    }

    // Uninstall the plugin
    if (plugin.uninstall) {
      await plugin.uninstall(this);
    }

    // Clean up all event listeners registered by this plugin
    const pluginEventListeners = this.pluginListeners.get(name);
    if (pluginEventListeners) {
      for (const [event, listeners] of pluginEventListeners) {
        const globalListeners = this.eventListeners.get(event);
        if (globalListeners) {
          for (const listener of listeners) {
            globalListeners.delete(listener);
          }
          // Clean up empty event listener sets
          if (globalListeners.size === 0) {
            this.eventListeners.delete(event);
          }
        }
      }
      this.pluginListeners.delete(name);
    }

    this.plugins.delete(name);
    this.emit('plugin:uninstalled', plugin);
  }

  /**
   * Gets information about an installed plugin.
   * 
   * @param name - Name of plugin to get
   * @returns Plugin information or undefined
   */
  getPlugin(name: string): Plugin | undefined {
    validateString(name, 'name');
    return this.plugins.get(name);
  }

  /**
   * Gets list of all installed plugins.
   * 
   * @returns Array of installed plugins
   */
  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Registers a function that can be called by name.
   * 
   * @param name - Function name
   * @param fn - Function to register
   */
  registerFunction(name: string, fn: Function): void {
    validateString(name, 'name');
    validateFunction(fn, 'fn');

    if (this.functions.has(name)) {
      throw new Error(`Function '${name}' is already registered`);
    }

    this.functions.set(name, fn);
    this.emit('function:registered', name, fn);
  }

  /**
   * Unregisters a function.
   * 
   * @param name - Function name to unregister
   */
  unregisterFunction(name: string): void {
    validateString(name, 'name');
    
    if (!this.functions.has(name)) {
      throw new Error(`Function '${name}' is not registered`);
    }

    this.functions.delete(name);
    this.emit('function:unregistered', name);
  }

  /**
   * Gets a registered function by name.
   * 
   * @param name - Function name
   * @returns Function or undefined
   */
  getFunction(name: string): Function | undefined {
    validateString(name, 'name');
    return this.functions.get(name);
  }

  /**
   * Calls a registered function by name.
   * 
   * @param name - Function name
   * @param args - Arguments to pass to function
   * @returns Function result
   */
  call(name: string, ...args: any[]): any {
    validateString(name, 'name');
    
    const fn = this.functions.get(name);
    if (!fn) {
      throw new Error(`Function '${name}' is not registered`);
    }

    return fn(...args);
  }

  /**
   * Emits an event to all listeners.
   * 
   * @param event - Event name
   * @param args - Event arguments
   */
  emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in event listener for '${event}':`, error);
        }
      });
    }
  }

  /**
   * Adds an event listener.
   *
   * @param event - Event name
   * @param listener - Event listener function
   */
  on(event: string, listener: (...args: any[]) => void): void {
    validateString(event, 'event');
    validateFunction(listener, 'listener');

    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }

    this.eventListeners.get(event)!.add(listener);

    // If a plugin is currently being installed, track this listener for cleanup on uninstall
    if (this.currentlyInstallingPlugin) {
      const pluginEventListeners = this.pluginListeners.get(this.currentlyInstallingPlugin);
      if (pluginEventListeners) {
        if (!pluginEventListeners.has(event)) {
          pluginEventListeners.set(event, new Set());
        }
        pluginEventListeners.get(event)!.add(listener);
      }
    }
  }

  /**
   * Removes an event listener.
   *
   * @param event - Event name
   * @param listener - Event listener function to remove
   */
  off(event: string, listener: (...args: any[]) => void): void {
    validateString(event, 'event');
    validateFunction(listener, 'listener');

    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.eventListeners.delete(event);
      }
    }

    // Also remove from plugin listener tracking
    for (const [, pluginEventListeners] of this.pluginListeners) {
      const pluginListenersForEvent = pluginEventListeners.get(event);
      if (pluginListenersForEvent) {
        pluginListenersForEvent.delete(listener);
        if (pluginListenersForEvent.size === 0) {
          pluginEventListeners.delete(event);
        }
      }
    }
  }

  /**
   * Gets list of all registered function names.
   * 
   * @returns Array of function names
   */
  getFunctionNames(): string[] {
    return Array.from(this.functions.keys());
  }

  /**
   * Checks if a function is registered.
   * 
   * @param name - Function name
   * @returns True if function is registered
   */
  hasFunction(name: string): boolean {
    validateString(name, 'name');
    return this.functions.has(name);
  }

  /**
   * Checks if a plugin is installed.
   * 
   * @param name - Plugin name
   * @returns True if plugin is installed
   */
  hasPlugin(name: string): boolean {
    validateString(name, 'name');
    return this.plugins.has(name);
  }
}