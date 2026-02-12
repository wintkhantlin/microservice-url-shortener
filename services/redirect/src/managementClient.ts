const MANAGEMENT_SERVICE_URL = process.env.MANAGEMENT_SERVICE_URL || 'http://localhost:8000';

export async function fetchAliasFromManagement(code: string): Promise<string | null> {
  try {
    const response = await fetch(`${MANAGEMENT_SERVICE_URL}/aliases/${code}`, {
      headers: {
        'x-user-id': 'system-redirect-service', // Or any internal identifier if needed
      },
    });

    if (response.status === 200) {
      const data = await response.json() as { target: string };
      return data.target;
    }

    if (response.status === 404) {
      return null;
    }

    console.error(`Management service returned ${response.status} for code ${code}`);
    return null;
  } catch (error) {
    console.error('Error fetching alias from management service:', error);
    return null;
  }
}
