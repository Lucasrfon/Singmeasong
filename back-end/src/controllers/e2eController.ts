import { Request, Response } from 'express';
import { askPopulate, askTruncate } from '../services/e2eService.js';

export async function reset(req: Request, res: Response) {
    await askTruncate();
    res.sendStatus(200);
}

export async function preset(req: Request, res: Response) {
    await askPopulate();
    res.sendStatus(200);
}