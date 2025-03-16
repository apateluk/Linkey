"use server";

import {auth} from "@/auth";
import { z } from "zod";

import { dbCreateLockEvent, dbGenerateLink, dbCheckLink } from "./dbfuncs";
import rateControlCache from "./nodecache";
import { nukiSmartLockRequest } from "./nuki";

/**
 * Unlocks the door with the given Link ID.
 *
 * @param {string} link_id - The UUID of the link.
 * @returns {Promise<{ success: boolean, message: string }>} - An object indicating the success or failure of the operation and a message.
 * @throws {Error} - Throws an error if the ID is invalid or if there is an issue locking the door.
 */
export async function unlockDoor(link_id) {
    try {
        const linkIdSchema = z.string().uuid();

        const { success, data } = linkIdSchema.safeParse(link_id);
        if (!success) {
            throw new Error('Unknown Error');
        }

        const cacheKey = `lockevent_${data}`;
        const lastLockEventime = rateControlCache.get(cacheKey);

        if (lastLockEventime && (Date.now() - lastLockEventime) < 10000) {
            throw new Error('Please wait 10 seconds before trying to unlock the door again');
        }
        rateControlCache.set(cacheKey, Date.now());

        const link = await dbCheckLink(data);
        if (link === null) {
            throw new Error('Link expired or invalid');
        }

        const response = await nukiSmartLockRequest(process.env.NUKI_SMARTLOCK_ID, 'unlock');
        console.log("Unlocking door: ", data);
        await dbCreateLockEvent(data, 'unlock', true, "");
        return { success: true, message: "Door unlocked successfully" };
    } catch (error) {
        console.error("Error unlocking door:", error);
        await dbCreateLockEvent(link_id, 'unlock', false, error.message);
        return { success: false, message: error.message };
    }
}

/**
 * Locks the door with the given Link ID.
 *
 * @param {string} link_id - The UUID of the link.
 * @returns {Promise<{ success: boolean, message: string }>} - An object indicating the success or failure of the operation and a message.
 * @throws {Error} - Throws an error if the ID is invalid or if there is an issue locking the door.
 */
export async function lockDoor(link_id) {
    try {
        const linkIdSchema = z.string().uuid();

        const { success, data } = linkIdSchema.safeParse(link_id);
        if (!success) {
            throw new Error('Unknown Error');
        }

        const cacheKey = `lockevent_${data}`;
        const lastLockEventime = rateControlCache.get(cacheKey);

        if (lastLockEventime && (Date.now() - lastLockEventime) < 10000) {
            throw new Error('Please wait 10 seconds before trying to lock the door again');
        }
        rateControlCache.set(cacheKey, Date.now());

        const link = await dbCheckLink(data);
        if (link === null) {
            throw new Error('Link expired or invalid');
        }

        const response = await nukiSmartLockRequest(process.env.NUKI_SMARTLOCK_ID, 'lock');
        console.log("Locking door: ", data);
        await dbCreateLockEvent(data, 'lock', true, "");
        return { success: true, message: "Door locked successfully" };
    } catch (error) {
        console.error("Error locking door:", error);
        await dbCreateLockEvent(link_id, 'lock', false, error.message);
        return { success: false, message: error.message };
    }
}

/**
 * Generates a link based on the provided data.
 *
 * @param {Object} data - The data required to generate the link.
 * @param {string} data.startDate - The start date in ISO format.
 * @param {string} data.startTime - The start time in HH:mm:ss format.
 * @param {string} data.endDate - The end date in ISO format.
 * @param {string} data.endTime - The end time in HH:mm:ss format.
 * @returns {Promise<Object>} - An object containing the success status and a message.
 * @throws {Error} - Throws an error if the end date and time are before the start date and time, or if there is an API authorization error.
 */
export async function generateLink(data) {
    try {
    const dataSchema = z.object({
        startDate: z.coerce.date(),
        startTime: z.string().time(),
        endDate: z.coerce.date(),
        endTime: z.string().time(),
      });
    const validatedData = dataSchema.parse(data);

    const startDateTime = new Date(`${validatedData.startDate.toISOString().split('T')[0]}T${validatedData.startTime}`);
    const endDateTime = new Date(`${validatedData.endDate.toISOString().split('T')[0]}T${validatedData.endTime}`);
    
    if (endDateTime <= startDateTime) {
        throw new Error('End date and time must be after start date and time');
    }

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      throw new Error("API Authorization error");
    }

    const link = await dbGenerateLink(startDateTime, endDateTime, session.user.email);
    await dbCreateLockEvent(link.url, 'register', true, session.user.email);
    const serverAddress = process.env.SERVER_ADDRESS;
    return { success: true, message: `${serverAddress}/?id=${link.url}` };
    } catch (error) {   
        console.error("Error generating link:", error);
        return { success: false, message: error.message };
    }
}