import { Router } from 'express';
import upload from '../config/upload';
import {
  checkStatus,
  downloadResult,
  processCSV,
} from '../controllers/csvController';

const router = Router();

/**
 * @swagger
 * /csv/process:
 *   post:
 *     summary: Processa o arquivo CSV
 *     tags: [CSV]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       202:
 *         description: O CSV está sendo processado
 *       400:
 *         description: Ocorreu um erro no processamento do CSV
 */
router.post('/process', upload.single('file'), processCSV);

/**
 * @swagger
 * /csv/status/{fileId}:
 *   get:
 *     summary: Verifica o status do processamento do arquivo
 *     tags: [CSV]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do arquivo
 *     responses:
 *       200:
 *         description: Status do processamento
 *       404:
 *         description: Arquivo não encontrado
 */
router.get('/status/:fileId', checkStatus);

/**
 * @swagger
 * /csv/download/{fileId}:
 *   get:
 *     summary: Faz o download do arquivo processado
 *     tags: [CSV]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do arquivo
 *     responses:
 *       200:
 *         description: Download do arquivo processado
 *       400:
 *         description: Processamento ainda não concluído
 *       404:
 *         description: Arquivo não encontrado
 */
router.get('/download/:fileId', downloadResult);

export default router;
