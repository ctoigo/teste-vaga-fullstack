import csv from 'csv-parser';
import fs from 'fs';
import { parseCSV } from '../../src/services/csvService';

jest.mock('fs');
jest.mock('csv-parser');

describe('parseCSV', () => {
  const mockData = [
    { column1: 'value1', column2: 'value2' },
    { column1: 'value3', column2: 'value4' },
  ];

  interface MockStream {
    pipe: jest.Mock<any, any>;
    on: jest.Mock<any, any>;
  }

  const mockStream: MockStream = {
    pipe: jest.fn().mockReturnThis(),
    on: jest.fn(),
  };

  beforeEach(() => {
    (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);
    (csv as jest.Mock).mockReturnValue(mockStream);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should parse CSV file and resolve data', async () => {
    const filePath = 'test.csv';

    (mockStream.on as jest.Mock).mockImplementation(
      (event: string, callback: Function) => {
        if (event === 'data') {
          mockData.forEach((row) => callback(row));
        } else if (event === 'end') {
          callback();
        }
        return mockStream;
      },
    );

    const result = await parseCSV(filePath);
    expect(result).toEqual(mockData);
    expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
    expect(csv).toHaveBeenCalled();
  });

  test('should reject on error', async () => {
    const filePath = 'test.csv';

    (mockStream.on as jest.Mock).mockImplementation(
      (event: string, callback: Function) => {
        if (event === 'error') {
          callback(new Error('Test Error'));
        }
        return mockStream;
      },
    );

    await expect(parseCSV(filePath)).rejects.toThrow('Test Error');
  });
});
