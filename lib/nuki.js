
/**
 * Sends a request to the Nuki Smart Lock API to perform an action on a smart lock.
 *
 * @param {string} smartlockid - The ID of the smart lock to perform the action on.
 * @param {string} action - The action to perform on the smart lock (e.g., "lock", "unlock").
 * @returns {Promise<Response>} The response from the Nuki Smart Lock API.
 * @throws {Error} If the request fails.
 */
export async function nukiSmartLockRequest(smartlockid, action) {
    const apiKey = process.env.NUKI_API_KEY;
    const response = await fetch(`${process.env.NUKI_API_URL}/smartlock/${smartlockid}/action/${action}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to action the door');
    }

    return response;
}