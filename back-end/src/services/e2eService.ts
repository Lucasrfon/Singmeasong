import { populate, truncate } from "../repositories/e2eRepository.js";

export async function askTruncate() {
    await truncate();
}

export async function askPopulate() {
    await populate();
}