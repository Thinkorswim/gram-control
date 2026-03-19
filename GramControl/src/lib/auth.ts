import { User } from "../entrypoints/models/User";

export interface AuthResponse {
  user?: {
    email: string;
    emailVerified: boolean;
    authToken: string;
    extensionsPlus?: boolean;
  };

  message?: string;
}

export interface UserData {
  data: {
    email: string;
    emailVerified: boolean;
    authToken: string;
    extensionsPlus: boolean;
  };
}

export const signUpRequest = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch("https://api.groundedmomentum.com/api/auth/sign-up/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }

  return await response.json();
};

export const signInRequest = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch("https://api.groundedmomentum.com/api/auth/sign-in/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "omit",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  return await response.json();
};

export const forgotPasswordRequest = async (
  email: string
): Promise<{ message: string }> => {
  const response = await fetch(
    "https://api.groundedmomentum.com/api/auth/forget-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        redirectTo: "https://api.groundedmomentum.com/", // Change to your extension's URL
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send password reset email");
  }

  return await response.json();
};

export const resendVerificationEmailRequest = async (
  email: string
): Promise<{ message: string }> => {
  const response = await fetch(
    "https://api.groundedmomentum.com/api/auth/send-verification-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send verification email");
  }

  return await response.json();
};

export const getUserData = async (
  authToken: string
): Promise<UserData | null> => {
  try {
    const response = await fetch("https://api.groundedmomentum.com/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error("Failed to fetch user data");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching user data:", err);
    return null;
  }
};

export const loadUserFromStorage = async (): Promise<User | null> => {
  try {
    const result = await browser.storage.local.get(["user"]);
    const savedUser = result.user;

    if (!savedUser) {
      return null;
    }

    const freshUserData = await getUserData(savedUser.authToken);

    if (freshUserData && freshUserData.data) {
      const updatedUserData = {
        email: freshUserData.data.email,
        emailVerified: freshUserData.data.emailVerified || false,
        authToken: savedUser.authToken,
        extensionsPlus: freshUserData.data.extensionsPlus || false,
      };
      const updatedUser = User.fromJSON(updatedUserData);
      saveUserToStorage(updatedUser);
      return updatedUser;
    } else {
      clearUserFromStorage();
      return null;
    }
  } catch (err) {
    console.error("Error loading user data:", err);
    clearUserFromStorage();
    return null;
  }
};

export const saveUserToStorage = (user: User): void => {
  browser.storage.local.set({ user: user.toJSON() });
};

export const clearUserFromStorage = (): void => {
  browser.storage.local.remove(["user"]);
};

export const signOutRequest = async (authToken: string): Promise<{ message: string }> => {
  try {
    const response = await fetch("https://api.groundedmomentum.com/api/auth/sign-out", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      credentials: "include", // Important: Include cookies in cross-origin requests
      body: JSON.stringify({}),
    });

    clearUserFromStorage();

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sign out failed");
    }

    return await response.json();
  } catch (error) {
    clearUserFromStorage();
    console.error("Sign out error:", error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    // Get the redirect URL - Firefox and Chrome handle this differently

    const initResponse = await fetch(
      "https://api.groundedmomentum.com/api/auth/sign-in/social",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          disableRedirect: true,
        }),
      }
    );

    let { url: authUrl, secureToken } = await initResponse.json();

    if (!secureToken) {
      throw new Error("No secureToken parameter found in auth URL");
    }

    // Open auth URL in a popup using browser.windows API
    // Center the popup on the screen
    const width = 500;
    const height = 600;

    const currentWindow = await browser.windows.getCurrent();
    const left = Math.round(
      (currentWindow.width || screen.width) / 2 -
        width / 2 +
        (currentWindow.left || 0)
    );
    const top = Math.round(
      (currentWindow.height || screen.height) / 2 -
        height / 2 +
        (currentWindow.top || 0)
    );

    const popupWindow = await browser.windows.create({
      url: authUrl,
      type: "popup",
      width: width,
      height: height,
      left: left,
      top: top,
    });

    if (!popupWindow || !popupWindow.id) {
      throw new Error("Failed to open popup window");
    }

    const windowId = popupWindow.id;

    await new Promise<void>((resolve) => {
      const checkUrl = async () => {
        try {
          const tabs = await browser.tabs.query({ windowId });
          if (tabs.length > 0 && tabs[0].url) {
            const currentUrl = tabs[0].url;
            if (
              currentUrl.startsWith("https://api.groundedmomentum.com") ||
              currentUrl.startsWith("http://localhost:4200")
            ) {
              clearInterval(intervalId);
              removeListener();

              await browser.windows.remove(windowId);
              resolve();
            }
          }
        } catch (error) {
          clearInterval(intervalId);
          removeListener();
          resolve();
        }
      };

      const intervalId = setInterval(checkUrl, 500);

      const removeListener = () => {
        browser.windows.onRemoved.removeListener(closedListener);
      };

      const closedListener = (closedWindowId: number) => {
        if (closedWindowId === windowId) {
          clearInterval(intervalId);
          removeListener();
          resolve();
        }
      };

      browser.windows.onRemoved.addListener(closedListener);
    });

    let backendResponse;

    try {
      const exchangeResponse = await fetch(
        "https://api.groundedmomentum.com/api/oauth/exchange-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secureToken }),
        }
      );

      if (exchangeResponse.ok) {
        backendResponse = await exchangeResponse.json();
      }
    } catch (error: any) {
      console.error("Google sign-in error during code exchange:", error);

      throw new Error("Google sign-in failed");
    }

    if (!backendResponse) {
      throw new Error("Google sign-in failed");
    }
    return backendResponse;
  } catch (error: any) {
    console.log(error);

    console.error("Google sign-in error:", error);
    throw new Error("Google sign-in failed");
  }
};
