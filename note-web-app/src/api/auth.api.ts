import { env } from "process";

interface AuthResponse {
  accessToken: string;
}

export default class AuthApi {
  private static async sendRequest<T>(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<T> {
    const url = `${env.NOTE_API_URL}/auth/${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();

      return responseJson;
    } catch (error) {
      throw error;
    }
  }

  public static async signIn(accessToken: string): Promise<AuthResponse> {
    return this.sendRequest("sign-in", "POST", { accessToken });
  }

  public static async signUp(accessToken: string): Promise<AuthResponse> {
    return this.sendRequest("sign-up", "POST", { accessToken });
  }
}
