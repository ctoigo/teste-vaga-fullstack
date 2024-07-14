import fs from 'fs';
import path from 'path';
import { getStatus, setStatus } from '../../src/services/statusService';

jest.mock('fs');

const statusFilePath = path.join(__dirname, '../../uploads/status.json');

beforeEach(() => {
  (fs.existsSync as jest.Mock).mockReturnValue(true);
  (fs.readFileSync as jest.Mock).mockReturnValue('{}');
  (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

test('should set and get status', () => {
  const fileId = 'testFile';
  const status = 'Processing';

  setStatus(fileId, status);
  (fs.readFileSync as jest.Mock).mockReturnValue(
    JSON.stringify({ [fileId]: { status } }),
  );

  const result = getStatus(fileId);
  expect(result).toBe(status);
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    statusFilePath,
    JSON.stringify({ [fileId]: { status } }),
  );
});

test('should return "Not Found" for unknown fileId', () => {
  const result = getStatus('unknownFile');
  expect(result).toBe('Not Found');
});
