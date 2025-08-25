const { deepMerge, pick, omit } = require('@oxog/collections');

// Example 1: DeepMerge - Merge objects recursively
console.log('=== DeepMerge Example ===');
const defaultConfig = {
  server: {
    port: 3000,
    host: 'localhost',
    ssl: false
  },
  database: {
    type: 'postgresql',
    host: 'localhost',
    port: 5432
  },
  logging: {
    level: 'info',
    format: 'json'
  }
};

const userConfig = {
  server: {
    port: 8080,
    ssl: true
  },
  database: {
    host: 'db.example.com',
    username: 'admin',
    password: 'secret'
  }
};

const finalConfig = deepMerge(defaultConfig, userConfig);
console.log('Default config:', JSON.stringify(defaultConfig, null, 2));
console.log('\nUser config:', JSON.stringify(userConfig, null, 2));
console.log('\nMerged config:', JSON.stringify(finalConfig, null, 2));

// Example 2: Pick - Select specific properties
console.log('\n=== Pick Example ===');
const userProfile = {
  id: 12345,
  username: 'johndoe',
  email: 'john@example.com',
  password: 'hashedPassword123',
  apiKey: 'secret-api-key',
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  createdAt: '2024-01-01',
  lastLogin: '2024-01-25'
};

// Create public profile by picking only safe fields
const publicProfile = pick(userProfile, ['id', 'username', 'firstName', 'lastName']);
console.log('Full profile:', userProfile);
console.log('\nPublic profile:', publicProfile);

// Create different views for different purposes
const contactInfo = pick(userProfile, ['email', 'firstName', 'lastName']);
const authInfo = pick(userProfile, ['id', 'username', 'password']);
const metadata = pick(userProfile, ['createdAt', 'lastLogin']);

console.log('\nContact info:', contactInfo);
console.log('Auth info:', authInfo);
console.log('Metadata:', metadata);

// Example 3: Omit - Remove specific properties
console.log('\n=== Omit Example ===');
const apiResponse = {
  data: {
    users: ['user1', 'user2'],
    count: 2
  },
  meta: {
    timestamp: Date.now(),
    requestId: 'abc-123'
  },
  _internal: {
    processingTime: 45,
    cacheHit: true
  },
  _debug: {
    query: 'SELECT * FROM users',
    executionPlan: 'detailed plan...'
  }
};

// Remove internal fields before sending to client
const clientResponse = omit(apiResponse, ['_internal', '_debug']);
console.log('Original response:', JSON.stringify(apiResponse, null, 2));
console.log('\nClient response:', JSON.stringify(clientResponse, null, 2));

// Example 4: Combining operations
console.log('\n=== Combining Operations ===');

// Scenario: Updating user settings with defaults
const defaultSettings = {
  theme: 'light',
  notifications: {
    email: true,
    push: false,
    sms: false
  },
  privacy: {
    profileVisible: true,
    showEmail: false,
    showPhone: false
  }
};

const userSettings = {
  theme: 'dark',
  notifications: {
    push: true
  },
  privacy: {
    showEmail: true
  }
};

// Merge user settings with defaults
const mergedSettings = deepMerge(defaultSettings, userSettings);

// Create a view without sensitive privacy settings for display
const displaySettings = omit(mergedSettings, ['privacy']);

// Or pick only what we want to show in the UI
const uiSettings = pick(mergedSettings, ['theme', 'notifications']);

console.log('Default settings:', JSON.stringify(defaultSettings, null, 2));
console.log('\nUser settings:', JSON.stringify(userSettings, null, 2));
console.log('\nMerged settings:', JSON.stringify(mergedSettings, null, 2));
console.log('\nDisplay settings (privacy omitted):', JSON.stringify(displaySettings, null, 2));
console.log('\nUI settings (picked fields):', JSON.stringify(uiSettings, null, 2));

// Example 5: Working with API data
console.log('\n=== API Data Processing ===');
const rawApiData = {
  user_id: 123,
  user_name: 'alice',
  user_email: 'alice@example.com',
  created_timestamp: 1706140800,
  updated_timestamp: 1706227200,
  is_active: true,
  meta_data: {
    last_ip: '192.168.1.1',
    user_agent: 'Mozilla/5.0...',
    session_id: 'sess_123'
  }
};

// Transform snake_case to camelCase and restructure
const transformedData = {
  id: rawApiData.user_id,
  name: rawApiData.user_name,
  email: rawApiData.user_email,
  timestamps: pick(rawApiData, ['created_timestamp', 'updated_timestamp']),
  status: { active: rawApiData.is_active },
  // Omit sensitive metadata
  metadata: omit(rawApiData.meta_data, ['last_ip', 'session_id'])
};

console.log('Raw API data:', JSON.stringify(rawApiData, null, 2));
console.log('\nTransformed data:', JSON.stringify(transformedData, null, 2));