import { app } from 'electron';
import path from 'path';

export const MINERVA_PATH = path.join(app.getPath('home'), '.minerva');

export const PREFERENCES_PATH = path.join(MINERVA_PATH, 'preferences.json');
