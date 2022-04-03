import path from 'path';
import { app } from 'electron';

export const MINERVA_DIR = path.join(app.getPath('documents'), 'Minerva');
export const SECRETS_PATH = path.join(MINERVA_DIR, 'secrets.json');
