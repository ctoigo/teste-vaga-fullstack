import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { parseCSV } from '../services/csvService';
import { getStatus, setStatus } from '../services/statusService';
import { formatCurrency, validateCPFOrCNPJ, validateValues } from '../utils';

export const processCSV = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'File is required' });
    return;
  }

  const fileId = uuidv4();
  setStatus(fileId, 'Processing');

  res.status(202).json({ message: 'File is being processed', fileId });

  const filePath = req.file.path;
  const resultFilePath = path.join(
    __dirname,
    '..',
    '..',
    'results',
    `${fileId}.csv`,
  );

  try {
    const data = await parseCSV(filePath);

    const processedData = data.map((item) => ({
      ...item,
      vlTotal: formatCurrency(parseFloat(item.vlTotal)),
      vlPresta: formatCurrency(parseFloat(item.vlPresta)),
      vlMora: formatCurrency(parseFloat(item.vlMora)),
      nrCpfCnpj: validateCPFOrCNPJ(item.nrCpfCnpj) ? item.nrCpfCnpj : 'Invalid',
      isValidValues: validateValues(
        parseFloat(item.vlTotal),
        parseInt(item.qtPrestacoes),
        parseFloat(item.vlPresta),
      ),
    }));

    const csvData = processedData
      .map((item) => Object.values(item).join(','))
      .join('\n');
    fs.writeFileSync(resultFilePath, csvData);

    setStatus(fileId, 'Completed', resultFilePath);
  } catch (error) {
    setStatus(fileId, 'Error');
  }
};

export const checkStatus = (req: Request, res: Response): void => {
  const fileId = req.params.fileId;
  const status = getStatus(fileId);
  res.status(200).json({ fileId, status });
};

export const downloadResult = (req: Request, res: Response): void => {
  const fileId = req.params.fileId;
  const status = getStatus(fileId);

  if (status !== 'Completed') {
    res.status(400).json({ error: 'File processing not completed' });
    return;
  }

  const statusData = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '..', '..', 'uploads', 'status.json'),
      'utf8',
    ),
  ) as { [key: string]: { resultFile: string } };
  const resultFilePath = statusData[fileId]?.resultFile;

  if (resultFilePath && fs.existsSync(resultFilePath)) {
    res.download(resultFilePath);
  } else {
    res.status(404).json({ error: 'Result file not found' });
  }
};
