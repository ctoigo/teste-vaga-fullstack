import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  checkStatus,
  downloadResult,
  processCSV,
} from '../../src/controllers/csvController';
import { parseCSV } from '../../src/services/csvService';
import { getStatus, setStatus } from '../../src/services/statusService';

jest.mock('fs');
jest.mock('../../src/services/csvService');
jest.mock('../../src/services/statusService');
jest.mock('uuid');

const mockRequest = (
  file: Express.Multer.File,
  params = {},
): Partial<Request> => ({
  file,
  params,
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.download = jest.fn().mockReturnValue(res);
  return res;
};

describe('CSV Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should process CSV file and return 202', async () => {
    const req = mockRequest({
      path: 'test.csv',
    } as Express.Multer.File) as Request;
    const res = mockResponse() as Response;
    (parseCSV as jest.Mock).mockResolvedValue([
      {
        vlTotal: '1000',
        qtPrestacoes: '10',
        vlPresta: '100',
        vlMora: '10',
        nrCpfCnpj: '12345678909',
      },
    ]);
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (uuidv4 as jest.Mock).mockReturnValue('1234');
    (setStatus as jest.Mock).mockImplementation(() => {});

    await processCSV(req, res);

    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalledWith({
      message: 'File is being processed',
      fileId: '1234',
    });
  });

  test('should return status of file processing', () => {
    const req = mockRequest({} as Express.Multer.File, {
      fileId: 'testFile',
    }) as Request;
    const res = mockResponse() as Response;
    (getStatus as jest.Mock).mockReturnValue('Processing');

    checkStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      fileId: 'testFile',
      status: 'Processing',
    });
  });

  test('should download result file if processing completed', () => {
    const req = mockRequest({} as Express.Multer.File, {
      fileId: 'testFile',
    }) as Request;
    const res = mockResponse() as Response;
    (getStatus as jest.Mock).mockReturnValue('Completed');
    const resultFilePath = path.join(__dirname, '../../results/testFile.csv');
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ testFile: { resultFile: resultFilePath } }),
    );
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    downloadResult(req, res);

    expect(res.download).toHaveBeenCalledWith(resultFilePath);
  });

  test('should return 400 if file processing not completed', () => {
    const req = mockRequest({} as Express.Multer.File, {
      fileId: 'testFile',
    }) as Request;
    const res = mockResponse() as Response;
    (getStatus as jest.Mock).mockReturnValue('Processing');

    downloadResult(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'File processing not completed',
    });
  });

  test('should return 404 if result file not found', () => {
    const req = mockRequest({} as Express.Multer.File, {
      fileId: 'testFile',
    }) as Request;
    const res = mockResponse() as Response;
    (getStatus as jest.Mock).mockReturnValue('Completed');
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ testFile: { resultFile: 'notExistingFile.csv' } }),
    );
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    downloadResult(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Result file not found' });
  });
});
