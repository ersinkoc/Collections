const { chunk, distinct, groupBy, partition } = require('@oxog/collections');

// Example 1: Chunk - Split array into smaller chunks
console.log('=== Chunk Example ===');
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const chunked = chunk(numbers, 3);
console.log('Original:', numbers);
console.log('Chunked by 3:', chunked);
// Output: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]

// Example 2: Distinct - Remove duplicates
console.log('\n=== Distinct Example ===');
const duplicates = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
const unique = distinct(duplicates);
console.log('With duplicates:', duplicates);
console.log('Unique values:', unique);
// Output: [1, 2, 3, 4]

// Example 3: GroupBy - Group by a property
console.log('\n=== GroupBy Example ===');
const users = [
  { name: 'Alice', age: 25, role: 'admin' },
  { name: 'Bob', age: 30, role: 'user' },
  { name: 'Charlie', age: 25, role: 'user' },
  { name: 'Diana', age: 30, role: 'admin' },
  { name: 'Eve', age: 35, role: 'user' }
];

const groupedByAge = groupBy(users, user => user.age);
console.log('Users grouped by age:');
console.log(JSON.stringify(groupedByAge, null, 2));

const groupedByRole = groupBy(users, user => user.role);
console.log('\nUsers grouped by role:');
console.log(JSON.stringify(groupedByRole, null, 2));

// Example 4: Partition - Split array by condition
console.log('\n=== Partition Example ===');
const mixedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const [evens, odds] = partition(mixedNumbers, n => n % 2 === 0);
console.log('Original:', mixedNumbers);
console.log('Even numbers:', evens);
console.log('Odd numbers:', odds);

// Example 5: Combining operations
console.log('\n=== Combining Operations ===');
const data = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5];

// First remove duplicates, then partition
const uniqueData = distinct(data);
const [lessThanThree, threeOrMore] = partition(uniqueData, n => n < 3);

console.log('Original data:', data);
console.log('Unique values:', uniqueData);
console.log('Values < 3:', lessThanThree);
console.log('Values >= 3:', threeOrMore);

// Group and then chunk
const students = [
  { name: 'Student1', grade: 'A' },
  { name: 'Student2', grade: 'B' },
  { name: 'Student3', grade: 'A' },
  { name: 'Student4', grade: 'C' },
  { name: 'Student5', grade: 'B' },
  { name: 'Student6', grade: 'A' },
  { name: 'Student7', grade: 'B' },
  { name: 'Student8', grade: 'A' }
];

const byGrade = groupBy(students, s => s.grade);
console.log('\n=== Students by Grade ===');
for (const [grade, studentList] of Object.entries(byGrade)) {
  console.log(`Grade ${grade}: ${studentList.length} students`);
  // Chunk students into groups of 2 for pair work
  const pairs = chunk(studentList, 2);
  pairs.forEach((pair, index) => {
    console.log(`  Pair ${index + 1}:`, pair.map(s => s.name).join(' & '));
  });
}