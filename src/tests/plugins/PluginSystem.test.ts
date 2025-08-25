import { PluginSystem } from '../../plugins/PluginSystem';
import { createPlugin } from '../../plugins/createPlugin';
import { ValidationError } from '../../utils/errors';

describe('PluginSystem', () => {
  let pluginSystem: PluginSystem;

  beforeEach(() => {
    pluginSystem = new PluginSystem();
  });

  describe('plugin installation', () => {
    test('should install a valid plugin', async () => {
      const plugin = createPlugin('test-plugin', '1.0.0')
        .description('Test plugin')
        .install((system) => {
          system.registerFunction('test', () => 'test-result');
        })
        .build();

      await pluginSystem.install(plugin);

      expect(pluginSystem.hasPlugin('test-plugin')).toBe(true);
      expect(pluginSystem.hasFunction('test')).toBe(true);
      expect(pluginSystem.call('test')).toBe('test-result');
    });

    test('should install plugin with configuration', async () => {
      interface Config {
        prefix: string;
      }

      const plugin = createPlugin<Config>('config-plugin', '1.0.0')
        .install((system, config) => {
          system.registerFunction('greet', (name: string) => `${config?.prefix || 'Hello'} ${name}`);
        })
        .build();

      await pluginSystem.install(plugin, { prefix: 'Hi' });

      expect(pluginSystem.call('greet', 'World')).toBe('Hi World');
    });

    test('should throw error when installing duplicate plugin', async () => {
      const plugin = createPlugin('test-plugin', '1.0.0')
        .install(() => {})
        .build();

      await pluginSystem.install(plugin);

      await expect(pluginSystem.install(plugin)).rejects.toThrow("Plugin 'test-plugin' is already installed");
    });

    test('should check plugin dependencies', async () => {
      const dependentPlugin = createPlugin('dependent-plugin', '1.0.0')
        .dependencies(['base-plugin'])
        .install(() => {})
        .build();

      await expect(pluginSystem.install(dependentPlugin))
        .rejects.toThrow("Plugin 'dependent-plugin' requires dependency 'base-plugin'");
    });

    test('should install plugin with satisfied dependencies', async () => {
      const basePlugin = createPlugin('base-plugin', '1.0.0')
        .install(() => {})
        .build();

      const dependentPlugin = createPlugin('dependent-plugin', '1.0.0')
        .dependencies(['base-plugin'])
        .install(() => {})
        .build();

      await pluginSystem.install(basePlugin);
      await pluginSystem.install(dependentPlugin);

      expect(pluginSystem.hasPlugin('base-plugin')).toBe(true);
      expect(pluginSystem.hasPlugin('dependent-plugin')).toBe(true);
    });

    test('should emit plugin:installed event', async () => {
      const listener = jest.fn();
      pluginSystem.on('plugin:installed', listener);

      const plugin = createPlugin('test-plugin', '1.0.0')
        .install(() => {})
        .build();

      await pluginSystem.install(plugin);

      expect(listener).toHaveBeenCalledWith(plugin);
    });

    test('should validate plugin object', async () => {
      await expect(pluginSystem.install(null as any)).rejects.toThrow(ValidationError);
      await expect(pluginSystem.install({} as any)).rejects.toThrow(ValidationError);
      await expect(pluginSystem.install({ name: 'test' } as any)).rejects.toThrow(ValidationError);
    });
  });

  describe('plugin uninstallation', () => {
    test('should uninstall plugin', async () => {
      const plugin = createPlugin('test-plugin', '1.0.0')
        .install((system) => {
          system.registerFunction('test', () => 'test');
        })
        .uninstall((system) => {
          system.unregisterFunction('test');
        })
        .build();

      await pluginSystem.install(plugin);
      await pluginSystem.uninstall('test-plugin');

      expect(pluginSystem.hasPlugin('test-plugin')).toBe(false);
      expect(pluginSystem.hasFunction('test')).toBe(false);
    });

    test('should prevent uninstalling plugin with dependents', async () => {
      const basePlugin = createPlugin('base-plugin', '1.0.0')
        .install(() => {})
        .build();

      const dependentPlugin = createPlugin('dependent-plugin', '1.0.0')
        .dependencies(['base-plugin'])
        .install(() => {})
        .build();

      await pluginSystem.install(basePlugin);
      await pluginSystem.install(dependentPlugin);

      await expect(pluginSystem.uninstall('base-plugin'))
        .rejects.toThrow("Cannot uninstall 'base-plugin' - plugin 'dependent-plugin' depends on it");
    });

    test('should throw error when uninstalling non-existent plugin', async () => {
      await expect(pluginSystem.uninstall('non-existent'))
        .rejects.toThrow("Plugin 'non-existent' is not installed");
    });

    test('should emit plugin:uninstalled event', async () => {
      const listener = jest.fn();
      pluginSystem.on('plugin:uninstalled', listener);

      const plugin = createPlugin('test-plugin', '1.0.0')
        .install(() => {})
        .build();

      await pluginSystem.install(plugin);
      await pluginSystem.uninstall('test-plugin');

      expect(listener).toHaveBeenCalledWith(plugin);
    });
  });

  describe('function management', () => {
    test('should register and call functions', () => {
      pluginSystem.registerFunction('add', (a: number, b: number) => a + b);

      expect(pluginSystem.hasFunction('add')).toBe(true);
      expect(pluginSystem.call('add', 2, 3)).toBe(5);
    });

    test('should throw error when registering duplicate function', () => {
      pluginSystem.registerFunction('test', () => 'test1');

      expect(() => pluginSystem.registerFunction('test', () => 'test2'))
        .toThrow("Function 'test' is already registered");
    });

    test('should unregister functions', () => {
      pluginSystem.registerFunction('test', () => 'test');
      pluginSystem.unregisterFunction('test');

      expect(pluginSystem.hasFunction('test')).toBe(false);
    });

    test('should throw error when unregistering non-existent function', () => {
      expect(() => pluginSystem.unregisterFunction('non-existent'))
        .toThrow("Function 'non-existent' is not registered");
    });

    test('should throw error when calling non-existent function', () => {
      expect(() => pluginSystem.call('non-existent'))
        .toThrow("Function 'non-existent' is not registered");
    });

    test('should get function names', () => {
      pluginSystem.registerFunction('func1', () => {});
      pluginSystem.registerFunction('func2', () => {});

      const names = pluginSystem.getFunctionNames();
      expect(names).toContain('func1');
      expect(names).toContain('func2');
    });

    test('should emit function events', () => {
      const registeredListener = jest.fn();
      const unregisteredListener = jest.fn();

      pluginSystem.on('function:registered', registeredListener);
      pluginSystem.on('function:unregistered', unregisteredListener);

      const testFn = () => 'test';
      pluginSystem.registerFunction('test', testFn);
      pluginSystem.unregisterFunction('test');

      expect(registeredListener).toHaveBeenCalledWith('test', testFn);
      expect(unregisteredListener).toHaveBeenCalledWith('test');
    });
  });

  describe('event system', () => {
    test('should emit and listen to events', () => {
      const listener = jest.fn();
      pluginSystem.on('test-event', listener);

      pluginSystem.emit('test-event', 'arg1', 'arg2');

      expect(listener).toHaveBeenCalledWith('arg1', 'arg2');
    });

    test('should remove event listeners', () => {
      const listener = jest.fn();
      pluginSystem.on('test-event', listener);
      pluginSystem.off('test-event', listener);

      pluginSystem.emit('test-event', 'test');

      expect(listener).not.toHaveBeenCalled();
    });

    test('should handle multiple listeners for same event', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      pluginSystem.on('test-event', listener1);
      pluginSystem.on('test-event', listener2);

      pluginSystem.emit('test-event', 'test');

      expect(listener1).toHaveBeenCalledWith('test');
      expect(listener2).toHaveBeenCalledWith('test');
    });

    test('should handle listener errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      pluginSystem.on('test-event', () => {
        throw new Error('Listener error');
      });

      expect(() => pluginSystem.emit('test-event')).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('plugin queries', () => {
    test('should get plugin information', async () => {
      const plugin = createPlugin('test-plugin', '1.0.0')
        .description('Test plugin')
        .install(() => {})
        .build();

      await pluginSystem.install(plugin);

      const retrieved = pluginSystem.getPlugin('test-plugin');
      expect(retrieved).toBe(plugin);
      expect(retrieved?.description).toBe('Test plugin');
    });

    test('should return undefined for non-existent plugin', () => {
      const result = pluginSystem.getPlugin('non-existent');
      expect(result).toBeUndefined();
    });

    test('should get all plugins', async () => {
      const plugin1 = createPlugin('plugin1', '1.0.0').install(() => {}).build();
      const plugin2 = createPlugin('plugin2', '1.0.0').install(() => {}).build();

      await pluginSystem.install(plugin1);
      await pluginSystem.install(plugin2);

      const plugins = pluginSystem.getPlugins();
      expect(plugins).toHaveLength(2);
      expect(plugins.map(p => p.name)).toEqual(expect.arrayContaining(['plugin1', 'plugin2']));
    });
  });

  describe('validation', () => {
    test('should validate string parameters', () => {
      expect(() => pluginSystem.registerFunction(null as any, () => {})).toThrow(ValidationError);
      expect(() => pluginSystem.hasPlugin(null as any)).toThrow(ValidationError);
      expect(() => pluginSystem.call(null as any)).toThrow(ValidationError);
    });

    test('should validate function parameters', () => {
      expect(() => pluginSystem.registerFunction('test', null as any)).toThrow(ValidationError);
      expect(() => pluginSystem.on('event', null as any)).toThrow(ValidationError);
    });
  });
});