import prisma from "./client";
import { randomUUID } from "crypto";

export async function dbCreateLockEvent(url, eventType, success, message) {
    const result = await prisma.LockEvent.create({
        data: {
            url: url,
            eventType: eventType,
            success: success,
            message: message,
        },
    });
    return result;
}

export async function dbGenerateLink(startTime, endTime, createdBy) {
    const uuid = randomUUID();
    const result = await prisma.TemporaryLink.create({
        data: {
            url: uuid,
            startTime: startTime,
            endTime: endTime,
            createdBy: createdBy,
        },
    });
    return result;
}

export async function dbCheckLink(url) {
    const result = await prisma.TemporaryLink.findUnique({
        where: {
            url: url,
        },
    });

    if (result) {
        const currentTime = new Date().toISOString(); // Get current time in UTC
        if (currentTime >= result.startTime.toISOString() && currentTime <= result.endTime.toISOString()) {
            return result;
        } else {
            return null; 
        }
    }

    return null; 
}