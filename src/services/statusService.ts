import fs from 'fs';
import path from 'path';

const statusFilePath = path.join(
  __dirname,
  '..',
  '..',
  'uploads',
  'status.json',
);

interface FileStatus {
  [key: string]: {
    status: string;
    resultFile?: string;
  };
}

export const getStatus = (fileId: string): string => {
  if (fs.existsSync(statusFilePath)) {
    const statusData = JSON.parse(
      fs.readFileSync(statusFilePath, 'utf8'),
    ) as FileStatus;
    return statusData[fileId]?.status || 'Not Found';
  }
  return 'Not Found';
};

export const setStatus = (
  fileId: string,
  status: string,
  resultFile?: string,
): void => {
  let statusData: FileStatus = {};
  if (fs.existsSync(statusFilePath)) {
    statusData = JSON.parse(
      fs.readFileSync(statusFilePath, 'utf8'),
    ) as FileStatus;
  }
  statusData[fileId] = { status, resultFile };
  fs.writeFileSync(statusFilePath, JSON.stringify(statusData));
};
